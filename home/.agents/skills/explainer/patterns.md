# Patterns

One entry for each block of an explainer page. Each entry gives the question that the block answers, when to use it, and the markup that the engine needs. The markup shows only the hooks: the `data-*` attributes, the required children, and the SVG grammar. Add your own elements, class names, and layout around them.

The page carries the kit inline: `kit/engine.css` after the style, and `kit/engine.js` at the end of the body. The sample text is about a link shortener: replace all of it.

## Diagram grammar

The map, the story, and the switch draw their diagrams with the same SVG classes. `kit/engine.css` styles them.

Arrowheads. Put this one time in the page, before the first diagram:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L10,5 L0,9 z"/></marker>
    <marker id="a-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L10,5 L0,9 z"/></marker>
  </defs>
</svg>
```

Frame. Put each diagram in an element with `data-frame`. On a narrow screen the diagram scrolls sideways inside it, and the engine brings the selected part into view. Give the `svg` a `min-width` so that its labels stay legible.

```html
<div data-frame>
  <svg viewBox="0 0 936 260" width="936" role="img" aria-label="One sentence that says what the diagram shows.">
    <g class="zone"><rect x="254" y="24" width="658" height="212" rx="8"/><text x="270" y="44">Short link service</text></g>
    <path class="e main" d="M198,136 H274"/>
    <text class="elabel" x="236" y="128">asks</text>
    <g class="n focal" transform="translate(278,104)">
      <rect width="150" height="64" rx="6"/><text class="tag" x="10" y="16">Edge</text>
      <text class="name" x="75" y="38">Edge cache</text><text class="sub" x="75" y="53">keeps answers</text>
    </g>
  </svg>
</div>
```

| Class | Part | Kinds |
| ----- | ---- | ----- |
| `zone` | a `g` with a `rect` and a `text`: the nodes of one owner | — |
| `n` | a `g` with a `rect`, a `tag`, a `name`, a `sub`, and an optional `num` | plain: in place today. `focal`: the centre of the page, one in each diagram. `store`: holds data. `new`: not built. `ext`: outside the system |
| `e` | a `path`: one relation | plain. `main`: the main path. `back`: a return or an async flow. `join`: ends on another edge, no arrowhead. `new`: not built |
| `elabel` | a `text`: the verb, or the thing that moves | `side`: on a vertical part of an edge |

Draw zones first, then edges, then labels, then nodes. Write the edges of a story in the order that the work moves: the dot goes along the lit edges in the order of the file.

`data-on` on a node, an edge, or a label lists the selections that light it, with spaces between them. The engine lights those parts and dims the others. The map lists part ids, the story lists step numbers, and the switch lists cases.

Legend. One entry for each outline, line style, or colour in the diagram. A `span class="key"` with a kind draws the key: `focal`, `store`, `new`, `ext`, `zone`, `main`, `edge` (a plain edge), `back`, or no kind for a plain node. A chart uses `base` and `subject`.

```html
<ul>
  <li><span class="key focal"></span>Centre of this page</li>
  <li><span class="key main"></span>Main path, or a path of the selected part</li>
