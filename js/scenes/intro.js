FD.add({
  id: 'intro',
  title: 'What is an online community?',
  tab: 'Start',
  icon: 'intro',
  color: '--accent',
  vocab: [
    ['online community', 'a group of people with a shared common interest who communicate online'],
    ['member', 'someone who is part of an online community'],
  ],
  mount(el) {
    const N = ['Aisha', 'Ben', 'Carla', 'Dev', 'Elena', 'Femi', 'Grace', 'Hiro', 'Ines', 'Jamal'];
    const pts = N.map((_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / N.length;
      return [300 + Math.cos(a) * 225, 150 + Math.sin(a) * 112];
    });
    const extra = [[0, 1], [1, 3], [2, 4], [4, 5], [5, 7], [6, 8], [7, 9], [8, 0], [3, 6]];
    const USES = [['💬', 'socialise'], ['📢', 'share information'], ['🎮', 'play games'], ['💼', 'work'], ['🎓', 'learn'], ['🎨', 'create']];
    el.innerHTML = `
      <div class="intro">
        <div class="intro-top">
          <svg class="net" viewBox="0 0 600 300" role="img" aria-label="Members connected in an online community">
            ${extra.map(([a, b]) => `<line class="nl x" x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}"/>`).join('')}
            ${pts.map(([x, y]) => `<line class="nl" x1="300" y1="150" x2="${x}" y2="${y}"/>`).join('')}
            <g class="hub"><circle cx="300" cy="150" r="46"/><text x="300" y="145">Online</text><text x="300" y="163">community</text></g>
            ${pts.map(([x, y], i) => `<g class="nn" style="--d:${i * 70}ms"><circle cx="${x}" cy="${y}" r="21" style="fill:${['#1c7ed6', '#e8590c', '#7048e8', '#2f9e44', '#d6336c', '#0b7f95', '#e67700', '#c92a2a', '#5c7cfa', '#0c8f7e'][i]}"/><text x="${x}" y="${y + 5}">${N[i][0]}</text></g>`).join('')}
          </svg>
          <ul class="uses">${USES.map(([e, t]) => `<li><span>${e}</span>${t}</li>`).join('')}</ul>
        </div>
        <div class="ff">
          <div class="ff-box ff-fn"><h4>Function</h4><p>What the community <b>does</b> for the people who use it.</p><p class="ff-eg">A forum: lets members <b>discuss</b> a topic.</p></div>
          <div class="ff-arrow">◀</div>
          <div class="ff-box ff-ft"><h4>Features</h4><p>The tools that <b>allow</b> it to do its function.</p><p class="ff-eg">Posts · threads · moderators · ratings</p></div>
        </div>
        <div class="feat-grid">
          ${FD.SECTIONS.map((s, i) => `
            <button class="feat" style="--c:var(${s.color})" data-id="${s.id}">
              <span class="feat-ic">${FD.icon[s.id]}</span>
              <span class="feat-txt"><strong><b>${i + 1}</b> ${s.name}</strong><small>${s.line}</small></span>
            </button>`).join('')}
        </div>
      </div>`;
    const root = el.querySelector('.intro'), net = el.querySelector('.net');
    const cards = [...el.querySelectorAll('.feat')], uses = [...el.querySelectorAll('.uses li')];
    cards.forEach((c) => c.addEventListener('click', () => FD.goto(c.dataset.id)));
    return {
      set({ net: n = 'full', uses: u = 0, ff = false, cards: c = 0, glow = false } = {}) {
        net.classList.remove('grow');
        net.classList.toggle('empty', n === 'empty');
        if (n === 'grow') { void net.getBoundingClientRect(); net.classList.add('grow'); }
        uses.forEach((li, i) => li.classList.toggle('on', i < u));
        root.classList.toggle('show-ff', ff);
        cards.forEach((k, i) => { k.classList.toggle('hide', i >= c); k.classList.remove('pop'); });
        root.querySelector('.feat-grid').classList.toggle('glow', glow);
      },
      async popUses(ctx) {
        for (let i = 1; i <= uses.length; i++) {
          if (!(await ctx.sleep(380))) return;
          uses[i - 1].classList.add('on');
        }
      },
      async popCards(ctx) {
        for (const c of cards) {
          if (!(await ctx.sleep(260))) return;
          c.classList.remove('hide');
          c.classList.add('pop');
        }
      },
    };
  },
  steps: [
    {
      title: 'A community… online',
      text: `<p>An <strong>online community</strong> is a group of people with a <strong>shared common interest</strong> who communicate online.</p>
             <p>Each person in the community is a <strong>member</strong>. All online communities let members <strong>interact</strong> with other people.</p>`,
      on: (a) => a.set({ net: 'grow' }),
    },
    {
      title: 'Why do people use them?',
      text: `<p>People use online communities to:</p>
             <ul><li>socialise</li><li>share information</li><li>play games</li><li>work, learn and create.</li></ul>`,
      async on(a, ctx) { a.set({ uses: 0 }); await a.popUses(ctx); },
    },
    {
      title: 'Function and features',
      text: `<p>Every type of online community has:</p>
             <ul><li>a <strong>function</strong>: what it does for the people who use it</li>
             <li><strong>features</strong>: the tools that allow it to achieve its function.</li></ul>
             <p>Different communities have different features that members use to interact with each other.</p>`,
      tip: 'Exam tip: when a question asks for the <strong>function</strong>, say what the community is <em>for</em>. When it asks for <strong>features</strong>, name the tools.',
      on: (a) => a.set({ uses: 6, ff: true }),
    },
    {
      title: 'What you will explore',
      text: `<p>You will explore <strong>seven types</strong> of community: social networking, online gaming, work spaces, VLEs, wikis and forums, user-generated content and social bookmarking.</p>
             <p>Then you will see how communities work <strong>all over the world</strong> and how to <strong>stay safe</strong>.</p>
             <p class="small muted">The internet keeps changing, so features from one type of community are often used by other types too.</p>`,
      async on(a, ctx) { a.set({ uses: 6, ff: true, cards: 0 }); await a.popCards(ctx); },
    },
    {
      title: 'How to use this lesson',
      text: `<ul>
               <li>Press <strong>Next</strong> (→) to go step by step, or <strong>Play</strong> (Space) to watch.</li>
               <li>Scenes marked <span class="try-inline">Interactive</span> have things to click and try.</li>
               <li>After every section there is a short <strong>✓ Check</strong>. The tab turns green when you finish it.</li>
               <li>At the end, do the <strong>Final test</strong> and <strong>copy your results</strong> to send to your teacher.</li>
             </ul>`,
      tip: 'Teachers: press <strong>P</strong> for projector mode and <strong>F</strong> for full screen.',
      on: (a) => a.set({ uses: 6, ff: true, cards: 8, glow: true }),
    },
  ],
});
