FD.add({
  id: 'safety',
  title: 'How to stay safe online',
  tab: 'Staying safe',
  icon: 'safety',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['anonymous', 'with no name: other people do not know who you are'],
    ['misrepresentation', 'pretending to be someone or something that you are not'],
    ['in person', 'face to face; in the real world'],
    ['disclose', 'make information known to other people'],
    ['grooming', 'pretending to be a friend of someone (often a child or young person) in order to harm them'],
    ['geotag', 'to add location data to a piece of content, such as a photo'],
    ['cyberbullying', 'using the internet to send text or images to upset or embarrass someone'],
  ],
  mount(el) {
    // [key, label, risky?, why, setting that hides it]
    const ITEMS = [
      ['status', 'Moved to London 2 years ago cos my parents split up.', 1, 'Family problems tell a stranger that he may feel lonely or upset: groomers look for this.', null],
      ['loc', '📍 Share my location', 1, 'Live location shows exactly where he is right now.', 'loc'],
      ['post', '“Fancy meeting up at the park tomorrow?” (Public)', 1, 'A public post says where and when he will be, to anyone.', 'posts'],
      ['photo', '🖼️ “me at the park” · 📍 geotagged', 1, 'The photo shows his face and its geotag shows the place.', 'geo'],
      ['addr', '🏠 23 Union Terrace, London', 1, 'His home address lets anyone find his house.', 'addr'],
      ['mail', '✉️ chris.m@mail.com', 1, 'A public email address can be used for phishing or unwanted contact.', 'mail'],
      ['likes', '⚽ Likes: football, guitar', 0, '', null],
      ['friends', '👥 Friends: 214', 0, '', null],
    ];
    const SET = [['loc', 'Share my location'], ['posts', 'Posts visible to everyone (public)'], ['geo', 'Add location to my photos'], ['addr', 'Show my home address'], ['mail', 'Show my email address']];
    let picked, settings;

    el.innerHTML = `
      <div class="app safe">
        <section class="pane sf-prof" data-zone="profile">
          <div class="sf-head">${FD.avatar('Chris Mensah', 8, 'big')}<span><b>Chris Mensah</b><small>Age 14</small></span></div>
          <ul class="sf-items">${ITEMS.map(([k, t, r]) => `<li class="sfi" data-k="${k}" data-r="${r}" tabindex="0" role="button">${t}</li>`).join('')}</ul>
          <div class="sf-score"><span id="sfScore"></span><button class="mini-btn" id="sfAns">Show answers</button></div>
          <ul class="sf-why" id="sfWhy" hidden></ul>
        </section>
        <section class="pane sf-side">
          <div class="seg sp-tabs" id="spTabs"><button data-v="report">🚩 Report</button><button data-v="chat">💬 Chat</button><button data-v="settings">🔒 Privacy</button><button data-v="bully">😟 Bullying</button></div>
          <div class="sp" data-panel="report" data-zone="report">
            <h5>🚩 Report</h5>
            <p class="strong">What kind of violation is it?</p>
            <p class="small muted">Seeing something you shouldn’t? Tell us about it.</p>
            <div class="rep-opts" id="repOpts">${['Someone is at risk of harm', 'Misuse of your identity or work', 'This content is gross or hateful'].map((t, i) => `<button class="opt" data-i="${i}">${t} <span>›</span></button>`).join('')}</div>
            <p class="small" id="repMsg"></p>
          </div>
          <div class="sp" data-panel="chat" data-zone="chat">
            <h5>💬 Chat</h5>
            <div class="who-card" id="whoCard"><div class="front">${FD.avatar('Jess', 3)}<span><b>Jess_14</b><small>“14, loves guitar too!”</small></span></div><div class="back">👤<span><b>Real person: unknown</b><small>Could be an adult. You cannot check.</small></span></div></div>
            <ul class="chat" id="sChat"></ul>
            <div class="replies" id="sRep" hidden><button class="opt" data-ok="1">Say no and tell a trusted adult</button><button class="opt" data-ok="0">Go and meet Jess alone</button><button class="opt" data-ok="0">Keep it a secret</button></div>
            <p class="small" id="sMsg"></p>
          </div>
          <div class="sp" data-panel="settings" data-zone="settings">
            <h5>${FD.icon.lock} Privacy settings</h5>
            ${SET.map(([k, t]) => `<label class="tgl sw"><input type="checkbox" data-s="${k}"><span>${t}</span></label>`).join('')}
            <div class="risk"><span>Risk</span><span class="bar"><i id="riskBar"></i></span><b id="riskTxt"></b></div>
            <p class="small muted">Only people you know in the real world should see your personal information.</p>
          </div>
          <div class="sp" data-panel="bully" data-zone="bully">
            <h5>😟 Cyberbullying</h5>
            <ul class="chat bully"><li class="them">You are such a loser 😂</li><li class="them">Everyone saw that photo of you lol</li><li class="them">Nobody likes you</li></ul>
            <ol class="steps5" id="steps5"><li>Do <b>not</b> reply.</li><li><b>Save the evidence</b> (screenshot).</li><li><b>Block</b> the person.</li><li><b>Report</b> them to the site.</li><li><b>Tell</b> an adult you trust.</li></ol>
          </div>
        </section>
        <div class="toasts" id="sToasts"></div>
      </div>`;
    const root = el.querySelector('.safe'), $ = (s) => el.querySelector(s);
    const lis = [...el.querySelectorAll('.sfi')];

    function show(p) { root.dataset.panel = p; FD.segSet($('#spTabs'), p); }
    $('#spTabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(b.dataset.v); });

    // ---------- spot the risks on the profile ----------
    function drawProf(answers = false) {
      lis.forEach((li) => {
        const it = ITEMS.find((x) => x[0] === li.dataset.k);
        li.hidden = !!(it[4] && !settings[it[4]]);
        li.classList.toggle('picked', picked.has(li.dataset.k));
        li.classList.toggle('reveal', answers && it[2] === 1);
      });
      const risky = ITEMS.filter((x) => x[2] && !(x[4] && !settings[x[4]]));
      const found = risky.filter((x) => picked.has(x[0])).length;
      $('#sfScore').innerHTML = risky.length ? `Risks found: <b>${found} / ${risky.length}</b> <small class="muted">· tap the risky parts</small>` : '<b class="good">✓ Much safer now!</b>';
      const why = $('#sfWhy');
      why.hidden = !answers;
      why.innerHTML = answers ? risky.map((x) => `<li>${x[3]}</li>`).join('') : '';
      const n = ITEMS.filter((x) => x[2]).length;
      $('#riskBar').style.width = (risky.length / n) * 100 + '%';
      $('#riskTxt').textContent = risky.length > 3 ? 'High' : risky.length > 1 ? 'Medium' : 'Low';
      root.classList.toggle('low-risk', risky.length <= 1);
    }
    function pick(k) {
      const it = ITEMS.find((x) => x[0] === k), li = el.querySelector(`.sfi[data-k="${k}"]`);
      if (!it[2]) { FD.shake(li); FD.toast($('#sToasts'), 'That one is fine to share with friends.'); return; }
      if (picked.has(k)) picked.delete(k); else picked.add(k);
      drawProf(!$('#sfWhy').hidden);
    }
    lis.forEach((li) => {
      li.addEventListener('click', () => pick(li.dataset.k));
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(li.dataset.k); } });
    });
    $('#sfAns').addEventListener('click', () => drawProf($('#sfWhy').hidden));

    // ---------- settings ----------
    function setS(k, v) {
      settings[k] = v;
      el.querySelector(`[data-s="${k}"]`).checked = v;
      drawProf(!$('#sfWhy').hidden);
    }
    el.querySelectorAll('[data-s]').forEach((c) => c.addEventListener('change', () => setS(c.dataset.s, c.checked)));

    // ---------- report ----------
    function report(i) {
      el.querySelectorAll('#repOpts .opt').forEach((b) => b.classList.toggle('right', +b.dataset.i === i));
      $('#repMsg').innerHTML = '<b class="good">✓ Report sent.</b> The community’s safety team will check it. The person will not know who reported them.';
    }
    $('#repOpts').addEventListener('click', (e) => { const b = e.target.closest('.opt'); if (b) report(+b.dataset.i); });

    // ---------- chat with a stranger ----------
    let chatRun = 0;
    const say = (t, me) => { $('#sChat').appendChild(FD.h(`<li class="${me ? 'me' : 'them'}">${FD.esc(t)}</li>`)); };
    async function chat(ctx, toMeet) {
      const id = ++chatRun;
      $('#sChat').innerHTML = ''; $('#sRep').hidden = true; $('#sMsg').textContent = '';
      $('#whoCard').classList.remove('flip');
      const L = [['Hi! I saw you like guitar too 🎸', 0], ['Yes! I play every day', 1], ['Cool! I’m 14 and I go to a school near you', 0]];
      if (toMeet) L.push(['Let’s meet at the park tomorrow. Don’t tell your parents, OK? 🤫', 0]);
      for (const [t, me] of L) {
        if (!(await ctx.sleep(900)) || id !== chatRun) return;
        say(t, me);
      }
      if (!toMeet) {
        if (!(await ctx.sleep(1100)) || id !== chatRun) return;
        $('#whoCard').classList.add('flip');
      } else $('#sRep').hidden = false;
    }
    $('#sRep').addEventListener('click', (e) => {
      const b = e.target.closest('.opt');
      if (!b) return;
      $('#sRep').querySelectorAll('.opt').forEach((o) => { o.classList.remove('right', 'wrong'); o.disabled = true; });
      b.classList.add(b.dataset.ok === '1' ? 'right' : 'wrong');
      $('#sRep').querySelector('[data-ok="1"]').classList.add('right');
      $('#sMsg').innerHTML = b.dataset.ok === '1' ? '<b class="good">✓ Right.</b> Never meet someone from online on your own. Tell an adult you trust.' : '<b class="bad">✗ Dangerous!</b> You do not know who this person really is. Tell an adult you trust.';
    });
    $('#whoCard').addEventListener('click', () => $('#whoCard').classList.toggle('flip'));

    function reset(p = 'report') {
      chatRun++;
      picked = new Set();
      settings = { loc: true, posts: true, geo: true, addr: true, mail: true };
      SET.forEach(([k]) => { el.querySelector(`[data-s="${k}"]`).checked = true; });
      $('#repMsg').textContent = '';
      el.querySelectorAll('#repOpts .opt').forEach((b) => b.classList.remove('right'));
      $('#sChat').innerHTML = ''; $('#sRep').hidden = true; $('#sMsg').textContent = '';
      $('#sRep').querySelectorAll('.opt').forEach((o) => { o.classList.remove('right', 'wrong'); o.disabled = false; });
      $('#whoCard').classList.remove('flip');
      drawProf(false);
      show(p);
    }
    reset();
    return {
      reset, show, pick, setS, report, chat,
      answers: () => drawProf(true),
      focus: (z) => FD.focus(root, z),
      destroy() { chatRun++; },
    };
  },
  steps: [
    {
      title: 'Report tools',
      text: `<p>Most online communities have features that help members <strong>stay safe</strong>.</p>
             <p>Almost all of them let you <strong>report</strong> users who break the rules of the community, for example if someone is at risk of harm or if content is hateful.</p>`,
      async on(a, ctx) {
        a.reset('report'); a.focus('report');
        if (!(await ctx.sleep(1500))) return;
        a.report(0);
      },
    },
    {
      title: 'Anonymity and misrepresentation',
      text: `<p>Members can choose to stay <strong>anonymous</strong> online. This can protect users.</p>
             <p>But it also means some users can <strong>misrepresent</strong> themselves: they <strong>pretend to be someone they are not</strong>. “Jess, 14” could really be anyone.</p>`,
      async on(a, ctx) { a.reset('chat'); a.focus('chat'); await a.chat(ctx, false); },
    },
    {
      title: 'Never meet alone',
      text: `<p>Make sure you know who you are talking to online.</p>
             <p>If you get to know someone online, <strong>never arrange to meet them in person on your own</strong>.</p>
             <p>If someone asks you to meet them, <strong>tell an adult you trust</strong>.</p>`,
      tip: 'Search online for the CEOP video “Who are you really talking to online?” and discuss it with your class.',
      async on(a, ctx) { a.reset('chat'); a.focus('chat'); await a.chat(ctx, true); },
    },
    {
      title: 'Disclosing personal information',
      text: `<p>It can be dangerous to <strong>disclose</strong> too much personal information online. People could use it for <strong>grooming</strong>, or to find you, your friends or your family.</p>
             <p><strong>Location</strong> can be given away on purpose or by accident, for example by uploading <strong>geotagged</strong> photos. Many apps add your location (from GPS or Wi-Fi data) to posts.</p>`,
      async on(a, ctx) {
        a.reset('settings'); a.focus('profile');
        for (const k of ['loc', 'photo', 'addr']) { if (!(await ctx.sleep(900))) return; a.pick(k); }
        if (!(await ctx.sleep(1000))) return;
        a.answers();
      },
    },
    {
      title: 'How to reduce the risk',
      text: `<ul><li>Think carefully about how much personal information you make <strong>public</strong>.</li>
             <li>Do not post public images that show <strong>where you are</strong> or where you live.</li>
             <li><strong>Check and update your privacy settings</strong> regularly, so only people you know in the real world see your information.</li>
             <li><strong>Report</strong> anyone who misrepresents themselves or puts members at risk.</li></ul>`,
      async on(a, ctx) {
        a.reset('settings'); a.focus(['settings', 'profile']);
        for (const k of ['loc', 'geo', 'addr', 'mail', 'posts']) { if (!(await ctx.sleep(800))) return; a.setS(k, false); }
      },
    },
    {
      title: 'Cyberbullying',
      text: `<p><strong>Cyberbullying</strong> is using the internet to send text or images to <strong>upset or embarrass</strong> someone.</p>
             <p>If it happens to you or a friend: do not reply, save the evidence, block and report the person, and tell an adult you trust.</p>`,
      on: (a) => { a.reset('bully'); a.focus('bully'); },
    },
    {
      title: 'Try it',
      text: `<p>Look at Chris’s profile:</p>
             <ul><li>Tap every part that could put him at risk. Then press <strong>Show answers</strong>.</li>
             <li>Open the <strong>privacy settings</strong> and make his profile safe. Watch the risk bar.</li></ul>`,
      on: (a) => { a.reset('settings'); a.focus(null); },
    },
  ],
});

