---
name: explainer
description: "Explainer page: one interactive HTML page that narrates the workflow of a system and explains its features and its architecture, with diagrams and ASD-STE100 text. Use when the user asks to explain, document, or show a repository, a system, a process, or a proposal as a page."
---

# Explainer

Write one **explainer**: an HTML page that tells the story of a system. The page answers three questions. What are the parts? How does the work move through the parts? What does each part do for the person who uses it? Diagrams carry the answers. Text says what a diagram cannot show, in simplified technical English.

## The page

- **One file, built from the kit.** The skill has no page to copy. Paste three files inline: a style (the role tokens, see "Colour and type"), [`kit/engine.css`](kit/engine.css), and [`kit/engine.js`](kit/engine.js). Then write each block from [`patterns.md`](patterns.md), and write the layout CSS of the page from your style brief (step 3). The layout and the class names of the page are yours: the engine finds each block by its `data-*` hooks.
- **Self-contained.** The CSS, the script, and the SVG are inline. The page makes one network request at most, for the font of the style. System fonts replace it when the request fails.
- **True to the sources.** Every part, arrow, number, and sentence states something that a source you opened in this run states. Each block shows a real example from the sources: a real path, a real command, a real input and its output.
- **Location.** Save the page as `explainer-<slug>.html` at the path the user names, or else in the system temp directory. When the harness has a tool that publishes a page (in Claude Code, `Artifact`), publish the page too, and follow the page rules of that tool.

## Blocks

[`patterns.md`](patterns.md) gives each block: the question it answers, when to use it, and the markup that the engine needs. Use a block when the sources can fill it, and put the blocks in the order that the subject needs.

| Block | Question it answers | Keep it when |
| ----- | ------------------- | ------------ |
| Masthead | What is this? | Always |
| Key numbers | How large is it? | The sources give figures |
| Map | What are the parts? | Always |
| Story | How does the work move? | The system has an order of events |
| Switch | Which path does my case take? | The sources hold a rule that sends the work down one of two or more paths |
| Features | What does each part do for me? | The system has two or more features |
| Chart | How much? | The sources give measurements |
| Pair | What is wrong, and what is right? | A new reader can make a mistake, or the system changes |
| Caution | What can I damage? | The sources name a risk |
| Commands | What do I run first? | The reader can run something |
| Terms | What does each name mean? | The page uses names that the sources define |
| Footer | Where do the facts come from? | Always |

- **Answer first.** The headline states the answer. The lead states the mechanism in two or three sentences.
- **What each block shows.** The map shows the structure: the parts and what each part talks to. The story shows one sequence through those parts. The switch shows a decision: the reader changes the inputs and sees which path the work takes. A system with two workflows gets two stories.
- **A title states the finding.** Write "The redirect service is the only part that reads the link store", not "Architecture diagram".
- **Example before rule.** Show the real input and the real output first. Then state the rule.

## Diagram style

Engineering drawing, drawn to a grid. The grid method in `patterns.md` gives the base unit, the node size, the columns, the rows, and the path for each kind of arrow.

- **Direction:** left to right. A step down in the same column is the only vertical arrow.
- **Node:** a small tag for its kind, a name of two or three words, and one line in the code font below: a path, a command, or an example.
- **Node kinds:** plain is in place today. `focal` is the centre of the page, one in each diagram. `store` holds data. `new` is proposed or not built. `ext` is outside the system: a user, an input, or a neighbour system.
- **Arrow:** one for each relation, with a short label: the verb, or the thing that moves (`reads`, `on miss`, `301`). The label sits above its arrow, not on it. Accent is the main path. Dashed grey is a return or an async flow. Arrows go around nodes and labels, and no two arrows share a line.
- **Zone:** a quiet box around the nodes that belong to one owner, with its name on the top left.
- **Legend:** one entry for each outline, line style, and colour in the diagram.
- **Size:** when the nodes do not fit the grid at the label size of the kit, draw two diagrams.

### Symmetry

Find the axis of each diagram before you place a node. A reader sees a symmetric diagram as one shape, and then sees each exception.