</ul>
```

## Grid method

Draw each diagram to a grid. Choose one base unit `u` for the page, and make each size and each gap a multiple of `u`. The numbers in brackets are the default, at `u` = 8 with a node 150 wide.

Sizes:

| Item | Rule | Default |
| ---- | ---- | ------- |
| Node | `W` wide, to hold the longest name at the kit label size. `8u` high | 150 x 64 |
| Column gap | `10u`, to hold an edge label | 80: columns at x = 48, 278, 508, 738 |
| Row gap | `3u` | 24: rows at y = 60, 148, 236, in steps of 88 |
| Margin | `6u` around the drawing | 48 |
| Zone | `3u` outside its nodes at the sides and the bottom, `4.5u` above the top row. Its name `2.5u` below its top border | 24, 36, 20 |
| viewBox | the right edge of the last column in use plus the margin, the bottom of the lowest node plus the margin. Set `width` to the viewBox width, so that a diagram never shows larger than its drawing | — |

With three columns, use x = 48, 393, 738, or x = 48, 278, 508 with a viewBox 706 wide. A node alone in its column sits level with the middle of the rows in use.

Edges:

- An edge goes from the right side of a node (`x + W`) to `u/2` before the left side of the next node, at `y + H/2`. Two edges on one side use `y + H/2 - 1.5u` and `y + H/2 + 1.5u` (`y + 20` and `y + 44`).
- Same row: `M x1,y H x2`
- Other row: `M x1,y1 H mx-u Q mx,y1 mx,y1±u V y2∓u Q mx,y2 mx+u,y2 H x2`, with `mx = x2 - 2.5u`, so that the first straight part holds the label.
- Join: an edge that ends on another edge has `class="e join"` and no arrowhead.
- To a zone: an edge that ends `u/2` before a zone border, level with a gap between two nodes, applies to every node in the zone.
- Shared trunk: where edges share a line, draw the line in parts, one part between each two branches, so that no two edges overlap.

Labels:

- `class="elabel"`, centred `u` above the longest straight part of the edge. For the lower of two edges on one side, `1.75u` below (14).
- On a vertical part: `class="elabel side"` at `x + u`, level with the middle of the part.

Symmetry:

- Draw the main path on one horizontal axis, with the focal node on it. Centre every column on that axis, and mirror branches above and below it.
- A column with one node fewer than its neighbour sits half a row lower, so that each of its edges is level with a gap.

Story grid. The same rules apply, with these changes:

- Margin `3u`. Row gap of about `8u`, to hold the edge to the next row and its label. Default: columns at x = 24, 254, 484, rows at y = 40, 170, 300, a viewBox 658 wide and the bottom of the lowest node plus 40 high.
- Fill each row. A row with two nodes sits in the middle, half a column pitch in (x = 139 and 369). Put a helper of a step in the sub line of its node, not in a node of its own.
- A vertical edge goes from the bottom of a node (`y + H`) to `u/2` above the node below.
- Next row: from the bottom of the last node of a row to the top of the first node of the next row, through the gap between the rows: `M x1,y1 V g-u Q x1,g x1-u,g H x2+u Q x2,g x2,g+u V y2`, with `g` in the middle of the gap.
- `<text class="num" x="140" y="16">01</text>` inside a node is its step number. Use it only when each node belongs to one step.

## Top bar

Question: where am I on the page? Use it on every page with three or more sections.

`data-toc` holds the section links. The engine gives `aria-current` to the link of the section on the screen. Put the link to the top of the page outside `data-toc`. A line that grows as the reader scrolls is optional: draw it in CSS with `animation-timeline: scroll(root)`.

```html
<a href="#top">Short links</a>
<nav data-toc aria-label="Sections">
  <a href="#parts">Parts</a>
  <a href="#flow">Workflow</a>
</nav>
```

## Masthead

Question: what is this? Use it always.

The subject, the answer as a headline, the mechanism in two or three sentences, and where the facts come from: the repo, the commit, the date. No hook.

```html
<header id="top">
  <p>Link shortener</p>
  <h1>A short link opens the long page in one hop</h1>
  <p>The browser asks for a short link. The redirect service finds the long address and answers with a redirect.</p>
  <p><span>repo shortlinks</span> <span>commit 4f2a9c1</span> <span>2 October 2026</span></p>
</header>
```

## Key numbers

Question: how large is it? Use it when the sources give figures. Only real figures from the sources. No hook.

```html
<ul>
  <li><b>4</b> parts</li>
  <li><b>12 ms</b> answer from the cache</li>