FD.check({
  section: 'safety',
  intro: 'The last check before the final test. Read each question carefully.',
  items: [
    {
      type: 'spot',
      q: 'This profile sent you a friend request. Which parts suggest it could be a <b>fake</b> profile?',
      html: `<div class="fake">
        <div class="fk-head">${FD.avatar('Lily Rose', 6, 'big')}<span><b>Lily_Rose_2011</b><small>Age 14 · London</small></span></div>
        <p data-spot="1" data-why="The account is brand new, with almost no history.">🗓️ Joined 2 days ago</p>
        <p data-spot="1" data-why="No mutual friends: nobody you know in real life knows this person.">👥 0 mutual friends</p>
        <p data-spot="1" data-why="The photo looks like a professional model picture, maybe copied from the internet.">🖼️ Only 1 photo: a studio model picture</p>
        <p data-spot="0">🎵 Likes: music, cats</p>
        <p data-spot="1" data-why="Asking to keep secrets from parents is a warning sign of grooming.">💬 “Don’t tell your parents we talk 🤫”</p>
        <p data-spot="1" data-why="Asking for a private chat and photos quickly is a warning sign.">💬 “Send me a photo of you on another app”</p>
        <p data-spot="0">🏫 Studies at a school in London</p>
      </div>`,
      why: 'New account, no mutual friends, a model photo, secrets and requests for photos are all warning signs. Do not accept: block and report it.',
    },
    { type: 'mcq', q: 'What is grooming?', opts: ['Pretending to be someone’s friend in order to harm them', 'Adding location data to a photo', 'Using the internet to embarrass someone', 'Hiding your real name online'], why: 'Groomers befriend children or young people in order to harm or abuse them.' },
    { type: 'mcq', q: 'Someone you met in an online game asks to meet you in person. What should you do?', opts: ['Tell an adult you trust and do not go on your own', 'Go, but only during the day', 'Meet them, but keep it a secret', 'Send them your address first'], why: 'Never arrange to meet someone from online on your own. Tell a trusted adult.' },
    { type: 'tf', q: 'A geotagged photo can show other people where you are.', a: true, why: 'A geotag adds location data to the photo.' },
    {
      type: 'multi',
      q: 'Which of these should users think about before sharing personal information?',
      need: 3,
      opts: [['Who will be able to see it (public or friends only)?', true], ['Does it show my location or where I live?', true], ['Could a stranger use it to find or groom me?', true], ['Will it get more likes than my friends’ posts?', false], ['Is the photo in colour?', false]],
      why: 'Think about the audience, location data and how strangers could misuse the information. Check your privacy settings.',
    },
  ],
});
