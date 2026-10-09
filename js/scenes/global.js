FD.add({
  id: 'global',
  title: 'Communication and collaboration on a global scale',
  tab: 'Global',
  icon: 'global',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['global', 'covering the whole world'],
    ['collaborate', 'work together with other people'],
    ['translation tool', 'software that changes text from one language into another'],
  ],
  mount(el) {
    const REG = [
      { n: 'Asia', p: 48.4, x: 545, y: 105, c: '#fcc419' },
      { n: 'Americas', p: 21.8, x: 175, y: 120, c: '#f06595' },
      { n: 'Europe', p: 19, x: 375, y: 78, c: '#4dabf7' },
      { n: 'Africa', p: 9.8, x: 395, y: 195, c: '#ffd43b' },
      { n: 'Oceania', p: 1, x: 620, y: 262, c: '#51cf66' },
    ];
    const LAND = [
      'M60 62L170 40L252 50L232 112L190 150L152 178L112 142L72 112Z',
      'M188 190L242 200L252 240L226 300L205 332L194 270L178 222Z',
      'M335 62L402 48L424 88L384 112L346 102Z',
      'M338 132L422 126L452 170L432 242L396 282L370 232L334 172Z',
      'M428 52L600 38L684 80L644 142L582 172L520 162L470 132L432 102Z',
      'M578 240L652 234L664 282L602 292Z',
    ];
    const ARCS = [[0, 2], [1, 2], [3, 0], [1, 4], [2, 3], [0, 4], [1, 0]];
    const POSTS = [
      { who: 'Lucía Gómez', k: 4, flag: '🇪🇸', o: '¡Hola a todos! Mañana empieza nuestro proyecto.', t: 'Hello everyone! Our project starts tomorrow.', lang: 'Spanish' },
      { who: 'Kenji Sato', k: 2, flag: '🇯🇵', o: '写真をアップロードしました。見てください！', t: 'I have uploaded the photos. Please have a look!', lang: 'Japanese' },
      { who: 'Amara Diallo', k: 7, flag: '🇸🇳', o: 'Merci pour votre aide avec le wiki.', t: 'Thank you for your help with the wiki.', lang: 'French' },
    ];
    const HELLO = ['Hello', 'Hola', 'Bonjour', 'Olá', 'Hallo', 'Ciao', 'Merhaba', 'Jambo', 'Привет', 'नमस्ते', 'こんにちは', '你好', 'مرحبا', 'Sawubona', 'Kia ora'];

    el.innerHTML = `
      <div class="glob">
        <div class="map-card" data-zone="map">
          <svg class="world" viewBox="0 0 720 340" role="img" aria-label="Members communicating across the world">
            <rect width="720" height="340" rx="14" class="sea"/>
            ${LAND.map((d) => `<path d="${d}" class="land"/>`).join('')}
            <g id="arcs"></g>
            ${REG.map((r, i) => `<g class="reg" data-i="${i}" tabindex="0" role="button" aria-label="${r.n}"><circle cx="${r.x}" cy="${r.y}" r="${7 + Math.sqrt(r.p) * 3}" style="fill:${r.c}"/><text x="${r.x}" y="${r.y + 4}">${r.n}</text></g>`).join('')}
          </svg>
          <p class="small" id="regMsg">Tap a region to see its share of internet users.</p>
        </div>
        <div class="chart-card" data-zone="chart">
          <h5>Internet users by region, 2013 <small class="muted">(2.7 billion users)</small></h5>
          <div class="bars">${REG.map((r) => `<div class="b"><span class="bv" style="--h:${r.p * 2}%;--bc:${r.c}"><b>${r.p}%</b></span><small>${r.n}</small></div>`).join('')}</div>
        </div>
        <div class="tr-card" data-zone="translate">
          <h5>${FD.icon.translate} Community posts</h5>
          ${POSTS.map((p, i) => `<article class="gpost" data-i="${i}"><header>${FD.avatar(p.who, p.k)}<b>${p.who}</b> <span>${p.flag}</span></header><p class="gtxt">${p.o}</p><button class="mini-btn trb">🌐 See translation</button></article>`).join('')}
        </div>
        <div class="wiki-card" data-zone="wikilang">
          <p class="hello" id="hello">Hello</p>
          <p><b class="wcount" id="wc">0</b> languages</p>
          <p class="small muted">Wikipedia is available in 292 languages. Most of the translation is done by community members.</p>
        </div>
      </div>`;
    const root = el.querySelector('.glob'), $ = (s) => el.querySelector(s);
    const arcsG = $('#arcs');

    function arc(a, b, delay = 0) {
      const A = REG[a], B = REG[b], mx = (A.x + B.x) / 2, my = Math.min(A.y, B.y) - 60 - Math.abs(A.x - B.x) * 0.12;
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', `M${A.x} ${A.y}Q${mx} ${my} ${B.x} ${B.y}`);
      p.setAttribute('class', 'arc');
      p.style.animationDelay = FD.dur(delay) + 'ms';
      arcsG.appendChild(p);
    }
    function arcs(on) { arcsG.innerHTML = ''; if (on) ARCS.forEach(([a, b], i) => arc(a, b, i * 350)); }
    function region(i) {
      el.querySelectorAll('.reg').forEach((g) => g.classList.toggle('on', +g.dataset.i === i));
      el.querySelectorAll('.bars .b').forEach((b, k) => b.classList.toggle('on', k === i));
      if (i == null) return;
      const r = REG[i];
      $('#regMsg').innerHTML = `<b>${r.n}</b>: ${r.p}% of internet users in 2013 – about <b>${FD.fmt(2700 * r.p / 100)} million</b> people.`;
    }
    el.querySelectorAll('.reg').forEach((g) => {
      const f = () => region(+g.dataset.i);
      g.addEventListener('click', f);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } });
    });
    function bars(on) {
      root.classList.remove('grow');
      if (on) { void root.offsetWidth; root.classList.add('grow'); }
    }
    function translate(i, on) {
      const a = el.querySelector(`.gpost[data-i="${i}"]`), p = POSTS[i];
      const t = on == null ? !a.classList.contains('tr') : on;
      a.classList.toggle('tr', t);
      a.querySelector('.gtxt').textContent = t ? p.t : p.o;
      a.querySelector('.trb').textContent = t ? `🌐 See original (${p.lang})` : '🌐 See translation';
    }
    el.querySelectorAll('.trb').forEach((b) => b.addEventListener('click', () => translate(+b.closest('.gpost').dataset.i)));

    let helloT, countRun = 0;
    function hello(on) {
      clearInterval(helloT);
      if (!on) return;
      let i = 0;
      helloT = setInterval(() => { $('#hello').textContent = HELLO[++i % HELLO.length]; FD.pulse($('#hello')); }, FD.dur(700));
    }
    async function count(ctx) {
      const id = ++countRun;
      for (let n = 0; n <= 292; n += 4) {
        if (!(await ctx.sleep(18)) || id !== countRun) return;
        $('#wc').textContent = Math.min(n, 292);
      }
      $('#wc').textContent = 292;
    }

    function reset() {
      arcs(false); bars(true); region(null);
      $('#regMsg').textContent = 'Tap a region to see its share of internet users.';
      POSTS.forEach((p, i) => translate(i, false));
      $('#wc').textContent = 292; hello(true);
    }
    reset();
    return {
      reset, arcs, bars, region, translate, count, hello,
      focus: (z) => FD.focus(root, z),
      destroy() { clearInterval(helloT); countRun++; },
    };
  },
  steps: [
    {
      title: 'Communities without borders',
      text: `<p>Because the internet reaches the whole world, online communities are used by members <strong>from all over the world</strong>.</p>
             <p>People in different countries can share ideas, discuss and work together as easily as if they were in the same room.</p>`,
      on: (a) => { a.reset(); a.focus('map'); a.arcs(true); },
    },
    {
      title: 'Where are the internet users?',
      text: `<p>In 2013 there were about <strong>2.7 billion</strong> internet users.</p>
             <p>Almost half of them (<strong>48.4%</strong>) were in <strong>Asia</strong>. Communities with members in many regions need to work in many languages.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus(['chart', 'map']); a.bars(true);
        if (!(await ctx.sleep(1400))) return;
        a.region(0);
      },
    },
    {
      title: 'Translation tools',
      text: `<p>Many communities have <strong>translation tools</strong> to give wider access to their content and services.</p>
             <p>A member can read a post written in another language with one click.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('translate');
        for (const i of [0, 1, 2]) { if (!(await ctx.sleep(1000))) return; a.translate(i, true); }
      },
    },
    {
      title: 'Collaborating around the world',
      text: `<p>Communities are used to <strong>communicate and collaborate</strong> on a global scale:</p>
             <ul><li>Teams in different countries share documents and meet online in <strong>work spaces</strong>.</li><li>Players from many countries meet in <strong>online games</strong>.</li>
             <li>Wikipedia is available in <strong>292 languages</strong>. Most of the translation is done by <strong>community members</strong>.</li></ul>`,
      async on(a, ctx) { a.reset(); a.focus(['wikilang', 'map']); a.arcs(true); await a.count(ctx); },
    },
    {
      title: 'Try it',
      text: `<ul><li>Tap each region on the map. Which region has the most users? Which has the fewest?</li><li>Translate the posts and switch back to the original.</li></ul>`,
      on: (a) => { a.reset(); a.focus(null); a.arcs(true); },
    },
  ],
});

FD.check({
  section: 'global',
  items: [
    { type: 'mcq', q: 'In 2013, which region had the largest share of internet users?', opts: ['Asia', 'Europe', 'The Americas', 'Africa'], why: 'Asia had 48.4% of the 2.7 billion internet users.' },
    { type: 'mcq', q: 'Why do many online communities provide translation tools?', opts: ['To give wider access to their content and services', 'To make posts shorter', 'To stop people from other countries joining', 'To make the website load faster'], why: 'Members come from all over the world and speak many languages.' },
    { type: 'tf', q: 'Most of the work to translate Wikipedia into 292 languages is done by community members.', a: true, why: 'Wikipedia is a wiki: members create, edit and translate the content.' },
  ],
});
