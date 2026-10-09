FD.add({
  id: 'gaming',
  title: 'Online gaming communities',
  tab: 'Online gaming',
  icon: 'gaming',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['multiplayer games', 'games played by more than one person, usually online'],
    ['MMORPG', 'Massively Multiplayer Online Role-Playing Game: an online game that lets large numbers of people play together'],
    ['experience points', 'credits earned by a user for completing part of a game'],
    ['forum', 'a website or web page where users post comments and reply to other users’ comments'],
    ['tactics', 'the methods used to achieve a goal'],
  ],
  mount(el) {
    const OPP = [
      { n: 'NoviceNina', lv: 2, win: 0.9, k: 4 },
      { n: 'FairFrank', lv: 5, win: 0.55, k: 1 },
      { n: 'ProPriya', lv: 12, win: 0.15, k: 7 },
    ];
    const FRIENDS = [['Ana_R', 4, true, 'Playing: Dragon Raid'], ['LeoP', 5, true, 'In the lobby'], ['Tomo', 2, false, 'Last online 3 h ago'], ['MayaO', 3, false, 'Last online yesterday']];
    let lv, xp, sel, busy = false;

    el.innerHTML = `
      <div class="app game">
        <div class="app-bar">
          <span class="app-logo">⚔️ QUESTWORLD</span>
          <span class="app-icons">
            <button class="mini-btn" data-zone="social" id="shareBtn">↗ Share to connectly</button>
            <button class="ib" data-zone="notif" aria-label="Notifications">${FD.icon.bell}<i class="badge" id="gBell" hidden></i></button>
          </span>
        </div>
        <div class="game-grid">
          <section class="pane g-prof" data-zone="profile">
            ${FD.avatar('Sam Brave', 0, 'big')}
            <h4>SamTheBrave</h4>
            <p class="lvl">Level <b id="lv"></b></p>
            <div class="xp" data-zone="xp"><div class="xp-bar"><i id="xpFill"></i></div><small id="xpTxt"></small></div>
            <div class="trophies" id="troph"><span title="First win">🏆</span><span title="10 matches">🎖️</span></div>
          </section>
          <section class="pane g-arena">
            <div data-zone="match">
              <h5>Find a match <small class="muted">· choose an opponent</small></h5>
              <div class="opps">${OPP.map((o, i) => `<button class="opp" data-i="${i}">${FD.avatar(o.n, o.k)}<span><b>${o.n}</b><small>Level ${o.lv}</small></span><em class="diff"></em></button>`).join('')}</div>
              <div class="fight" id="fight"><div class="f-bar"><i id="fBar"></i></div><p id="fMsg" class="small">Choose an opponent, then press Play.</p></div>
              <button class="btn primary small-btn" id="playBtn" disabled>▶ Play match</button>
            </div>
            <details class="guide" data-zone="guide" id="guide">
              <summary>📖 Guide: how to complete Level 5 – The Ice Cave</summary>
              <ol><li>Collect the 3 fire stones before you enter.</li><li>Use a fire stone to melt each ice door.</li><li>Fight the Ice Giant from the left side: it cannot turn quickly.</li></ol>
            </details>
          </section>
          <section class="pane g-side">
            <div data-zone="status">
              <h5>Friends</h5>
              <ul class="friends">${FRIENDS.map(([n, k, on, s]) => `<li>${FD.avatar(n, k)}<span><b>${n}</b><small>${s}</small></span><i class="dot ${on ? 'on' : ''}" title="${on ? 'Online' : 'Offline'}"></i></li>`).join('')}</ul>
            </div>
            <div data-zone="forum">
              <h5>Forum · Tactics</h5>
              <ul class="threads">
                <li><b>📌 Best way to beat the Ice Giant?</b><small>42 replies · last by LeoP</small></li>
                <li><b>Team tactics for Dragon Raid</b><small>17 replies · last by Ana_R</small></li>
                <li><b>Which weapon for Level 6?</b><small>8 replies · last by Tomo</small></li>
              </ul>
            </div>
          </section>
        </div>
        <div class="toasts" id="gToasts"></div>
      </div>`;
    const root = el.querySelector('.game'), $ = (s) => el.querySelector(s);
    let bell = 0;

    function draw() {
      $('#lv').textContent = lv;
      $('#xpFill').style.width = xp + '%';
      $('#xpTxt').textContent = `${xp} / 100 XP to level ${lv + 1}`;
      el.querySelectorAll('.opp').forEach((b) => {
        const o = OPP[b.dataset.i], d = o.lv - lv;
        const t = d <= -2 ? ['Easy', 'easy'] : d >= 3 ? ['Hard', 'hard'] : ['Fair', 'fair'];
        b.querySelector('.diff').textContent = t[0];
        b.querySelector('.diff').className = 'diff ' + t[1];
        b.classList.toggle('on', sel === +b.dataset.i);
      });
      $('#playBtn').disabled = sel == null || busy;
    }
    function notify(html) {
      bell++;
      $('#gBell').textContent = bell; $('#gBell').hidden = false; FD.pulse($('#gBell'));
      FD.toast($('#gToasts'), html);
    }
    function pick(i) { sel = i; draw(); }
    el.querySelectorAll('.opp').forEach((b) => b.addEventListener('click', () => { if (!busy) pick(+b.dataset.i); }));

    async function play(force) {
      if (sel == null || busy) return;
      busy = true; draw();
      const o = OPP[sel], fill = $('#fBar'), msg = $('#fMsg');
      msg.textContent = `Fighting ${o.n}…`;
      fill.style.transition = 'none'; fill.style.width = '0';
      void fill.offsetWidth;
      fill.style.transition = `width ${FD.dur(1600)}ms linear`; fill.style.width = '100%';
      await FD.wait(1700);
      if (!root.isConnected) return;
      const win = force != null ? force : Math.random() < o.win;
      const gain = win ? 20 + Math.max(0, o.lv - lv) * 10 : 5;
      msg.innerHTML = win ? `<b class="good">🏆 You won!</b> +${gain} XP` : `<b class="bad">You lost.</b> +${gain} XP for taking part. Try someone at your level.`;
      await addXp(gain);
      busy = false; draw();
    }
    async function addXp(n) {
      xp += n;
      if (xp >= 100) {
        $('#xpFill').style.width = '100%';
        await FD.wait(600);
        xp -= 100; lv++;
        $('#xpFill').style.transition = 'none'; draw(); void $('#xpFill').offsetWidth; $('#xpFill').style.transition = '';
        FD.pulse($('#lv'));
        notify(`⭐ Level up! You are now <b>level ${lv}</b>.`);
      }
      draw();
    }
    $('#playBtn').addEventListener('click', () => play());
    $('#shareBtn').addEventListener('click', () => FD.toast($('#gToasts'), `↗ Shared to <b>connectly</b>: “I reached level ${lv} in Questworld! 🏆”`));
    $('[data-zone="notif"]').addEventListener('click', () => { bell = 0; $('#gBell').hidden = true; });

    function reset() {
      lv = 4; xp = 60; sel = null; busy = false; bell = 0;
      $('#gBell').hidden = true; $('#guide').open = false;
      $('#fBar').style.width = '0'; $('#fMsg').textContent = 'Choose an opponent, then press Play.';
      draw();
    }
    reset();
    return {
      reset, pick, play, notify,
      focus: (z) => FD.focus(root, z),
      share: () => $('#shareBtn').click(),
      guide: (o) => { $('#guide').open = o; },
      destroy() { busy = true; },
    };
  },
  steps: [
    {
      title: 'The function: playing together',
      text: `<p>Online gaming communities exist so that members can play <strong>multiplayer games</strong> together.</p>
             <p>Examples include PlayStation Network, Xbox Live, Steam and <strong>MMORPGs</strong> (Massively Multiplayer Online Role-Playing Games), where huge numbers of people play in the same game world.</p>`,
      on: (a) => { a.reset(); a.focus(null); },
    },
    {
      title: 'User profiles and links to social media',
      text: `<p>Each player has a <strong>user profile</strong> with a name, a picture, their level and their achievements.</p>
             <p><strong>Links to social media</strong> let players share their results on social networks.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus(['profile', 'social']);
        if (!(await ctx.sleep(1400))) return;
        a.share();
      },
    },
    {
      title: 'Experience points',
      text: `<p><strong>Experience points (XP)</strong> are credits earned for completing part of a game.</p>
             <p>They are tracked and shown on the player’s profile. When you get enough XP, you go up a level.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus(['profile', 'match']);
        if (!(await ctx.sleep(700))) return;
        a.pick(1);
        if (!(await ctx.sleep(700))) return;
        await a.play(true);
      },
    },
    {
      title: 'Choosing who to play against',
      text: `<p>Because XP shows how experienced each player is, members can choose to compete against players <strong>based on their level</strong>.</p>
             <p>This makes competitions <strong>more or less challenging</strong>: an easy match, a fair match or a hard one.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('match');
        for (const i of [0, 1, 2]) { if (!(await ctx.sleep(900))) return; a.pick(i); }
      },
    },
    {
      title: 'Guides and forums for tactics',
      text: `<p>Gaming communities give <strong>information about how to complete games</strong>, such as guides and walkthroughs.</p>
             <p><strong>Discussion boards</strong> and <strong>forums</strong> let members discuss <strong>tactics</strong>: the methods used to win.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus(['guide', 'forum']);
        if (!(await ctx.sleep(1100))) return;
        a.guide(true);
      },
    },
    {
      title: 'Statuses and notifications',
      text: `<p><strong>Statuses</strong> show which members are <strong>online</strong> right now, so you can invite them to play.</p>
             <p><strong>Notifications</strong> tell you what is happening in the game, for example a friend comes online or a team match is about to start.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus(['status', 'notif']);
        if (!(await ctx.sleep(1000))) return;
        a.notify('🟢 <b>Ana_R</b> is now online.');
        if (!(await ctx.sleep(1800))) return;
        a.notify('⚔️ Your team’s <b>Dragon Raid</b> starts in 5 minutes!');
      },
    },
    {
      title: 'Try it',
      text: `<p>Choose an opponent and play some matches.</p>
             <ul><li>Which opponent gives the most XP if you win?</li><li>Which one are you most likely to beat?</li><li>Can you reach <strong>level 6</strong>?</li></ul>`,
      on: (a) => { a.reset(); a.focus(null); },
    },
  ],
});

FD.check({
  section: 'gaming',
  items: [
    {
      type: 'sort',
      q: 'Match each feature to what it does.',
      bins: ['Experience points', 'Forum', 'Status', 'Notification'],
      rows: [['Shows how experienced a player is', 0], ['Lets members discuss tactics', 1], ['Shows that a friend is online now', 2], ['Tells you a team match is starting', 3]],
      why: 'XP measures experience, forums are for discussion, statuses show who is online and notifications tell you what is happening.',
    },
    { type: 'mcq', q: 'What is the function of online gaming communities?', opts: ['To let members play multiplayer games together', 'To let teachers set homework', 'To let users edit web pages together', 'To share and categorise website links'], why: 'Gaming communities exist so that members can play multiplayer games together.' },
    { type: 'mcq', q: 'What does MMORPG stand for?', opts: ['Massively Multiplayer Online Role-Playing Game', 'Multi-Media Online Rating and Points Game', 'Main Members Online Role-Playing Group', 'Massive Mobile Online Real-time Play Game'], why: 'An MMORPG lets large numbers of people play the same game together online.' },
    { type: 'tf', q: 'Experience points make it possible to choose opponents so that a competition is more or less challenging.', a: true, why: 'Players can compare levels of experience before choosing who to play against.' },
  ],
});
