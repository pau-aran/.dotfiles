#!/usr/bin/env bash
# Build the pinned GoRex source with WSL, Catppuccin Mocha and left-side tabs, then install it on Windows.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
revision=b206e67bf0ac422afebc5c9e701a38dd67f2c837
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

arch="$(powershell.exe -NoProfile -NonInteractive -Command '[System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture' | tr -d '\r')"
case "$arch" in
  X64) target=amd64 ;;
  Arm64) target=arm64 ;;
  *) echo "GoRex: unsupported Windows architecture: $arch" >&2; exit 1 ;;
esac

git -C "$work" init -q
git -C "$work" fetch -q --depth=1 https://github.com/egoist/gorex.git "$revision"
git -C "$work" checkout -q --detach FETCH_HEAD
git -C "$work" apply "$here/gorex-wsl-sidebar.patch"
(cd "$work" && go tool mygo build -platform "windows/$target")

GOREX_BUILD="$(wslpath -w "$work/build/windows-$target")" \
WSLENV="${WSLENV:+$WSLENV:}GOREX_BUILD" \
powershell.exe -NoProfile -NonInteractive -Command '
  $ErrorActionPreference = "Stop"
  $dest = Join-Path $env:LOCALAPPDATA "Programs\GoRex WSL\Sidebar"
  $exe = Join-Path $dest "GoRex WSL.exe"
  if (Get-Process -Name "GoRex WSL" -ErrorAction SilentlyContinue | Where-Object Path -eq $exe) {
    throw "GoRex: quit and end all GoRex WSL sessions before reinstalling."
  }
  New-Item -ItemType Directory -Path $dest -Force | Out-Null
  foreach ($file in "GoRex WSL.exe", "ghostty-vt.dll", "icon.png") {
    Copy-Item -LiteralPath (Join-Path $env:GOREX_BUILD $file) -Destination $dest -Force
  }
  $programs = [Environment]::GetFolderPath("Programs")
  $link = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $programs "GoRex.lnk"))
  $link.TargetPath = $exe
  $link.WorkingDirectory = $dest
  $link.Save()
  # GoRex windows poll this folder, so open-gorex-tab can add tabs and panes to a running window.
  $control = Join-Path $env:LOCALAPPDATA "GoRex WSL\control"
  New-Item -ItemType Directory -Path $control -Force | Out-Null
  [Environment]::SetEnvironmentVariable("GOREX_DEBUG", $control, "User")
  Write-Output "Installed GoRex for Windows. Open GoRex from the Start menu."
'
