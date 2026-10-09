FD.add({
  id: 'social',
  title: 'Social networking communities',
  tab: 'Social networking',
  icon: 'social',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['profile', 'a collection of information about a user'],
    ['post', '(noun) a message sent to an online group so that all members can read it; (verb) to put a message online so that other people can see it'],
    ['tag', 'a label that you can add to a post'],
    ['connections', 'people or accounts that a user is connected to'],
    ['targeted marketing', 'advertising that is matched to users by their age, gender or browsing history'],
    ['viral', 'shared so widely that it reaches huge numbers of internet users'],
    ['notification', 'an alert about a new interaction or new content'],
    ['analytics', 'information that results from the analysis of data'],
  ],
  mount(el) {
    const AUD = { public: ['🌍', 'Public'], friends: ['👥', 'Friends'], family: ['🏠', 'Family'], team: ['⚽', 'Football team'] };
    const PRIV = [['🌍', 'Public'], ['👥', 'Friends'], ['🔒', 'Only me']];
    const FIELDS = [['Name', 'Sam Lee', 0], ['Date of birth', '14 May 2010', 1], ['School', 'Riverside School', 1], ['Lives in', 'Valencia, Spain', 1], ['Email', 'sam.lee@mail.com', 2], ['Phone', '+34 600 123 456', 2]];
    const SUG = [['Maya Ortiz', 3, 'Likes football · 8 mutual friends', 'ICT teacher · 8 mutual connections'], ['Leo Park', 5, 'Same school · 5 mutual friends', 'Web designer · 5 mutual connections'], ['Nora Haddad', 7, 'Friend of Ana · 2 mutual friends', 'Data analyst · 2 mutual connections']];
    let posts = [], filter = null, mode = 'personal', seq = 0, bell = 0, dms = 0;

    el.innerHTML = `
      <div class="app soc">
        <div class="app-bar">
          <span class="app-logo">connectly</span>
          <span class="app-search">${FD.icon.search}<span>Search</span></span>
          <span class="app-icons">
            <button class="ib" data-zone="dm" aria-label="Messages">${FD.icon.msg}<i class="badge" id="dmB" hidden></i></button>
            <button class="ib" data-zone="bell" aria-label="Notifications">${FD.icon.bell}<i class="badge" id="bellB" hidden></i></button>
          </span>
        </div>
        <div class="soc-grid">
          <section class="pane soc-prof" data-zone="profile">
            <div class="cover"></div>
            ${FD.avatar('Sam Lee', 0, 'big')}
            <h4>Sam Lee</h4>
            <p class="muted small" id="about"></p>
            <div class="seg mode" id="mode"><button data-v="personal" class="on">Personal</button><button data-v="pro">Professional</button></div>
            <ul class="fields">${FIELDS.map(([l, v, p], i) => `<li><span><small>${l}</small>${v}</span><button class="priv" data-i="${i}" data-p="${p}" title="Who can see this? Tap to change">${PRIV[p][0]} ${PRIV[p][1]}</button></li>`).join('')}</ul>
            <p class="small muted">Tap a padlock button to choose who can see it.</p>
          </section>
          <section class="pane soc-feed" data-zone="feed">
            <div class="compose" data-zone="compose">
              ${FD.avatar('Sam Lee', 0)}
              <div class="cmp-main">
                <textarea id="ctext" rows="2" placeholder="What's on your mind? Add #tags to your post…" aria-label="Write a post"></textarea>
                <div class="photo-prev" id="pprev" hidden><span>🏞️ beach.jpg</span><button class="x" id="pdel" aria-label="Remove photo">×</button></div>
                <div class="cmp-row">
                  <button class="mini-btn" id="addPhoto">📷 Photo</button>
                  <span class="aud seg" id="aud">${Object.entries(AUD).map(([k, [e, n]]) => `<button data-v="${k}" class="${k === 'friends' ? 'on' : ''}" title="${n}">${e} <span>${n}</span></button>`).join('')}</span>
                  <button class="btn small-btn primary" id="postBtn">Post</button>
                </div>
              </div>
            </div>
            <p class="filter" id="filter" hidden></p>
            <div class="posts" id="posts"></div>
          </section>
          <section class="pane soc-side">
            <div class="sug" data-zone="suggest">
              <h5>People you may know</h5>
              ${SUG.map(([n, k], i) => `<div class="sg" data-i="${i}">${FD.avatar(n, k)}<span><b>${n}</b><small class="sg-why"></small></span><button class="mini-btn sg-btn"></button></div>`).join('')}
            </div>
            <div class="insight" data-zone="insight" id="insight"></div>
          </section>
        </div>
        <div class="toasts" id="toasts"></div>
      </div>`;

    const root = el.querySelector('.soc');
    const $ = (s) => el.querySelector(s);
    const postsEl = $('#posts'), ctext = $('#ctext');

    // ---------- profile & mode ----------
    function setMode(m) {
      mode = m;
      FD.segSet($('#mode'), m);
      $('#about').textContent = m === 'pro' ? 'Junior web developer · 120 connections' : 'Student · loves football and music';
      el.querySelectorAll('.sg').forEach((s) => {
        const d = SUG[s.dataset.i], b = s.querySelector('.sg-btn');
        s.querySelector('.sg-why').textContent = m === 'pro' ? d[3] : d[2];
        if (!b.classList.contains('done')) b.textContent = m === 'pro' ? 'Connect' : (s.dataset.i === '1' ? 'Follow' : 'Add friend');
      });
    }
    $('#mode').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setMode(b.dataset.v); });
    el.querySelectorAll('.priv').forEach((b) => b.addEventListener('click', () => cyclePriv(+b.dataset.i)));
    function cyclePriv(i, to) {
      const b = el.querySelector(`.priv[data-i="${i}"]`);
      const p = to == null ? (+b.dataset.p + 1) % 3 : to;
      b.dataset.p = p;
      b.innerHTML = `${PRIV[p][0]} ${PRIV[p][1]}`;
      FD.pulse(b);
    }

    // ---------- notifications ----------
    function notify(kind, html) {
      if (kind === 'dm') { dms++; $('#dmB').textContent = dms; $('#dmB').hidden = false; FD.pulse($('#dmB')); }
      else { bell++; $('#bellB').textContent = bell; $('#bellB').hidden = false; FD.pulse($('#bellB')); }
      FD.toast($('#toasts'), html);
    }
    $('[data-zone="bell"]').addEventListener('click', () => { bell = 0; $('#bellB').hidden = true; });
    $('[data-zone="dm"]').addEventListener('click', () => { dms = 0; $('#dmB').hidden = true; FD.toast($('#toasts'), '💬 <b>Maya</b>: "Great goal today!" <small>(private message)</small>'); });

    // ---------- suggestions ----------
    function connect(i) {
      const s = el.querySelector(`.sg[data-i="${i}"]`), b = s.querySelector('.sg-btn');
      if (b.classList.contains('done')) return;
      b.classList.add('done');
      b.textContent = mode === 'pro' ? 'Pending ✓' : 'Request sent ✓';
      notify('bell', `🔔 <b>${SUG[i][0]}</b> accepted your request. You are now connected!`);
    }
    el.querySelectorAll('.sg-btn').forEach((b) => b.addEventListener('click', () => connect(+b.closest('.sg').dataset.i)));

    // ---------- feed ----------
    const tagify = (t) => FD.esc(t).replace(/#(\w+)/g, '<button class="tg" data-tag="$1">#$1</button>');
    function addPost(p, top = true) {
      p.id = ++seq;
      p.likes = p.likes || 0; p.shares = p.shares || 0; p.comments = p.comments || [];
      p.tags = (p.text.match(/#(\w+)/g) || []).map((t) => t.slice(1).toLowerCase());
      if (top) posts.unshift(p); else posts.push(p);
      render(p.id);
      return p;
    }
    function render(fresh) {
      const shown = posts.filter((p) => !filter || p.tags.includes(filter));
      $('#filter').hidden = !filter;
      $('#filter').innerHTML = filter ? `Showing posts tagged <b>#${filter}</b> <button class="mini-btn" id="clr">✕ Show all</button>` : '';
      if (filter) $('#clr').addEventListener('click', () => { filter = null; render(); });
      postsEl.innerHTML = shown.map((p) => p.ad ? `
        <article class="post ad" data-zone="ad" data-id="${p.id}">
          <header>${FD.avatar('Boot Zone', 6)}<span><b>Boot Zone</b><small>Sponsored</small></span></header>
          <p>New football boots for the new season. 20% off this week! ⚽</p>
          <div class="ad-img">👟</div>
          <details class="why-ad"><summary>Why am I seeing this?</summary><p>You are aged <b>15–17</b>, you live in <b>Spain</b> and you posted about <b>#football</b>.</p></details>
        </article>` : `
        <article class="post ${p.id === fresh ? 'fresh' : ''}" data-id="${p.id}">
          <header>${FD.avatar(p.who, p.k)}<span><b>${p.who}</b><small>${p.when || 'Just now'} · ${AUD[p.aud][0]} ${AUD[p.aud][1]}</small></span></header>
          <p>${tagify(p.text)}</p>
          ${p.img ? `<div class="post-img">${p.img}</div>` : ''}
          <div class="reacts" ${p.reacts ? '' : 'hidden'}>${(p.reacts || []).map((r) => `<span>${r}</span>`).join('')}</div>
          <div class="acts">
            <button class="act like ${p.liked ? 'on' : ''}" data-a="like">👍 Like <b>${p.likes || ''}</b></button>
            <button class="act" data-a="comment">💬 Comment <b>${p.comments.length || ''}</b></button>
            <button class="act" data-a="share">↗ Share <b>${p.shares || ''}</b></button>
          </div>
          ${p.comments.length ? `<ul class="cmts">${p.comments.map(([w, t, k]) => `<li>${FD.avatar(w, k)}<span><b>${w}</b> ${FD.esc(t)}</span></li>`).join('')}</ul>` : ''}
        </article>`).join('');
      FD.refocus(root);
    }
    postsEl.addEventListener('click', (e) => {
      const tg = e.target.closest('.tg');
      if (tg) { filter = tg.dataset.tag.toLowerCase(); render(); return; }
      const b = e.target.closest('.act');
      if (!b) return;
      const p = posts.find((x) => x.id === +b.closest('.post').dataset.id);
      if (b.dataset.a === 'like') like(p);
      if (b.dataset.a === 'comment') comment(p, ['Maya Ortiz', 'Nice one! 😄', 3]);
      if (b.dataset.a === 'share') share(p);
    });
    function like(p, reacts) {
      p.liked = !p.liked;
      p.likes += p.liked ? 1 : -1;
      if (reacts) p.reacts = reacts;
      render();
    }
    function comment(p, c) {
      p.comments.push(c);
      render();
      if (p.who === 'Sam Lee') notify('bell', `🔔 <b>${c[0]}</b> commented on your post.`);
    }
    function share(p) {
      p.shares++;
      render();
      side('map');
      spread();
    }

    // ---------- compose ----------
    let photo = false;
    $('#addPhoto').addEventListener('click', () => { photo = !photo; $('#pprev').hidden = !photo; });
    $('#pdel').addEventListener('click', () => { photo = false; $('#pprev').hidden = true; });
    $('#aud').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) FD.segSet($('#aud'), b.dataset.v); });
    const audNow = () => $('#aud .on').dataset.v;
    function publish(text = ctext.value.trim(), aud = audNow()) {
      if (!text) { FD.shake(ctext); ctext.focus(); return null; }
      const p = addPost({ who: 'Sam Lee', k: 0, aud, text, img: photo ? '🏞️' : '' });
      ctext.value = '';
      photo = false; $('#pprev').hidden = true;
      FD.toast($('#toasts'), `✓ Posted. Only <b>${AUD[aud][1].toLowerCase()}</b> ${aud === 'public' ? '(everyone)' : 'members'} can see it.`);
      return p;
    }
    $('#postBtn').addEventListener('click', () => publish());
    ctext.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); publish(); } });

    // ---------- side panel: analytics or network map ----------
    function rnd(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
    const r = rnd(7), nodes = [{ x: 70, y: 120, l: 0 }];
    [[6, 55], [12, 120], [24, 0]].forEach(([n, rad], li) => {
      for (let i = 0; i < n; i++) {
        let x, y;
        if (li < 2) { const a = (i / n) * Math.PI * 2 + r(); x = 70 + Math.cos(a) * rad * (0.8 + r() * 0.3); y = 120 + Math.sin(a) * rad * 0.85; }
        else { x = 200 + r() * 180; y = 15 + r() * 210; }
        const prev = nodes.filter((q) => q.l === li);
        const near = prev.reduce((b, q) => ((q.x - x) ** 2 + (q.y - y) ** 2 < (b.x - x) ** 2 + (b.y - y) ** 2 ? q : b), prev[0]);
        nodes.push({ x: Math.max(8, Math.min(392, x)), y: Math.max(10, Math.min(230, y)), l: li + 1, p: near });
      }
    });
    function side(kind) {
      const ins = $('#insight');
      ins.dataset.kind = kind;
      if (kind === 'map') {
        ins.innerHTML = `<h5>Who saw your post? <span class="muted" id="reach">1 person</span></h5>
          <svg class="vmap" viewBox="0 0 400 240">
            <ellipse cx="70" cy="120" rx="68" ry="110" class="mynet"/><text x="70" y="232" class="mynet-l">your network</text>
            ${nodes.slice(1).map((n, i) => `<line x1="${n.p.x}" y1="${n.p.y}" x2="${n.x}" y2="${n.y}" data-i="${i + 1}"/>`).join('')}
            ${nodes.map((n, i) => `<circle cx="${n.x}" cy="${n.y}" r="${i ? 6 : 10}" data-i="${i}" class="${i ? '' : 'me lit'}"/>`).join('')}
          </svg>
          <p class="viral-l" id="viral" hidden>🔥 Gone viral! It has spread far beyond your own network.</p>`;
      } else {
        const v = [155, 175, 90, 122, 102, 122, 182, 200, 268, 242, 200, 195];
        const pts = v.map((y, i) => `${20 + i * 32},${140 - y * 0.45}`).join(' ');
        ins.innerHTML = `<h5>Analytics · page views</h5>
          <svg class="chart" viewBox="0 0 390 160"><path d="M20 140H380" class="ax"/><polyline points="${pts}" class="ln"/>
            ${['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => `<text x="${20 + i * 32}" y="156">${m}</text>`).join('')}</svg>
          <div class="kpis"><span><small>Posts</small><b>70</b><em class="dn">▼ 16%</em></span><span><small>Views</small><b>44.8K</b><em>▲ 25%</em></span><span><small>Profile visits</small><b>3,786</b><em>▲ 51%</em></span><span><small>Followers</small><b>1,001</b><em>▲ 21</em></span></div>`;
      }
    }
    let spreadRun = 0;
    async function spread() {
      const id = ++spreadRun, svg = el.querySelector('.vmap');
      if (!svg) return;
      svg.querySelectorAll('.lit:not(.me)').forEach((c) => c.classList.remove('lit'));
      svg.querySelectorAll('line').forEach((c) => c.classList.remove('lit'));
      for (let lv = 1; lv <= 3; lv++) {
        await FD.wait(550);
        if (id !== spreadRun || !svg.isConnected) return;
        nodes.forEach((n, i) => {
          if (n.l !== lv) return;
          svg.querySelector(`circle[data-i="${i}"]`).classList.add('lit');
          svg.querySelector(`line[data-i="${i}"]`).classList.add('lit');
        });
        const big = [1, 7, 19, 43][lv];
        $('#reach').textContent = lv === 3 ? '2.4 million people' : `${FD.fmt(big * (lv === 2 ? 12 : 1))} people`;
      }
      $('#viral').hidden = false;
    }

    // ---------- starting content ----------
    function reset() {
      posts = []; filter = null; seq = 0; bell = 0; dms = 0;
      $('#bellB').hidden = true; $('#dmB').hidden = true;
      addPost({ who: 'Ana Ruiz', k: 4, aud: 'friends', text: 'Our school team won 3–1 today! #football', when: '2 h', likes: 14, comments: [['Leo Park', 'Well played!', 5]] }, false);
      addPost({ ad: true, text: '', aud: 'public' }, false);
      addPost({ who: 'Tom Okafor', k: 2, aud: 'public', text: 'Finished my #ict homework on online communities 💻', when: '5 h', likes: 6 }, false);
      addPost({ who: 'Ana Ruiz', k: 4, aud: 'friends', text: 'Who is coming to the concert on Friday? #music', when: 'Yesterday', likes: 9 }, false);
      render();
      el.querySelectorAll('.sg-btn').forEach((b) => b.classList.remove('done'));
      FIELDS.forEach((f, i) => cyclePriv(i, f[2]));
      setMode('personal');
      side('stats');
      FD.segSet($('#aud'), 'friends');
    }
    reset();

    const api = {
      reset,
      focus: (z) => FD.focus(root, z),
      setMode, cyclePriv, connect, side, spread, notify,
      type: async (ctx, text, aud) => {
        ctext.value = '';
        if (aud) FD.segSet($('#aud'), aud);
        for (const ch of text) { ctext.value += ch; if (!(await ctx.sleep(32))) return false; }
        return true;
      },
      publish,
      incoming(text, tag) { return addPost({ who: 'Maya Ortiz', k: 3, aud: 'friends', text: text + (tag ? ' ' + tag : '') }); },
      filterTag(t) { filter = t; render(); },
      first: () => posts.find((p) => !p.ad),
      like, comment, share,
      destroy() { spreadRun++; },
    };
    return api;
  },
  steps: [
    {
      title: 'The function: connecting people',
      text: `<p>Social networking communities let members <strong>connect</strong> through <strong>shared interests or relationships</strong>.</p>
             <ul><li><strong>Personal</strong> networks: friends and family.</li><li><strong>Professional</strong> networks: people who work in the same job or industry.</li></ul>
             <p>Today these mix together: businesses also use personal networks.</p>`,
      tip: 'Did you know? Most people can only keep about <strong>150</strong> stable relationships (the Dunbar number), but they talk to only 5 or 6 friends each day.',
      async on(a, ctx) {
        a.reset(); a.focus('profile');
        if (!(await ctx.sleep(1400))) return;
        a.setMode('pro');
        if (!(await ctx.sleep(1800))) return;
        a.setMode('personal');
      },
    },
    {
      title: 'Profiles',
      text: `<p>A <strong>profile</strong> is a collection of information about a user. It can include:</p>
             <ul><li>name, date of birth, location and language</li><li>an “about you” description</li><li>work, education and travel</li><li>family and contact details</li><li>profile and background images.</li></ul>
             <p>You can often choose what is <strong>public</strong>, what only some people see, and what is <strong>private</strong>.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('profile');
        for (const [i, p] of [[1, 2], [3, 2], [5, 2]]) {
          if (!(await ctx.sleep(900))) return;
          a.cyclePriv(i, p);
        }
      },
    },
    {
      title: 'Friend, follow and connect',
      text: `<p>Buttons such as <strong>Add friend</strong>, <strong>Follow</strong> or <strong>Connect</strong> add someone to your network.</p>
             <p><strong>User suggestions</strong>: the site looks at your interests and the interests of people in your network, then suggests <strong>friends of your connections</strong>.</p>
             <p>Some communities hide your full profile until you accept someone into your network.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('suggest');
        if (!(await ctx.sleep(1500))) return;
        a.connect(0);
      },
    },
    {
      title: 'Stream, wall and timeline',
      text: `<p>Your <strong>stream</strong>, <strong>wall</strong> or <strong>timeline</strong> is where <strong>posts</strong> from your friends appear.</p>
             <p>It changed how people communicate: information comes <strong>straight to you</strong>, so you do not have to look for it.</p>
             <p>A <strong>status update</strong> can go to your whole network, to everyone, or to a small group.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('feed');
        if (!(await ctx.sleep(1300))) return;
        a.incoming('Just arrived in London! ✈️');
      },
    },
    {
      title: 'Groups, lists and circles',
      text: `<p>Members can make named <strong>groups</strong>, <strong>lists</strong> or <strong>circles</strong>. A post can then be seen <strong>only</strong> by that group.</p>
             <p>For example, keep family posts separate from your football team. Organisations use groups so small teams can talk without messaging everyone.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('compose');
        if (!(await ctx.sleep(600))) return;
        if (!(await a.type(ctx, 'Happy birthday, Grandma! 🎂', 'family'))) return;
        if (!(await ctx.sleep(500))) return;
        a.publish();
      },
    },
    {
      title: 'Tags',
      text: `<p><strong>Tags</strong> let members <strong>categorise</strong> what they post, for example <code>#football</code> or <code>#ict</code>.</p>
             <p>Other members can then <strong>search</strong> using the tags to find content about that topic.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('feed');
        if (!(await ctx.sleep(500))) return;
        if (!(await a.type(ctx, 'Revising for my test #ict', 'public'))) return;
        a.publish();
        if (!(await ctx.sleep(1200))) return;
        a.filterTag('ict');
      },
    },
    {
      title: 'Targeted marketing',
      text: `<p>Members post lots of information about themselves. The owners of the site store it in a database, analyse it and <strong>sell</strong> it to advertisers.</p>
             <p>Advertisers can then show adverts to the right members, matched by age, gender or browsing history. This is called <strong>targeted marketing</strong>.</p>
             <p>Members can also <strong>pay to promote</strong> posts so more people see them. <strong>Sponsored posts</strong> appear at the top for everyone.</p>`,
      tip: 'Key point: social networks are often free, but are they really free of charge? You “pay” with your <strong>personal information</strong>. (Facebook earned almost US$18 billion in 2015.)',
      async on(a, ctx) {
        a.reset(); a.focus('ad');
        if (!(await ctx.sleep(900))) return;
        const d = document.querySelector('.stage .why-ad');
        if (d) d.open = true;
      },
    },
    {
      title: 'Reactions, likes and votes',
      text: `<p><strong>Likes</strong>, <strong>reactions</strong> (❤️ 😂 😮), <strong>ratings</strong> and <strong>upvotes</strong> let members show how they feel about a post and recommend it to others.</p>
             <p>Some communities use <strong>downvotes</strong> to show they dislike a post, but many sites avoid them because they send a negative message.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('feed');
        if (!(await ctx.sleep(900))) return;
        a.like(a.first(), ['❤️ 6', '😂 3', '😮 1', '⬆ 12']);
      },
    },
    {
      title: 'Share and “going viral”',
      text: `<p><strong>Share</strong> repeats someone’s post to your own network, so more people can see it.</p>
             <p>When a post is shared again and again, far beyond the creator’s own network, we say it has gone <strong>viral</strong>.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus(['feed', 'insight']); a.side('map');
        if (!(await ctx.sleep(1000))) return;
        a.share(a.first());
      },
    },
    {
      title: 'Comments, messages and notifications',
      text: `<ul><li><strong>Comments</strong> let members have conversations about a post.</li>
             <li><strong>Private (direct) messages</strong> go to one person instead of being public.</li>
             <li><strong>Notifications</strong> tell you about new activity, so you stay involved.</li>
             <li>You can <strong>add photos, videos and links</strong> to posts and preview them first.</li>
             <li><strong>Third-party integration</strong>: other websites have buttons to share their pages on social networks.</li></ul>`,
      async on(a, ctx) {
        a.reset(); a.focus(['feed', 'bell', 'dm']);
        if (!(await ctx.sleep(500))) return;
        if (!(await a.type(ctx, 'Day at the beach 🌊', 'friends'))) return;
        document.querySelector('#addPhoto')?.click();
        if (!(await ctx.sleep(700))) return;
        const p = a.publish();
        if (!(await ctx.sleep(1200))) return;
        if (p) a.comment(p, ['Leo Park', 'Looks amazing!', 5]);
        if (!(await ctx.sleep(1300))) return;
        a.notify('dm', '💬 New private message from <b>Maya</b>');
      },
    },
    {
      title: 'Analytics',
      text: `<p><strong>Analytics</strong> show members how other people reacted to their posts: views, profile visits, new followers…</p>
             <p>This helps people and organisations find their <strong>most effective</strong> posts and grow their network.</p>
             <p>The bigger and more active a community is, the more organisations will <strong>pay</strong> to promote posts there: it is a bigger market.</p>`,
      on(a) { a.reset(); a.focus('insight'); a.side('stats'); },
    },
    {
      title: 'Try it',
      text: `<p>Now it is your turn:</p>
             <ul><li>Change who can see your <strong>profile</strong> details.</li><li>Write a post with a <strong>#tag</strong>, choose a <strong>group</strong>, then post it.</li>
             <li>Click a tag to search. <strong>Like</strong>, <strong>comment</strong> and <strong>share</strong> posts.</li><li>Connect with someone you may know.</li></ul>`,
      on(a) { a.reset(); a.focus(null); },
    },
  ],
});

FD.check({
  section: 'social',
  items: [
    {
      type: 'sort',
      q: 'Label the post. Which feature is each numbered part?',
      fig: `<div class="mini-post"><div class="mp-head">${FD.avatar('Tom Okafor', 2)}<b>Tom Okafor</b><span class="mk">1</span><span class="mini-btn">+ Connect</span></div>
            <p>This is a post <span class="tg">#ict</span><span class="mk">2</span></p>
            <div class="mp-acts"><span>👍 Like</span><span class="mk">3</span><span>↗ Share</span><span class="mk">4</span></div></div>`,
      bins: ['Tag', 'Share', 'Like', 'Connect'],
      rows: [['1', 3], ['2', 0], ['3', 2], ['4', 1]],
      why: 'Connect adds someone to your network, a tag categorises the post, Like shows a reaction and Share repeats the post to your network.',
    },
    { type: 'mcq', q: 'How do social networks decide which adverts to show to each member?', opts: ['They match adverts to the profile data of members (targeted marketing)', 'They show the same adverts to everyone', 'Members choose adverts in their settings', 'They show adverts from their friends only'], why: 'Profile data such as age, gender and interests is used to match members to adverts.' },
    { type: 'mcq', q: 'How does a social network decide which people to suggest to you?', opts: ['It analyses your interests and suggests friends of your existing connections', 'It chooses people at random', 'It suggests the most famous members', 'It suggests people who paid to appear'], why: 'User suggestions match your interests with the interests of people in your network.' },
    { type: 'tf', q: 'A post that is shared widely, far beyond the creator’s network, has “gone viral”.', a: true, why: 'Viral content is circulated widely through sharing.' },
    { type: 'multi', q: 'Which are ways a user can personalise their profile?', need: 3, opts: [['Add a profile picture and background image', true], ['Write an “about you” description', true], ['Add work and education details', true], ['Change the site’s adverts', false], ['Delete other people’s posts', false]], why: 'Profiles can include images, an “about you” text, work and education, travel, family and contact details.' },
  ],
});