</ul>
```

## Map

Question: what are the parts? Use it always.

The reader selects a part. The panel shows what the part does, where it is, what it talks to, and one example. The diagram lights the paths of that part.

Hooks:

- `data-map` on the block. The `svg` inside `data-frame` is the diagram.
- `data-show` on each node: the id of its panel article. Give the node `tabindex="0"`, `role="button"`, and an `aria-label`.
- `data-on` lists part ids. A node lists itself and each part that it has a path to. An edge and its label list each part whose path runs along the edge.
- `data-panel` on the panel, with one `article` for each part as a direct child, with the part id as its `id`. The article with `class="is-on"` shows first, and its node has `class="is-sel"`. Give the panel `aria-live="polite"`.

```html
<div data-map>
  <figure>
    <figcaption>The redirect service is the only part that reads the link store.</figcaption>
    <div data-frame>
      <svg viewBox="0 0 936 260" width="936" role="img" aria-label="...">
        <path class="e main" data-on="p-cache p-redirect" d="M428,136 H504"/>
        <text class="elabel" data-on="p-cache p-redirect" x="466" y="128">on miss</text>
        <g class="n focal is-sel" transform="translate(508,104)" data-show="p-redirect" data-on="p-redirect p-cache" tabindex="0" role="button" aria-label="Redirect service">
          <rect width="150" height="64" rx="6"/><text class="tag" x="10" y="16">Service</text>
          <text class="name" x="75" y="38">Redirect service</text><text class="sub" x="75" y="53">src/redirect.ts</text>
        </g>
      </svg>
    </div>
  </figure>
  <aside data-panel aria-live="polite">
    <article id="p-redirect" class="is-on">
      <h3>Redirect service</h3>
      <p>The redirect service reads the long address and answers with status 301.</p>
      <dl><dt>Where</dt><dd><code>src/redirect.ts</code></dd></dl>
    </article>
  </aside>
</div>
```

## Story

Question: how does the work move? Use it when the system has an order of events. A system with two workflows gets two stories.

The diagram stays in view while the steps scroll: give the figure `position: sticky`, or another layout that keeps it on the screen. The step that crosses a line at 60% of the screen height lights its parts, and a dot moves along its edges. The buttons do the same without a scroll.

Hooks:

- `data-story` on the block. The `svg` inside `data-frame` is the diagram.
- `data-step` on each step. The engine numbers the steps from 1, in the order of the file, and gives the active step `class="is-on"`. Style `.is-on` on the step.
- `data-on` lists step numbers.
- `data-go` on a button: `-1` is one step back, `1` is one step on, `0` shows all steps. Optional.
- `data-count` on an element that shows "Step 2 of 4". Optional.

```html
<div data-story>
  <figure>
    <div data-frame>
      <svg viewBox="0 0 658 274" width="658" role="img" aria-label="...">
        <path class="e" data-on="1" d="M289,60 H365"/>
        <text class="elabel" data-on="1" x="327" y="52">asks</text>
        <g class="n ext" data-on="1" transform="translate(139,40)">...</g>
      </svg>
    </div>
    <button type="button" data-go="-1">Back</button>
    <button type="button" data-go="1">Next</button>
    <button type="button" data-go="0">All steps</button>
    <output data-count>All steps</output>
  </figure>
  <ol>
    <li data-step><h3>The browser asks for the short link</h3><p>The request arrives at the edge cache.</p></li>
  </ol>
</div>
```

## Switch

Question: which path does my case take? Use it when the sources hold a rule that sends the work down one of two or more paths.

The reader changes the inputs. The engine runs the rule, states the reason in one sentence, lights the path of that case, and shows the steps of that case in the panel.

Hooks:

- `data-rule` on the block: the name of a function in the `rules` object at the top of `kit/engine.js`. Copy the real rule from the sources. The rule gets the values of the controls by name, and returns `{ case, note }`.
- An `input` with a `name` for each value of the rule: a range, a number, or a checkbox. Put the inputs in a `form` or not.
- `data-value="NAME"` on an element that shows the value of the range or number input `NAME`. Optional.
- `data-set` on a button holds values for one real case, as JSON: `data-set='{"kept": true, "age": 61}'`.
- `data-note` on the element that shows the sentence of the rule.
- `data-on` lists cases. The `svg` inside `data-frame` is the diagram. The branches mirror above and below the axis.
- `data-panel` with one `article` for each case as a direct child, with `data-case`.

```html
<div data-rule="answer">
  <form>
    <label>Age of the answer: <b data-value="age"></b> minutes <input name="age" type="range" min="0" max="120" value="20"></label>
    <label><input name="kept" type="checkbox" checked> The edge cache has the answer</label>
    <button type="button" data-set='{"kept": true, "age": 60}'>60 minutes old</button>
    <button type="button" data-set='{"kept": true, "age": 61}'>61 minutes old</button>
    <button type="button" data-set='{"kept": false}'>First request</button>
    <output data-note></output>
  </form>
  <div data-frame><svg ...><path class="e" data-on="hit" d="..."/></svg></div>
  <aside data-panel aria-live="polite">
    <article data-case="hit" class="is-on"><h3>The edge cache answers</h3><ol><li>...</li></ol></article>
    <article data-case="miss"><h3>The redirect service answers</h3><ol><li>...</li></ol></article>
  </aside>
