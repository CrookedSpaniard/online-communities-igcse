FD.add({
  id: 'ugc',
  title: 'User-generated content and social bookmarking',
  tab: 'Content & bookmarks',
  icon: 'ugc',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['user-generated content', 'content available online that has been made by the users of a site or service'],
    ['blog', '(web log) a website updated regularly, often written like a diary or a series of articles'],
    ['vlog', '(video log) a video blog'],
    ['blogger', 'someone who creates or maintains a blog'],
    ['social bookmarking', 'using tags to categorise web documents and URLs so that other people can find them by searching the tags'],
  ],
  mount(el) {
    const BM0 = [
      ['How to revise for exams', 'study-tips.example', ['study', 'exams'], 1240],
      ['Easy pasta recipes', 'cook-fast.example', ['food'], 860],
      ['Free online coding course', 'learn-code.example', ['coding', 'study'], 2310],
      ['Best football skills videos', 'goal-tube.example', ['football'], 530],
    ];
    let site, vids, rating, cmts, authors, allowC, blogPosts, bms, tagF;

    el.innerHTML = `
      <div class="app ugc">
        <div class="app-bar sites" id="sites"><button data-v="video">▶ ViewTube <small>video sharing</small></button><button data-v="blog">✍️ MyBlog <small>blog</small></button><button data-v="bm">🔖 PinBoard <small>social bookmarking</small></button></div>
        <div class="site s-video">
          <div class="v-main">
            <div class="player" id="player"><button class="play" id="playV" aria-label="Play video">▶</button><span class="vt">🚀</span><div class="vprog"><i id="vprog"></i></div></div>
            <h4>How to make a paper rocket</h4>
            <div class="v-meta" data-zone="vprofile">${FD.avatar('Riya Makes', 6)}<span><b>Riya Makes</b><small>12.4K subscribers</small></span><button class="mini-btn" id="subV">Subscribe</button></div>
            <div class="chips" data-zone="vtags"><span class="tg">#science</span><span class="tg">#diy</span><span class="tg">#school</span></div>
            <div class="v-acts">
              <span class="stars big" data-zone="vrate" id="vStars">${[1, 2, 3, 4, 5].map((s) => `<button data-s="${s}" aria-label="${s} stars">★</button>`).join('')}</span>
              <span class="share-to" data-zone="vshare"><small>Share to:</small><button class="mini-btn" data-to="connectly">connectly</button><button class="mini-btn" data-to="chat">chat app</button></span>
            </div>
            <div class="v-cmts" data-zone="vcmt"><ul id="vCm"></ul><form id="vCf"><input id="vCi" placeholder="Add a comment…" aria-label="Comment" autocomplete="off"><button class="mini-btn">Comment</button></form></div>
          </div>
          <aside class="v-side" data-zone="cms">
            <h5>Your channel</h5>
            <form class="upform" id="upF"><input id="upT" placeholder="Video title" aria-label="Video title"><input id="upG" placeholder="Tags, e.g. #music #guitar" aria-label="Tags"><button class="btn small-btn primary">⬆ Upload</button></form>
            <ul class="myvids" id="myVids"></ul>
          </aside>
        </div>
        <div class="site s-blog">
          <div class="b-main">
            <div class="b-comm" data-zone="bcomm" id="bComm"></div>
            <div class="b-set" data-zone="bset">
              <label class="tgl"><input type="checkbox" id="b2"> Second author (Ana)</label>
              <label class="tgl"><input type="checkbox" id="bc"> Readers can comment</label>
            </div>
            <div class="b-posts" id="bPosts"></div>
          </div>
          <aside class="b-ed" data-zone="beditor">
            <h5>Write a new post</h5>
            <input id="bT" placeholder="Title" aria-label="Post title">
            <textarea id="bB" rows="4" placeholder="What happened this week?" aria-label="Post text"></textarea>
            <div class="b-row"><button class="mini-btn" id="bImg">📷 Add photo</button><input id="bG" placeholder="#tags" aria-label="Tags"></div>
            <button class="btn small-btn primary" id="bPub">Publish</button>
          </aside>
        </div>
        <div class="site s-bm">
          <div class="bm-main">
            <div class="bm-tools" data-zone="bmtags"><span class="muted small">Search by tag:</span><span id="tagBtns" class="chips"></span></div>
            <div class="bm-grid" id="bmGrid"></div>
          </div>
          <aside class="bm-side">
            <div class="news" data-zone="third">
              <p class="small muted">study-news.example</p>
              <b>10 apps that help you learn languages</b>
              <p class="small">Learning a new language is easier with…</p>
              <button class="mini-btn save3" id="save3">🔖 Save to PinBoard</button>
            </div>
            <form class="bm-add" data-zone="bmadd" id="bmF">
              <h5>Add a bookmark</h5>
              <input id="bmU" placeholder="URL, e.g. my-site.example" aria-label="Web address">
              <input id="bmG" placeholder="Tags, e.g. #study #music" aria-label="Tags">
              <button class="btn small-btn primary">Save</button>
            </form>
            <div class="follow" data-zone="bmsocial">${FD.avatar('Leo Park', 5)}<span><b>Leo Park</b><small>saves links about #coding</small></span><button class="mini-btn" id="folBm">Follow</button></div>
          </aside>
        </div>
        <div class="toasts" id="uToasts"></div>
      </div>`;
    const root = el.querySelector('.ugc'), $ = (s) => el.querySelector(s);
    const tagsOf = (s) => (s.match(/#?\w+/g) || []).map((t) => t.replace('#', '').toLowerCase()).slice(0, 4);

    function show(s) { site = s; FD.segSet($('#sites'), s); root.dataset.site = s; }
    $('#sites').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(b.dataset.v); });

    // ---------- video ----------
    function drawVideo() {
      el.querySelectorAll('#vStars button').forEach((b) => b.classList.toggle('on', +b.dataset.s <= rating));
      $('#vCm').innerHTML = cmts.map(([w, k, t]) => `<li>${FD.avatar(w, k)}<span><b>${w}</b> ${FD.esc(t)}</span></li>`).join('');
      $('#myVids').innerHTML = vids.length ? vids.map(([t, g]) => `<li><span class="thumb">🎬</span><span><b>${FD.esc(t)}</b><small>${g.map((x) => '#' + x).join(' ') || 'no tags'} · 0 views</small></span></li>`).join('') : '<li class="muted small">You have not uploaded anything yet.</li>';
    }
    async function playV() {
      const p = $('#vprog');
      p.style.transition = 'none'; p.style.width = '0'; void p.offsetWidth;
      p.style.transition = `width ${FD.dur(3000)}ms linear`; p.style.width = '100%';
      $('#player').classList.add('on');
    }
    $('#playV').addEventListener('click', playV);
    $('#vStars').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { rating = +b.dataset.s; drawVideo(); } });
    $('#vCf').addEventListener('submit', (e) => { e.preventDefault(); const t = $('#vCi').value.trim(); if (!t) return; cmts.push(['You', 0, t]); $('#vCi').value = ''; drawVideo(); });
    el.querySelector('.share-to').addEventListener('click', (e) => { const b = e.target.closest('[data-to]'); if (b) FD.toast($('#uToasts'), `↗ Shared to <b>${b.dataset.to}</b>. Your friends can watch and react there.`); });
    $('#subV').addEventListener('click', () => { $('#subV').textContent = 'Subscribed ✓'; });
    function upload(t = $('#upT').value.trim(), g = $('#upG').value) {
      if (!t) { FD.shake($('#upT')); return; }
      vids.unshift([t, tagsOf(g)]);
      $('#upT').value = ''; $('#upG').value = '';
      drawVideo();
      FD.toast($('#uToasts'), '⬆ Uploaded! Members can now find it by its tags.');
    }
    $('#upF').addEventListener('submit', (e) => { e.preventDefault(); upload(); });

    // ---------- blog ----------
    function drawBlog() {
      const comm = authors > 1 || allowC;
      $('#b2').checked = authors > 1; $('#bc').checked = allowC;
      $('#bComm').className = 'b-comm ' + (comm ? 'yes' : 'no');
      $('#bComm').innerHTML = comm
        ? `✓ <b>This blog is an online community</b>: ${[authors > 1 ? 'two authors work on it together' : '', allowC ? 'readers can interact with the blogger' : ''].filter(Boolean).join(' and ')}.`
        : '✗ <b>Not a community yet</b>: only one author and no interaction with readers.';
      $('#bPosts').innerHTML = blogPosts.map((p) => `
        <article class="bpost">
          <h4>${FD.esc(p.t)}</h4>
          <p class="by">${FD.avatar('Sam Lee', 0)}${authors > 1 ? FD.avatar('Ana Ruiz', 4) : ''}<small>by Sam${authors > 1 ? ' &amp; Ana' : ''} · ${p.d}</small></p>
          ${p.img ? '<div class="b-img">🏞️</div>' : ''}
          <p>${FD.esc(p.b)}</p>
          <div class="chips">${p.g.map((x) => `<span class="tg">#${x}</span>`).join('')}<span class="stars sm">★★★★☆</span></div>
          ${allowC ? `<p class="bc">${FD.avatar('Maya Ortiz', 3)}<span><b>Maya</b> Great post! I want to try that too.</span></p>` : '<p class="small muted">Comments are turned off.</p>'}
        </article>`).join('');
    }
    $('#b2').addEventListener('change', (e) => { authors = e.target.checked ? 2 : 1; drawBlog(); });
    $('#bc').addEventListener('change', (e) => { allowC = e.target.checked; drawBlog(); });
    let bImg = false;
    $('#bImg').addEventListener('click', () => { bImg = !bImg; $('#bImg').textContent = bImg ? '📷 Photo added ✓' : '📷 Add photo'; });
    function publish(t = $('#bT').value.trim(), b = $('#bB').value.trim(), g = $('#bG').value) {
      if (!t || !b) { FD.shake(!t ? $('#bT') : $('#bB')); return; }
      blogPosts.unshift({ t, b, g: tagsOf(g), d: 'today', img: bImg });
      $('#bT').value = ''; $('#bB').value = ''; $('#bG').value = ''; bImg = false; $('#bImg').textContent = '📷 Add photo';
      drawBlog();
    }
    $('#bPub').addEventListener('click', () => publish());

    // ---------- bookmarks ----------
    function drawBm() {
      const tags = [...new Set(bms.flatMap((b) => b[2]))];
      $('#tagBtns').innerHTML = `<button class="tg ${!tagF ? 'on' : ''}" data-t="">all</button>` + tags.map((t) => `<button class="tg ${tagF === t ? 'on' : ''}" data-t="${t}">#${t}</button>`).join('');
      $('#bmGrid').innerHTML = bms.filter((b) => !tagF || b[2].includes(tagF)).map(([t, u, g, n, fresh]) => `
        <div class="bm ${fresh ? 'fresh' : ''}"><b>${FD.esc(t)}</b><small>🔗 ${FD.esc(u)}</small><span class="chips">${g.map((x) => `<span class="tg">#${x}</span>`).join('')}</span><small class="muted">saved by ${FD.fmt(n)} ${n === 1 ? 'person' : 'people'}</small></div>`).join('');
    }
    function filterTag(t) { tagF = t || null; drawBm(); }
    $('#tagBtns').addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (b) filterTag(b.dataset.t); });
    function addBm(u = $('#bmU').value.trim(), g = $('#bmG').value, t) {
      if (!u) { FD.shake($('#bmU')); return; }
      const tags = tagsOf(g);
      bms.forEach((b) => { b[4] = false; });
      bms.unshift([t || u.replace(/^https?:\/\//, '').split('/')[0], u, tags.length ? tags : ['other'], 1, true]);
      $('#bmU').value = ''; $('#bmG').value = '';
      tagF = null; drawBm();
    }
    $('#bmF').addEventListener('submit', (e) => { e.preventDefault(); addBm(); });
    $('#save3').addEventListener('click', () => { if ($('#save3').disabled) return; $('#save3').disabled = true; $('#save3').textContent = '🔖 Saved ✓'; addBm('study-news.example/language-apps', '#study #languages', '10 apps that help you learn languages'); });
    $('#folBm').addEventListener('click', () => { $('#folBm').textContent = 'Following ✓'; });

    function reset(s = 'video') {
      vids = []; rating = 0; cmts = [['Tom Okafor', 2, 'It flew so high! 🚀'], ['Ana Ruiz', 4, 'Great for our science project']];
      authors = 1; allowC = false; bImg = false;
      blogPosts = [{ t: 'My week: football and a science fair', b: 'On Monday we started a science project. On Saturday our team won 3–1!', g: ['football', 'school'], d: '3 days ago' }];
      bms = BM0.map((b) => [b[0], b[1], b[2].slice(), b[3], false]); tagF = null;
      $('#vprog').style.transition = 'none'; $('#vprog').style.width = '0'; $('#player').classList.remove('on');
      $('#subV').textContent = 'Subscribe'; $('#folBm').textContent = 'Follow';
      $('#save3').disabled = false; $('#save3').textContent = '🔖 Save to PinBoard';
      show(s); drawVideo(); drawBlog(); drawBm();
    }
    reset();
    return {
      reset, show, upload, playV, publish, addBm, filterTag,
      focus: (z) => FD.focus(root, z),
      rate: (n) => { rating = n; drawVideo(); },
      setBlog: (a, c) => { authors = a; allowC = c; drawBlog(); },
      save3: () => $('#save3').click(),
      fill: async (ctx, sel, text) => {
        const box = $(sel);
        box.value = '';
        for (const ch of text) { box.value += ch; if (!(await ctx.sleep(30))) return false; }
        return true;
      },
    };
  },
  steps: [
    {
      title: 'Content made by users',
      text: `<p><strong>User-generated content</strong> is content online that has been made by the <strong>users</strong> of a site or service.</p>
             <p><strong>Video- and photo-sharing sites</strong>: for example YouTube, Vimeo, Flickr, 500px and Giphy.</p>
             <p><strong>Function</strong>: to let people access and share content that members have created and uploaded.</p>`,
      async on(a, ctx) {
        a.reset('video'); a.focus(null);
        if (!(await ctx.sleep(800))) return;
        a.playV();
      },
    },
    {
      title: 'Features of video- and photo-sharing sites',
      text: `<ul><li><strong>User accounts and profiles</strong></li>
             <li><strong>Content management systems</strong> to add content to a page or edit it</li>
             <li><strong>Tags</strong> to categorise what is shared</li>
             <li><strong>Ratings</strong> and <strong>comments</strong></li>
             <li><strong>Third-party integration</strong>: share and react on social networks.</li></ul>`,
      async on(a, ctx) {
        a.reset('video'); a.focus(['vprofile', 'cms', 'vtags', 'vrate', 'vcmt', 'vshare']);
        if (!(await ctx.sleep(700))) return;
        a.rate(4);
        if (!(await a.fill(ctx, '#upT', 'My guitar lesson'))) return;
        if (!(await a.fill(ctx, '#upG', '#music #guitar'))) return;
        if (!(await ctx.sleep(400))) return;
        a.upload();
      },
    },
    {
      title: 'Blogs and vlogs',
      text: `<p>A <strong>blog</strong> (web log) is a website that is <strong>updated regularly</strong>, often like a diary or a series of articles. A <strong>vlog</strong> is a video blog. Examples: WordPress, Tumblr, Weibo and YouTube.</p>
             <p><strong>Function</strong>: to let people create <strong>online diaries</strong> of events or articles.</p>
             <p>Features: accounts and profiles, <strong>text editors</strong>, <strong>upload tools</strong> for photos and videos, tags, ratings, comments and third-party integration.</p>`,
      async on(a, ctx) {
        a.reset('blog'); a.setBlog(2, true); a.focus('beditor');
        if (!(await a.fill(ctx, '#bT', 'Trip to the museum'))) return;
        if (!(await a.fill(ctx, '#bB', 'Today we saw the first computers ever made!'))) return;
        if (!(await a.fill(ctx, '#bG', '#ict #trip'))) return;
        a.publish();
      },
    },
    {
      title: 'When is a blog a community?',
      text: `<p>A single blog or vlog is only called a <strong>community</strong> if:</p>
             <ul><li><strong>two or more authors</strong> collaborate to create and update it, <strong>or</strong></li><li>it allows <strong>interaction</strong> between the <strong>blogger</strong> and the readers.</li></ul>`,
      async on(a, ctx) {
        a.reset('blog'); a.focus(['bcomm', 'bset']);
        if (!(await ctx.sleep(1500))) return;
        a.setBlog(1, true);
        if (!(await ctx.sleep(1700))) return;
        a.setBlog(2, true);
      },
    },
    {
      title: 'Social bookmarking',
      text: `<p><strong>Social bookmarking</strong> sites let users <strong>categorise</strong> and <strong>share</strong> web documents and URLs using <strong>tags</strong>. Other people find them by searching the tags. Examples: Pinterest, reddit, Pocket and Digg.</p>
             <p><strong>Function</strong>: to let people share web documents and URLs with each other.</p>
             <p>Features: <strong>tags</strong>, <strong>user accounts</strong>, <strong>social networking features</strong> to connect users, and <strong>third-party integration</strong>: “save” buttons on other websites.</p>`,
      async on(a, ctx) {
        a.reset('bm'); a.focus(['bmtags', 'third', 'bmadd', 'bmsocial']);
        if (!(await ctx.sleep(1000))) return;
        a.save3();
        if (!(await ctx.sleep(1500))) return;
        a.filterTag('study');
      },
    },
    {
      title: 'Try it',
      text: `<p>Use the three sites at the top:</p>
             <ul><li><strong>ViewTube</strong>: rate, comment, share and upload a video with tags.</li><li><strong>MyBlog</strong>: write a post. Is it a community?</li><li><strong>PinBoard</strong>: save a link with tags, then search by tag.</li></ul>`,
      tip: 'Key point: many communities share the same features. Most also give users ways to stay safe online.',
      on: (a) => { a.reset('video'); a.focus(null); },
    },
  ],
});

FD.check({
  section: 'ugc',
  items: [
    {
      type: 'sort',
      q: 'What type of community is each example?',
      bins: ['Video / photo sharing', 'Blog', 'Social bookmarking', 'Wiki'],
      rows: [['Flickr', 0], ['WordPress', 1], ['Pinterest', 2], ['Vimeo', 0], ['reddit', 2], ['Discogs', 3]],
      why: 'Flickr and Vimeo share photos and videos, WordPress hosts blogs, Pinterest and reddit are social bookmarking sites and Discogs is a wiki.',
    },
    { type: 'mcq', q: 'State the function of social bookmarking.', opts: ['To let people share web documents and URLs with each other', 'To let people play games together', 'To let teachers mark homework', 'To keep a diary of your week'], why: 'Social bookmarking sites exist so people can share web documents and URLs.' },
    { type: 'tf', q: 'A blog written by one person, with comments turned off, is called an online community.', a: false, why: 'It needs two or more authors, or interaction between the blogger and readers.' },
    { type: 'mcq', q: 'Which feature lets users add or edit content on a page of a video-sharing site?', opts: ['A content management system', 'A gradebook', 'Experience points', 'A shared calendar'], why: 'Content management systems let users add and edit content.' },
  ],
});