- **Axis:** the main path runs on one horizontal line, and the focal node sits on that line.
- **Columns:** centre each column on the axis. A column with one node fewer than its neighbour sits half a row lower, so that each of its arrows is level with a gap.
- **Fan:** when many parts go through one part, draw a bow-tie: the parts that go in on the left, the one part in the middle, the parts that come out on the right.
- **Branches:** the two paths of a decision mirror above and below the axis, with the same number of nodes on each.
- **Rows:** fill each row of a story. Six steps are three above three. Put the helper of a step in the sub line of its node, not in a node of its own.
- **Lists:** when the count permits, give the feature list a number of columns that fills the last row.

Symmetry arranges true parts. Do not add a part or remove a part to get it.

## Interaction

`kit/engine.js` drives every interaction. It finds each block by a `data-*` hook, not by a class: `data-map`, `data-story`, `data-rule`, `data-features`, `data-copy`, and `data-toc`. `patterns.md` gives the hooks inside each block. The map, the story, and the switch share one mechanism: `data-on` on a node, an arrow, or a label lists the selections that light it. The script lights those parts and dims the others.

- **Map:** the reader selects a part. The panel shows that part: what it does, where it is, what it talks to, and one example. The diagram lights the paths of that part. Give every node a panel article. In a map, `data-on` lists part ids.
- **Story:** the diagram stays in view while the steps scroll. The step that the reader scrolls to lights its parts, and a dot in the accent colour moves along its arrows. The buttons do the same without a scroll. In a story, `data-on` lists step numbers. Write the arrows in the order that the work moves.
- **Switch:** the reader moves a slider, types a number, ticks a box, or selects a preset. The script runs the rule, states the reason in one sentence, lights the path of that case, and shows the steps of that case in the panel. In a switch, `data-on` lists cases.
  - Copy the rule from the code into the `rules` object at the top of the script, and name its file in the figure title. A page without a switch sets `const rules = {};`. Keep each branch and each number of the real rule.
  - Give the controls the names and the units of the real inputs. Set the first values to a real case from the sources.
  - Make one preset for each real case that sits near a limit: at the limit, one past the limit, and the feature turned off.
- **Features:** the reader filters the list by group.
- **Commands:** the reader copies a block.
- **Top bar:** the link of the section on the screen takes the accent colour.

The page is complete before the reader touches it. The map and the story show all their parts. The panel shows the focal part. The switch shows its first case.

## Colour and type

The kit reads role tokens, not colours. A style gives each token its value, for the light and the dark theme. [`styles/default.css`](styles/default.css) is the default style. The token contract: a style sets each of these tokens.

| Token | Role |
| ----- | ---- |
| `--bg`, `--bg-subtle` | The page, and a quiet area: a zone, a store, a part outside the system |
| `--line`, `--line-strong` | A hairline, and the outline of a box or a part outside the system |
| `--text`, `--text-2`, `--text-3` | Text, secondary text, and the grey of the diagram parts and the baseline bars |
| `--accent`, `--accent-soft` | The part in focus, and its fill |
| `--ok`, `--bad` | Right and wrong |
| `--warn` | The word `CAUTION` or `WARNING` |
| `--font-text`, `--font-code` | Titles and sentences, and code |

- A style that gives one theme only, such as "dark navy paper", sets the same values for the light and the dark theme.
- A style can add tokens of its own, such as a heading font, for the layout CSS. The kit reads only the tokens above.
- When a style forbids a colour for a role, give the role a value that the style allows. The role keeps its meaning.

- **Accent** is the part in focus: the main path, the focal node, the selected part, the active step, a link.
- **Bad and ok** mark wrong and right, as a small mark next to text. **Warn** marks the word `CAUTION` or `WARNING`. These three colour no sentence and no area.
- **Grey** is everything else. Hairlines divide.
- **Code font** is for paths, commands, code, numbers, and the small uppercase labels. **Text font** is for titles and sentences.
- **Chart:** grey bars are the baseline and accent bars are the subject, to one scale that starts at zero. Each bar shows its value as text.

