(() => {
  // Switch rules. One function for each switch, with the name in its data-rule. Copy the real rule from the sources.
  // A rule gets the values of the controls by name. It returns the case and one sentence that states the reason.
  const rules = {
    answer: ({ kept, age }) => {
      if (!kept) return { case: 'miss', note: 'The edge cache has no answer. The redirect service answers.' };
      if (age <= 60) return { case: 'hit', note: `The answer is ${age} minutes old. The edge cache answers.` };
      return { case: 'miss', note: `The answer is ${age} minutes old. That is more than 60, and the redirect service answers.` };
    },
  };

  // The engine finds each block by a data-* hook, not by a class. The page layout and its class names are free.
  const all = (sel, root = document) => [...root.querySelectorAll(sel)];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On a narrow screen a diagram scrolls sideways: bring one part into the middle of its frame.
  const pan = (part) => {
    const frame = part.closest('[data-frame]');
    if (!frame || frame.scrollWidth <= frame.clientWidth) return;
    const f = frame.getBoundingClientRect();
    const b = part.getBoundingClientRect();
    frame.scrollLeft += b.left + b.width / 2 - f.left - f.width / 2;
  };

  // Move a dot along the lit edges of a diagram, in the order of the edges in the file.
  const travel = (svg) => {
    cancelAnimationFrame(svg.raf);
    let dot = svg.querySelector('.dot');
    if (!dot) {
      dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', 'dot');
      dot.setAttribute('r', '4.5');
      svg.append(dot);
    }
    dot.setAttribute('visibility', 'hidden');
    const edges = all('.e.is-on', svg);
    if (still || !edges.length) return;
    const lengths = edges.map((e) => e.getTotalLength());
    const total = lengths.reduce((a, b) => a + b, 0);
    const time = total * 4;
    const start = performance.now();
    const frame = (now) => {
      let d = Math.min(1, (now - start) / time) * total;
      let i = 0;
      while (i < edges.length - 1 && d > lengths[i]) d -= lengths[i++];
      const p = edges[i].getPointAtLength(d);
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      dot.setAttribute('visibility', now - start < time ? 'visible' : 'hidden');
      if (now - start < time) svg.raf = requestAnimationFrame(frame);
    };
    svg.raf = requestAnimationFrame(frame);
  };

  // Light the parts of one selection: a part id, a step number, or a case. An empty selection lights all parts.
  const light = (svg, selection, move) => {
    svg.classList.toggle('is-lit', selection !== '');
    all('[data-on]', svg).forEach((el) => el.classList.toggle('is-on', el.dataset.on.split(' ').includes(selection)));
    if (move) travel(svg);
  };

  // Top bar: mark the link of the section on the screen. data-toc holds the section links.
  const links = all('[data-toc] a');
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const mark = () => {
    const i = sections.findLastIndex((el) => el.getBoundingClientRect().top <= innerHeight * 0.35);
    links.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  };
  addEventListener('scroll', mark, { passive: true });
  mark();

  // Map: select a part, show its panel article, light its paths. Before the first selection, the map shows all parts.
  all('[data-map]').forEach((map) => {
    const svg = map.querySelector('[data-frame] svg');
    const show = (id) => {
      all('[data-show]', map).forEach((n) => n.classList.toggle('is-sel', n.dataset.show === id));
      all('[data-panel] > article', map).forEach((a) => a.classList.toggle('is-on', a.id === id));
      light(svg, id, false);
    };
    all('[data-show]', map).forEach((n) => {
      n.addEventListener('click', () => show(n.dataset.show));
      n.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        show(n.dataset.show);
      });
    });
    const selected = map.querySelector('[data-show].is-sel');
    if (selected) pan(selected);
  });

  // Story: light the parts of one step. Step 0 shows all steps.
  all('[data-story]').forEach((story) => {
    const svg = story.querySelector('[data-frame] svg');
    const out = story.querySelector('[data-count]');
    const steps = all('[data-step]', story);
    if (!steps.length) return;
    let current = 0;
    const set = (n) => {
      current = n;
      light(svg, n ? String(n) : '', true);
      steps.forEach((step, i) => step.classList.toggle('is-on', i + 1 === n));
      if (out) out.textContent = n ? `Step ${n} of ${steps.length}` : 'All steps';
      const on = svg.querySelector('.n.is-on');
      if (on) pan(on);
    };
    steps.forEach((step, i) => step.addEventListener('click', () => set(i + 1)));
    all('[data-go]', story).forEach((b) => b.addEventListener('click', () => {
      const d = Number(b.dataset.go);
      set(d ? Math.min(steps.length, Math.max(1, current + d)) : 0);
    }));
    // While the steps cross a line at 60% of the screen height, the step on that line is the active step.
    let scrolled = 0;
    addEventListener('scroll', () => {
      const line = innerHeight * 0.6;
      if (steps[0].getBoundingClientRect().top > line || steps.at(-1).getBoundingClientRect().bottom < line) return;
      const n = steps.findLastIndex((step) => step.getBoundingClientRect().top <= line) + 1;
      if (n === scrolled) return;
      scrolled = n;
      set(n);
    }, { passive: true });
  });

  // Switch: read the controls, run the rule, light the case, show its panel article.
  all('[data-rule]').forEach((sw) => {
    const svg = sw.querySelector('[data-frame] svg');
    const note = sw.querySelector('[data-note]');
    const update = (move) => {
      const values = {};
      all('input[name]', sw).forEach((input) => {
        values[input.name] = input.type === 'checkbox' ? input.checked : input.value === '' ? null : Number(input.value);
        const shown = sw.querySelector(`[data-value="${input.name}"]`);
        if (shown) shown.textContent = Number(input.value).toLocaleString('en');
      });
      const result = rules[sw.dataset.rule](values);
      if (note) note.textContent = result.note;
      all('[data-panel] > article', sw).forEach((a) => a.classList.toggle('is-on', a.dataset.case === result.case));
      light(svg, result.case, move);
    };
    sw.addEventListener('input', () => update(true));
    sw.addEventListener('submit', (e) => e.preventDefault());
    all('[data-set]', sw).forEach((b) => b.addEventListener('click', () => {
      Object.entries(JSON.parse(b.dataset.set)).forEach(([name, value]) => {
        const input = sw.querySelector(`input[name="${name}"]`);
        if (input.type === 'checkbox') input.checked = value;
        else input.value = value ?? '';
      });
      update(true);
    }));
    update(false);
  });

  // Features: show one group. data-filter on a button matches data-group on the items.
  all('[data-features]').forEach((block) => {
    const buttons = all('[data-filter]', block);
    const items = all('[data-group]', block);
    buttons.forEach((b) => b.addEventListener('click', () => {
      buttons.forEach((x) => {
        x.classList.toggle('is-on', x === b);
        x.setAttribute('aria-pressed', String(x === b));
      });
      items.forEach((item) => { item.hidden = b.dataset.filter !== '*' && item.dataset.group !== b.dataset.filter; });
    }));
  });

  // Commands: copy the block. data-copy holds the pre and its button.
  all('[data-copy]').forEach((box) => {
    const b = box.querySelector('button');
    const pre = box.querySelector('pre');
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent);
        b.textContent = 'Copied';
        setTimeout(() => { b.textContent = 'Copy'; }, 1500);
      } catch {
        getSelection().selectAllChildren(pre);
      }
    });
  });
})();
