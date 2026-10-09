FD.add({
  id: 'reference',
  title: 'User-generated reference sites: wikis and forums',
  tab: 'Wikis & forums',
  icon: 'reference',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['wiki', 'a website or database developed by many collaborating users, who can all add and edit content'],
    ['forum', 'a website where users post comments and reply to other users’ comments (also called a bulletin board or message board)'],
    ['thread', 'a series of messages about the same subject'],
    ['moderator', 'a member who has the right to allow or block posts or members'],
    ['demote / mute', 'make someone a lower rank / silence someone'],
  ],
  mount(el) {
    const START = `== What is it? ==\nAn '''online community''' is a group of people with a shared interest who communicate online.\n== Examples ==\n* [[Social networks]]\n* [[Forums]] and [[wikis]]`;
    const PAGES = ['Online community', 'Online gaming', 'Social networks', 'Forums', 'Wikis', 'Blogs and vlogs', 'Social bookmarking'];
    const BAD = /\b(stupid|idiot|loser|hate)\b|https?:\/\/|www\./i;
    const MEMBERS = [['Ana_R', 4, 'member'], ['TomO', 2, 'moderator'], ['LeoP', 5, 'member']];
    let src, hist, wtab, role, posts, queue, members;

    el.innerHTML = `
      <div class="app ref">
        <section class="pane wiki">
          <div class="wk-bar"><span class="app-logo">📖 OpenWiki</span>
            <label class="wk-search" data-zone="wsearch">${FD.icon.search}<input id="wq" placeholder="Search OpenWiki" aria-label="Search the wiki"></label></div>
          <ul class="wk-results" id="wres" hidden></ul>
          <div class="wk-tabs" id="wtabs"><button data-v="read">Article</button><button data-v="edit" data-zone="editbtn">✏️ Edit</button><button data-v="hist" data-zone="history">🕘 History</button>
            <span class="wk-user" data-zone="account">${FD.avatar('Sam Lee', 0)} Sam_L</span></div>
          <div class="wk-body">
            <article class="wk-read" id="wRead"></article>
            <div class="wk-edit" id="wEdit" data-zone="markup"><textarea id="wSrc" rows="7" spellcheck="false" aria-label="Edit the page"></textarea>
              <p class="small muted"><code>== Heading ==</code> · <code>'''bold'''</code> · <code>[[link]]</code> · <code>* list item</code></p>
              <button class="btn small-btn primary" id="wSave">Save changes</button></div>
            <ol class="wk-hist" id="wHist"></ol>
          </div>
        </section>
        <section class="pane forum">
          <div class="fr-bar"><span class="app-logo">💬 TechTalk forum</span>
            <span class="seg roles" id="role" data-zone="roles"><button data-v="member">Member</button><button data-v="moderator">Moderator</button><button data-v="admin">Admin</button></span></div>
          <ul class="fr-threads" data-zone="threads">
            <li class="sticky" data-zone="rules"><details><summary>📌 <b>Forum rules (acceptable use policy)</b></summary><ol><li>Be polite. No insults.</li><li>No links to other websites.</li><li>Never share personal information.</li></ol><p class="small">Break the rules and a moderator can warn you or block you.</p></details></li>
            <li class="cur"><b>How do I make a strong password?</b><small>Thread · <span id="nRep"></span> replies</small></li>
            <li><b>Best laptop for school?</b><small>Thread · 23 replies</small></li>
          </ul>
          <div class="fr-posts" id="fPosts"></div>
          <form class="fr-reply" data-zone="censor" id="fForm"><input id="fIn" placeholder="Write a reply…" aria-label="Write a reply" autocomplete="off"><button class="mini-btn">Post</button></form>
          <p class="small" id="fMsg"></p>
          <div class="mod-panel" data-zone="queue"><h5>🛡️ Moderator queue</h5><ul id="queue"></ul></div>
          <div class="adm-panel" data-zone="admin"><h5>⚙️ Administrator: members</h5><ul id="mems"></ul></div>
        </section>
        <div class="toasts" id="rToasts"></div>
      </div>`;
    const root = el.querySelector('.ref'), $ = (s) => el.querySelector(s);

    // ---------- wiki ----------
    const md = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).split('\n').map((l) => {
      l = l.replace(/'''(.+?)'''/g, '<b>$1</b>').replace(/\[\[(.+?)\]\]/g, '<a class="wl" href="#reference">$1</a>');
      if (/^==\s*(.+?)\s*==$/.test(l)) return `<h5>${l.replace(/^==\s*|\s*==$/g, '')}</h5>`;
      if (/^\*\s*/.test(l)) return `<li>${l.replace(/^\*\s*/, '')}</li>`;
      return l.trim() ? `<p>${l}</p>` : '';
    }).join('').replace(/(<li>.*?<\/li>)+/g, (m) => `<ul>${m}</ul>`);
    function drawWiki() {
      FD.segSet($('#wtabs'), wtab);
      root.dataset.wtab = wtab;
      $('#wRead').innerHTML = `<h4>Online community</h4>${md(src)}`;
      $('#wHist').innerHTML = hist.map(([u, k, t, n], i) => `<li class="${i === 0 && n ? 'new' : ''}">${FD.avatar(u, k)}<span><b>${u}</b> ${t}<small>${n || ''}</small></span></li>`).join('');
    }
    function wikiTab(t) { wtab = t; if (t === 'edit') $('#wSrc').value = src; drawWiki(); }
    function save() {
      const v = $('#wSrc').value;
      if (v === src) { wikiTab('read'); return; }
      src = v;
      hist.unshift(['Sam_L', 0, 'edited the page', 'just now']);
      wikiTab('read');
      FD.toast($('#rToasts'), '✓ Saved. Your edit is in the page history.');
    }
    $('#wtabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) wikiTab(b.dataset.v); });
    $('#wSave').addEventListener('click', save);
    $('#wRead').addEventListener('click', (e) => { if (e.target.closest('.wl')) e.preventDefault(); });
    function search(q) {
      $('#wq').value = q;
      const s = q.trim().toLowerCase(), r = $('#wres');
      r.hidden = !s;
      const found = PAGES.filter((p) => p.toLowerCase().includes(s));
      r.innerHTML = found.length ? found.map((p) => `<li>📄 ${p.replace(new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'), '<mark>$1</mark>')}</li>`).join('') : '<li class="muted">No pages found.</li>';
    }
    $('#wq').addEventListener('input', (e) => search(e.target.value));

    // ---------- forum ----------
    const badge = (r) => (r === 'moderator' ? '<i class="rb mod">Moderator</i>' : r === 'admin' ? '<i class="rb adm">Admin</i>' : '');
    function drawForum() {
      FD.segSet($('#role'), role);
      root.dataset.role = role;
      $('#nRep').textContent = posts.length - 1;
      $('#fPosts').innerHTML = posts.map((p, i) => `
        <div class="fp ${p.muted ? 'muted-p' : ''}" data-i="${i}">
          <header>${FD.avatar(p.who, p.k)}<b>${p.who}</b>${badge(p.r)}</header>
          <p>${p.muted ? '<em>Hidden: this member has been blocked.</em>' : FD.esc(p.t)}</p>
          <div class="fp-acts" ${i === 1 ? 'data-zone="ratings"' : ''}>
            <span class="stars" title="Rate this post">${[1, 2, 3, 4, 5].map((s) => `<button data-s="${s}" class="${s <= p.stars ? 'on' : ''}" aria-label="${s} stars">★</button>`).join('')}</span>
            <button class="mini-btn rep" ${i === 2 ? 'data-zone="report"' : ''}>${p.flagged ? '🚩 Reported' : '🚩 Report'}</button>
            ${role !== 'member' && p.who !== 'Sam_L' ? `<button class="mini-btn blk">${p.muted ? 'Unblock' : '🔇 Block'}</button>` : ''}
          </div>
        </div>`).join('');
      $('#queue').innerHTML = queue.length ? queue.map((q, i) => `<li><span><b>${q.who}:</b> ${FD.esc(q.t)}<small>${q.why}</small></span><button class="mini-btn ok" data-a="ok" data-i="${i}">✓ Allow</button><button class="mini-btn" data-a="no" data-i="${i}">✕ Block post</button></li>`).join('') : '<li class="muted small">No posts waiting.</li>';
      $('#mems').innerHTML = members.map(([n, k, r], i) => `<li>${FD.avatar(n, k)}<b>${n}</b>${badge(r)}<button class="mini-btn" data-m="${i}">${r === 'moderator' ? '⬇ Demote' : '⬆ Promote to moderator'}</button></li>`).join('');
      FD.refocus(root);
    }
    $('#role').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { role = b.dataset.v; drawForum(); } });
    $('#fPosts').addEventListener('click', (e) => {
      const fp = e.target.closest('.fp');
      if (!fp) return;
      const p = posts[fp.dataset.i];
      const st = e.target.closest('[data-s]');
      if (st) { p.stars = +st.dataset.s; drawForum(); return; }
      if (e.target.closest('.rep')) { report(+fp.dataset.i); return; }
      if (e.target.closest('.blk')) { p.muted = !p.muted; drawForum(); }
    });
    function report(i) {
      const p = posts[i];
      if (p.flagged) return;
      p.flagged = true;
      drawForum();
      FD.toast($('#rToasts'), '🚩 Thank you. A moderator will check this post.');
    }
    function reply(t) {
      t = t.trim();
      if (!t) return;
      $('#fIn').value = '';
      if (BAD.test(t)) {
        const why = /https?:|www\./i.test(t) ? 'Contains a web link (URL)' : 'Contains a blocked word';
        queue.push({ who: 'Sam_L', t, why });
        $('#fMsg').innerHTML = `<b class="bad">⏳ Your post was not published.</b> ${why}, so it was sent to a moderator to check.`;
      } else {
        posts.push({ who: 'Sam_L', k: 0, r: 'member', t, stars: 0 });
        $('#fMsg').innerHTML = '<b class="good">✓ Posted to the thread.</b>';
      }
      drawForum();
      $('#fPosts').scrollTop = $('#fPosts').scrollHeight;
    }
    $('#fForm').addEventListener('submit', (e) => { e.preventDefault(); reply($('#fIn').value); });
    $('#queue').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const q = queue.splice(+b.dataset.i, 1)[0];
      if (b.dataset.a === 'ok') posts.push({ who: q.who, k: 0, r: 'member', t: q.t, stars: 0 });
      else FD.toast($('#rToasts'), `✕ Post blocked. ${q.who} gets a warning by private message.`);
      drawForum();
    });
    $('#mems').addEventListener('click', (e) => {
      const b = e.target.closest('[data-m]');
      if (!b) return;
      if (role !== 'admin') { FD.shake(b); FD.toast($('#rToasts'), 'Only an <b>administrator</b> can promote or demote members.'); return; }
      const m = members[b.dataset.m];
      m[2] = m[2] === 'moderator' ? 'member' : 'moderator';
      FD.toast($('#rToasts'), `${m[0]} is now a <b>${m[2]}</b>.`);
      drawForum();
    });

    function reset() {
      src = START; wtab = 'read';
      hist = [['Ana_R', 4, 'added “Examples”', '2 days ago'], ['LeoP', 5, 'fixed a spelling mistake', '1 week ago'], ['TomO', 2, 'created the page', '1 year ago']];
      role = 'member'; queue = [];
      members = MEMBERS.map((m) => m.slice());
      posts = [
        { who: 'Ana_R', k: 4, r: 'member', t: 'What makes a password strong? Mine is my dog’s name 🐶', stars: 0 },
        { who: 'TomO', k: 2, r: 'moderator', t: 'Use at least 12 characters: a mix of words, numbers and symbols. Never use names!', stars: 5 },
        { who: 'LeoP', k: 5, r: 'member', t: 'Just use 123456, nobody will guess it 😂', stars: 1 },
      ];
      $('#fMsg').textContent = ''; $('#fIn').value = '';
      $('#wq').value = ''; $('#wres').hidden = true;
      el.querySelector('.sticky details').open = false;
      drawWiki(); drawForum();
    }
    reset();
    return {
      reset, wikiTab, save, search, reply, report,
      focus: (z) => FD.focus(root, z),
      setRole: (r) => { role = r; drawForum(); },
      rules: (o) => { el.querySelector('.sticky details').open = o; },
      type: async (ctx, sel, text) => {
        const box = $(sel);
        for (const ch of text) { box.value += ch; if (!(await ctx.sleep(35))) return false; }
        return true;
      },
    };
  },
  steps: [
    {
      title: 'Reference sites made by users',
      text: `<p><strong>User-generated reference sites</strong> are information websites <strong>created and maintained by communities of members</strong>.</p>
             <p>A <strong>wiki</strong> is a website or database that many users build together. All of them can add and edit content. Examples: Wikipedia and the music database Discogs.</p>
             <p><strong>Function</strong>: to let members collaborate to build and edit web pages.</p>`,
      tip: 'Did you know? “Wiki” is a Hawaiian word that means “fast”.',
      on: (a) => { a.reset(); a.focus(['markup', 'editbtn', 'history', 'account', 'wsearch']); },
    },
    {
      title: 'Features of wikis',
      text: `<ul><li><strong>Member accounts</strong> track which edits were made by which member.</li>
             <li>An <strong>edit button</strong> opens a text editor.</li>
             <li>A <strong>structured language</strong> formats the page and adds links.</li>
             <li><strong>Search tools</strong> help you find pages.</li></ul>`,
      async on(a, ctx) {
        a.reset(); a.focus(['markup', 'editbtn', 'history', 'account', 'wsearch']);
        if (!(await ctx.sleep(800))) return;
        a.wikiTab('edit');
        if (!(await ctx.sleep(500))) return;
        if (!(await a.type(ctx, '#wSrc', '\n* [[Online gaming]] communities'))) return;
        if (!(await ctx.sleep(500))) return;
        a.save();
        if (!(await ctx.sleep(1500))) return;
        a.wikiTab('hist');
        if (!(await ctx.sleep(1600))) return;
        a.search('gam');
      },
    },
    {
      title: 'Forums',
      text: `<p>An online <strong>forum</strong> (or bulletin board, or message board) is a website where users post comments and reply to other users. Examples: Stack Overflow, Quora, The Student Room.</p>
             <p><strong>Function</strong>: online spaces for <strong>structured discussions</strong>. Posts are arranged in topics called <strong>threads</strong>.</p>
             <p>Features: posts, threads, <strong>sticky notes</strong> kept at the top, <strong>ratings</strong> to show how helpful a post is, and <strong>private messages</strong>.</p>`,
      on: (a) => { a.reset(); a.focus(['threads', 'ratings']); },
    },
    {
      title: 'Groups, moderators and administrators',
      text: `<ul><li><strong>Groups</strong> give members different levels of access or rights.</li>
             <li><strong>Moderators</strong> can allow or block posts and members.</li>
             <li><strong>Administrators</strong> have the same rights as moderators, plus more: for example they can <strong>promote</strong> members to moderators or <strong>demote</strong> moderators.</li></ul>`,
      async on(a, ctx) {
        a.reset(); a.focus(['roles', 'queue', 'admin']);
        if (!(await ctx.sleep(1000))) return;
        a.setRole('moderator');
        if (!(await ctx.sleep(1600))) return;
        a.setRole('admin');
      },
    },
    {
      title: 'Safety features',
      text: `<ul><li><strong>Word or URL censoring</strong>: software scans posts for bad words and links; the post is rejected or sent to a moderator.</li>
             <li><strong>Ignore or block</strong>: mute members or stop them using the forum.</li>
             <li><strong>Rules / acceptable use policy</strong>: what members can and cannot do. Break them and you get a warning or a block.</li>
             <li><strong>Report or flag</strong>: tell moderators that someone broke the rules.</li></ul>`,
      async on(a, ctx) {
        a.reset(); a.focus(['censor', 'rules', 'report', 'queue']);
        a.rules(true);
        if (!(await ctx.sleep(1000))) return;
        if (!(await a.type(ctx, '#fIn', 'That is a stupid idea'))) return;
        a.reply(document.querySelector('#fIn').value);
        if (!(await ctx.sleep(1400))) return;
        a.report(2);
        if (!(await ctx.sleep(800))) return;
        a.setRole('moderator');
      },
    },
    {
      title: 'Try it',
      text: `<ul><li>Edit the wiki page, save it and look at the <strong>History</strong>.</li><li>Post a polite reply in the forum, then try one with a link like www.example.com.</li>
             <li>As a <strong>moderator</strong>, allow or block posts. As an <strong>admin</strong>, promote a member.</li><li><strong>Rate</strong> and <strong>report</strong> posts.</li></ul>`,
      on: (a) => { a.reset(); a.focus(null); },
    },
  ],
});

FD.check({
  section: 'reference',
  items: [
    {
      type: 'sort',
      q: 'On a forum, who can do each action? Choose the <b>lowest</b> role that can do it.',
      bins: ['Member', 'Moderator', 'Administrator'],
      rows: [['Write a post and reply to others', 0], ['Allow or block a post', 1], ['Promote a member to moderator', 2], ['Rate another member’s post', 0], ['Demote a moderator', 2]],
      why: 'Members post, rate and report. Moderators allow or block posts and members. Administrators can also promote and demote.',
    },
    { type: 'mcq', q: 'Which one of these is used to set the rules for an online community?', opts: ['Acceptable use policies', 'User ratings', 'Analytics', 'Features that allow commenting and sharing'], why: 'An acceptable use policy tells members what they can and cannot do.' },
    { type: 'mcq', q: 'What is the function of a wiki?', opts: ['To let members collaborate to build and edit web pages', 'To let members play games together', 'To store bookmarks of websites', 'To send private messages'], why: 'Many collaborating users add and edit the content of a wiki.' },
    { type: 'tf', q: 'Word censoring means posts are checked by software for inappropriate words before they are published.', a: true, why: 'If bad words or URLs are found, the post is rejected or sent to a moderator.' },
  ],
});