## Writing rules (ASD-STE100)

Write all page text to these rules. On a page in another language, apply the limits and the verb rules, and skip the English word list.

Limits:

| Item | Maximum |
| ---- | ------- |
| Sentence that gives an instruction | 20 words |
| Sentence that describes | 25 words |
| Paragraph | 6 sentences, one topic |
| Noun cluster | 3 words |
| Instructions in one sentence | 1, unless the actions occur at the same time |

Verbs:

| Form | Example | Use it |
| ---- | ------- | ------ |
| Command | Copy the skills. | yes |
| Simple present, past, or future | The hook blocks the read. | yes |
| Infinitive | Set the variable to stop the hook. | yes |
| Past participle as an adjective | The blocked read | yes |
| Progressive (-ing) | The hook is blocking the read. | no |
| Perfect | The hook has blocked the read. | no |
| Passive in a procedure | The skills must be copied. | no |

Words:

- One name for one thing, on the whole page. Take the name from the sources: the real file, command, flag, or symbol. The Terms block defines each name one time.
- One meaning for one word. When "check" means "examine", it does not also mean "a test".
- Keep "the", "a", and "this".
- Use the short, common word: use not utilize, start not commence, before not prior to, about not approximately, make sure not ensure, to not in order to, help not facilitate.
- Active voice. Say who does what: "The adapter blocks the read", not "The read is blocked".
- Put the condition before the instruction: "To stop the hook, set the variable to `false`."
- Use a vertical list for three or more items, and a numbered list for a sequence.

Warnings go in a caution block: the command first, then the reason. `WARNING` is for a risk to a person. `CAUTION` is for a risk to data or equipment. Example: "CAUTION: Do not put the API key in the repository. Git keeps each commit."

Rewrite check, with the same meaning in 10 words:

- Before: "Interception of oversized file reads is facilitated by a thin adapter layer prior to tool execution."
- After: "A thin adapter stops each large read before it runs."

## Steps

### 1. Pin the story

Settle three things before you read in depth:

- **Subject**: the system the page explains.
- **Question**: the one question the headline answers.
- **Out of scope**: what the sources cover and the page leaves out.

Take each from the request. Ask the user only when the request does not name the subject.

Done when you can fill in this sentence: "This page explains SUBJECT, answers QUESTION, and leaves out TOPICS."

### 2. Read, then outline

Read the sources. Write an outline with these lists:

- **Parts**: the name, the kind, the path, and what the part talks to.
- **Steps**: each workflow as steps in order, with the parts that each step touches.
- **Rules**: each rule that sends the work down a path, with its inputs, its limits, its cases, and the `path:line` of the code.
- **Features**: what each one does for the user, its group, and one real example.
- **Numbers**: each figure or measurement, with its unit and its source.
- **Terms**: each name the page will use, with one meaning.

Mark each part as in place or not built, as the sources say. When the sources do not say, ask the user.

Done when every item in the outline has a source that you opened, and every name has one meaning.

### 3. Choose the style and the form

Write a brief before any CSS and any markup.

**Style.** Take the style from the first source that applies:

1. The prompt describes a style: use that description.
2. The prompt points at a file: tokens, CSS, a design document, a brand guide, or a reference page. The file is a source, not a page to copy: map it onto the token contract (see "Colour and type").
3. Otherwise: [`styles/default.css`](styles/default.css).

The style brief states:

- **Palette**: a value for each role token, for the light and the dark theme. Contrast holds in both themes.
- **Type pair**: the text font and the code font.
- **Density and measure**: the spacing, and the line length of the text.
- **Shape and line**: the corners, the line weights, and the dividers.
- **Diagrams**: how this style draws a node, an edge, and a zone.

**Form.** Pick the lead block from what the content is:

- A process leads with the story.
- A system that a rule governs leads with the switch.
- A proposal leads with the pair.
- A structure leads with the map.