</div>
```

## Features

Question: what does each part do for me? Use it when the system has two or more features. Each item shows one real example.

Hooks:

- `data-features` on an element that holds the buttons and the items.
- `data-filter` on each button: a group name, or `*` for all. The engine gives the selected button `class="is-on"` and `aria-pressed="true"`. Style `.is-on` on the button.
- `data-group` on each item. The engine hides the items of the other groups.

```html
<section data-features>
  <div role="group" aria-label="Filter the features">
    <button type="button" class="is-on" data-filter="*" aria-pressed="true">All</button>
    <button type="button" data-filter="make" aria-pressed="false">Make a link</button>
  </div>
  <ul>
    <li data-group="make"><h3>Custom alias</h3><p>You select the text after the slash.</p><code>POST /links {"alias": "docs"}</code></li>
  </ul>
</section>
```

## Chart

Question: how much? Use it when the sources give measurements.

Bars to one scale that starts at zero. A bar in `--text-3` is the baseline, a bar in `--accent` is the subject. Each bar shows its value as text. A figure title, a legend with the keys `base` and `subject`, and a source line. No hook: set `--max` to the largest value on the chart and `--v` on each bar, and make the length of a bar `calc(var(--v) / var(--max) * 100%)` of its track.

```html
<figure>
  <figcaption>Time to answer one request. Milliseconds, median of 1,000 requests.</figcaption>
  <div style="--max: 140">
    <span>Europe</span>
    <span style="--v: 85"><i></i>85 ms</span>
    <span class="subject" style="--v: 12"><i></i>12 ms</span>
  </div>
  <p>Source: load test report, 28 September 2026.</p>
</figure>
```

## Pair

Question: what is wrong, and what is right? Use it when a new reader can make a mistake, or the system changes (before and after).

Two boxes side by side. A small mark next to each label: a cross in `--bad` for wrong, a tick in `--ok` for right. The colour marks only the label, not the box. No hook.

```html
<div>
  <div><p>✕ Wrong</p><p><code>POST /links {"alias": "My Docs"}</code></p><p>The service answers with status 400.</p></div>
  <div><p>✓ Right</p><p><code>POST /links {"alias": "my-docs"}</code></p><p>The service answers with status 201.</p></div>
</div>
```

## Caution

Question: what can I damage? Use it for each risk that the sources name.

The word `CAUTION` or `WARNING` in `--warn`, then the command, then the reason. No hook.

```html
<p><b>CAUTION</b> Do not put a secret in the long address. The link store keeps each address as plain text.</p>
```

## Commands

Question: what do I run first? Use it when the reader can run something. One block for each action.

Hook: `data-copy` on an element that holds a `pre` and a `button`. The button copies the text of the `pre`.

```html
<div data-copy><pre><code>curl -X POST https://sho.rt/links -d '{"target": "https://example.org/a-long-address"}'</code></pre><button type="button">Copy</button></div>
```

## Terms

Question: what does each name mean? Use it when the page uses names that the sources define. Each name one time. No hook.

```html
<dl>
  <dt>short link</dt><dd>The address that the reader opens.</dd>
  <dt>miss</dt><dd>A request for which the edge cache has no answer.</dd>
</dl>
```

## Footer

Question: where do the facts come from? Use it always. Each source one time, and what the page leaves out. No hook.

```html
<footer>
  <p><b>Sources.</b> <code>src/redirect.ts</code>. <code>edge/cache.toml</code>. Load test report, 28 September 2026.</p>
  <p><b>Not on this page.</b> Accounts, billing, and the admin screen.</p>
</footer>
```