Order the other blocks by what the reader needs next. A pattern may take another layout than its snippet (side panel, stacked, full bleed, columns), as long as its hooks stay. When the content needs a block that `patterns.md` lacks, build it under the same truth rules and writing rules.

Done when the brief names the style source, the token values, the type pair, and the block order with one reason for the lead block.

### 4. Draw, then write

Build the page from the brief, the kit, and the patterns:

1. Write the layout CSS of the page from the style brief. Use the role tokens, not colour values.
2. Paste the style tokens, `kit/engine.css`, and `kit/engine.js` inline. Put the layout CSS after the kit CSS. The layout CSS can restyle the diagram classes of the kit, but each node kind and edge kind keeps its meaning.
3. Fill the blocks in the order of the form. Find the axis of each diagram first. Write the rule of a switch in the script before its controls.
4. Write the masthead headline last, so that it states what the diagrams show.
5. Write the footer: each source one time, and what the page leaves out.

Keep the comments of the kit inside `<style>` and `<script>`. Delete every other comment.

Done when no word of the sample content remains, and every sentence meets the writing rules.

### 5. Look at the page

Find a headless browser: `chromium`, `google-chrome`, `chrome`, or `msedge` on the `PATH`. Under WSL, a Windows browser under `/mnt/c/Program Files/` also works, and it takes paths in the form that `wslpath -w` prints.

Take four screenshots: 1280 px wide and 390 px wide, each in the light and in the dark theme. Render through a wrapper file saved next to the page. The `iframe` sets the width and the theme, which the command line cannot do in every browser. Use the same width and height in `--window-size`, and a height that shows the footer.

```html
<!doctype html><body style="margin:0"><iframe src="PAGE.html" style="display:block; border:0; width:390px; height:6000px; color-scheme:dark"></iframe>
```

```sh
BROWSER --headless --hide-scrollbars --enable-logging=stderr --window-size=390,6000 --screenshot=SHOT.png file:///PATH/wrapper.html
```

Open each screenshot and check it:

- Every label sits inside its node, and no arrow crosses a node or a label.
- Each diagram has one axis, and the two sides of the axis match.
- Every label and line stands out from its background, in both themes.
- At 390 px the text wraps inside the screen, and each diagram scrolls inside its frame.
- With the text covered, the map and the story diagram still answer their questions.
- The page follows its style brief, and its layout CSS is not a copy of an earlier explainer. When an `explainer-*.html` file exists in the repo, diff the layout CSS against it.

Read the browser output: a line that contains `CONSOLE` and `Uncaught` is a script error. For each switch, calculate the case of each preset from the code by hand, and compare it with what the rule in the script returns. Fix the page and render it again until every check passes. Delete the wrapper file.

Done when the four screenshots pass every check, the browser reports no script error, and each preset gives the case that the code gives. When you find no browser, the page is unchecked: say so in the reply.

**Reply:** the absolute path of the page, the link when you published it, the sentence from step 1, the style source, the block order, and the screenshot paths or the statement that you could not render the page.

## Examples

### Wrong and right text

Question: "What does context-router do?"

- Wrong: "The plugin leverages a host adapter abstraction to facilitate seamless interception of large file reads prior to delegating analysis."
- Right: "The adapter blocks each read of more than 150 lines. The agent then runs `bulk-read`. A second model reads the file and returns a short answer."

The right text has one thought in each sentence, names who does what, and uses the real command name.

### Pick the block

| The sources say | Block | Why |
| --------------- | ----- | --- |
| "The hook starts the adapter, then the agent runs `bulk-read`" | Story | It is a sequence |
| "`decideRead` returns allow for 150 lines or fewer, and block for more" | Switch | It is a rule with a limit and two paths |
| "Five hosts: Claude Code, Codex, Pi, Copilot, OpenCode" | Map | The hosts are parts with relations |
| "14340 tokens without, 463 tokens with" | Chart | It is a measurement with a baseline |
| "`cat` is intercepted, a pipe is not" | Pair | A reader can get this wrong |
| "Run `npm install` in `plugins/context-router`" | Commands | The reader runs it |
