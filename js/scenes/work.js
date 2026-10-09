FD.add({
  id: 'work',
  title: 'Online work spaces',
  tab: 'Work spaces',
  icon: 'work',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['cloud storage', 'storage provided by servers that are connected to the internet'],
    ['contact list', 'a virtual address book to quickly find the contact details of friends and colleagues'],
    ['chat room', 'a place on the internet where users write messages to other people and receive replies immediately'],
    ['VoIP', 'Voice over Internet Protocol: making voice calls over the internet'],
  ],
  mount(el) {
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], TIMES = ['09:00', '11:00', '13:00', '15:00'];
    const RES = { room: ['🚪', 'Meeting room A'], proj: ['📽️', 'Projector'], bus: ['🚐', 'Minibus'] };
    const TAKEN = { room: { 'Mon-09:00': 'Leo', 'Tue-11:00': 'Priya', 'Wed-13:00': 'Leo', 'Thu-09:00': 'Kenji', 'Fri-15:00': 'Priya' }, proj: { 'Mon-11:00': 'Kenji', 'Wed-09:00': 'Priya' }, bus: { 'Tue-09:00': 'Leo', 'Tue-11:00': 'Leo', 'Thu-13:00': 'Kenji' } };
    const PEOPLE = [['Priya Shah', 7, 'Mumbai'], ['Leo Park', 5, 'London'], ['Kenji Sato', 2, 'Tokyo']];
    let res = 'room', mine = {}, chatN = 0;

    el.innerHTML = `
      <div class="app work">
        <div class="app-bar">
          <span class="app-logo">▦ teamspace</span>
          <span class="cloud-st" data-zone="cloud" id="cloudSt">${FD.icon.cloud}<span>Saved to cloud</span></span>
        </div>
        <div class="work-grid">
          <section class="pane w-chat">
            <div data-zone="chat">
              <h5># project-launch <small class="muted">chat room</small></h5>
              <ul class="chat" id="chat"></ul>
              <form class="chat-in" id="chatF"><input id="chatI" placeholder="Message…" aria-label="Chat message" autocomplete="off"><button class="mini-btn">Send</button></form>
            </div>
            <div data-zone="contacts">
              <h5>Shared contacts</h5>
              <ul class="contacts">${PEOPLE.map(([n, k, c]) => `<li>${FD.avatar(n, k)}<span><b>${n}</b><small>${c} · ${n.split(' ')[0].toLowerCase()}@company.com</small></span></li>`).join('')}</ul>
            </div>
          </section>
          <section class="pane w-doc" data-zone="doc">
            <div class="doc-bar">${FD.icon.file}<b>Launch plan.docx</b><span class="editors">${PEOPLE.slice(0, 2).map(([n, k]) => FD.avatar(n, k)).join('')}${FD.avatar('You', 0)}</span></div>
            <div class="doc">
              <h4>New product launch – plan</h4>
              <p class="dl" data-who="Leo Park"><span class="dt" id="dLeo"></span><span class="caret c-leo"><i>Leo</i></span></p>
              <p class="dl" data-who="Priya Shah"><span class="dt" id="dPriya"></span><span class="caret c-priya"><i>Priya</i></span></p>
              <p class="dl mine" id="dMine" contenteditable="true" spellcheck="false" aria-label="Your part of the document">Click here and type your part…</p>
              <div class="cmt" data-zone="comments" id="cmt" hidden>
                <p>${FD.avatar('Priya Shah', 7)} <b>Priya:</b> Can we add the sales chart here?</p>
                <p class="reply" id="reply" hidden>${FD.avatar('You', 0)} <b>You:</b> Yes, I will add it today.</p>
                <button class="mini-btn" id="replyBtn">Reply</button>
              </div>
            </div>
          </section>
          <section class="pane w-side">
            <div data-zone="calendar">
              <h5>Shared calendar · book a resource</h5>
              <div class="seg res" id="res">${Object.entries(RES).map(([k, [e, n]]) => `<button data-v="${k}">${e} ${n}</button>`).join('')}</div>
              <div class="cal" id="cal"></div>
              <p class="small" id="calMsg">Tap a free slot to book it.</p>
            </div>
            <div data-zone="meeting">
              <h5>Virtual meeting</h5>
              <div class="meet" id="meet">
                ${[...PEOPLE, ['You', 0, '']].map(([n, k], i) => `<div class="tile" data-i="${i}">${FD.avatar(n, k)}<small>${n.split(' ')[0]}</small><span class="micx">🎙️</span></div>`).join('')}
                <div class="slide" id="slide"><b>Launch plan</b><span>📈 Sales up 25%</span></div>
              </div>
              <div class="meet-btns"><button class="mini-btn" id="joinBtn">📹 Join video call</button><button class="mini-btn" id="presBtn" disabled>🖥️ Present</button></div>
            </div>
          </section>
        </div>
        <div class="toasts" id="wToasts"></div>
      </div>`;
    const root = el.querySelector('.work'), $ = (s) => el.querySelector(s);
    const mineEl = $('#dMine');

    // ---------- cloud save ----------
    let saveT;
    function saving() {
      const st = $('#cloudSt');
      st.classList.add('busy'); st.querySelector('span').textContent = 'Saving…';
      clearTimeout(saveT);
      saveT = setTimeout(() => { st.classList.remove('busy'); st.querySelector('span').textContent = 'Saved to cloud ✓'; }, FD.dur(900));
    }
    mineEl.addEventListener('focus', () => { if (mineEl.dataset.fresh !== '0') { mineEl.textContent = ''; mineEl.dataset.fresh = '0'; } });
    mineEl.addEventListener('input', saving);

    // ---------- co-editing ----------
    let typeRun = 0;
    async function coEdit(ctx) {
      const id = ++typeRun;
      const L = 'Budget: €20,000 for adverts and a launch event.', P = 'Timeline: launch in Mumbai on 1 March, then London.';
      $('#dLeo').textContent = ''; $('#dPriya').textContent = '';
      root.classList.add('editing');
      for (let i = 0; i < Math.max(L.length, P.length); i++) {
        if (!(await ctx.sleep(45)) || id !== typeRun) return;
        $('#dLeo').textContent = L.slice(0, i + 1);
        $('#dPriya').textContent = P.slice(0, Math.max(0, i - 6));
        if (i % 12 === 0) saving();
      }
      root.classList.remove('editing');
    }
    function fillDoc() { $('#dLeo').textContent = 'Budget: €20,000 for adverts and a launch event.'; $('#dPriya').textContent = 'Timeline: launch in Mumbai on 1 March, then London.'; }

    // ---------- comments ----------
    $('#replyBtn').addEventListener('click', () => { $('#reply').hidden = false; $('#replyBtn').hidden = true; saving(); });

    // ---------- chat ----------
    function say(who, k, text) {
      const li = FD.h(`<li>${FD.avatar(who, k)}<span><b>${who}</b> ${FD.esc(text)}</span></li>`);
      $('#chat').appendChild(li);
      while ($('#chat').children.length > 4) $('#chat').firstElementChild.remove();
    }
    $('#chatF').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = $('#chatI').value.trim();
      if (!t) return;
      say('You', 0, t);
      $('#chatI').value = '';
      const rep = ['Sounds good 👍', 'I agree!', 'Let’s talk about it in the meeting.', 'Thanks!'][chatN++ % 4];
      setTimeout(() => { if (root.isConnected) say('Leo Park', 5, rep); }, FD.dur(900));
    });

    // ---------- calendar & booking ----------
    function drawCal() {
      FD.segSet($('#res'), res);
      const taken = TAKEN[res], m = mine[res] || {};
      $('#cal').innerHTML = `<span></span>${DAYS.map((d) => `<b>${d}</b>`).join('')}` + TIMES.map((t) => `<small>${t}</small>${DAYS.map((d) => {
        const key = `${d}-${t}`, who = m[key] ? 'You' : taken[key];
        return `<button class="slot ${m[key] ? 'mine' : who ? 'busy' : ''}" data-k="${key}" aria-label="${d} ${t}${who ? ' booked by ' + who : ' free'}">${who || ''}</button>`;
      }).join('')}`).join('');
    }
    function book(key) {
      const b = el.querySelector(`.slot[data-k="${key}"]`);
      const m = (mine[res] = mine[res] || {});
      if (TAKEN[res][key]) {
        FD.shake(b);
        $('#calMsg').innerHTML = `<b class="bad">✗ ${RES[res][1]} is already booked by ${TAKEN[res][key]}</b> at that time.`;
        return;
      }
      if (m[key]) { delete m[key]; $('#calMsg').textContent = 'Booking cancelled.'; }
      else { m[key] = 1; $('#calMsg').innerHTML = `<b class="good">✓ ${RES[res][0]} ${RES[res][1]} booked</b> for ${key.replace('-', ' at ')}. Everyone can see it.`; }
      drawCal();
    }
    $('#res').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { res = b.dataset.v; drawCal(); } });
    $('#cal').addEventListener('click', (e) => { const b = e.target.closest('.slot'); if (b) book(b.dataset.k); });

    // ---------- meeting ----------
    let talkT;
    function join(on = !root.classList.contains('in-call')) {
      root.classList.toggle('in-call', on);
      $('#joinBtn').textContent = on ? '📞 Leave call' : '📹 Join video call';
      $('#presBtn').disabled = !on;
      if (!on) present(false);
      clearInterval(talkT);
      if (on) {
        let i = 0;
        talkT = setInterval(() => {
          el.querySelectorAll('.tile').forEach((t) => t.classList.toggle('talk', +t.dataset.i === i % 3));
          i++;
        }, FD.dur(1100));
      } else el.querySelectorAll('.tile').forEach((t) => t.classList.remove('talk'));
    }
    function present(on = !root.classList.contains('presenting')) {
      root.classList.toggle('presenting', on);
      $('#presBtn').textContent = on ? '🖥️ Stop presenting' : '🖥️ Present';
    }
    $('#joinBtn').addEventListener('click', () => join());
    $('#presBtn').addEventListener('click', () => present());

    function reset() {
      typeRun++;
      root.classList.remove('editing');
      res = 'room'; mine = {}; chatN = 0;
      $('#dLeo').textContent = ''; $('#dPriya').textContent = '';
      mineEl.textContent = 'Click here and type your part…'; mineEl.dataset.fresh = '1';
      $('#cmt').hidden = true; $('#reply').hidden = true; $('#replyBtn').hidden = false;
      $('#chat').innerHTML = '';
      say('Priya Shah', 7, 'Good morning team! ☀️');
      say('Kenji Sato', 2, 'Morning! The new logo is in the shared folder.');
      $('#calMsg').textContent = 'Tap a free slot to book it.';
      join(false);
      drawCal();
    }
    reset();
    return {
      reset, coEdit, fillDoc, saving, say, book, join, present,
      focus: (z) => FD.focus(root, z),
      comment: () => { $('#cmt').hidden = false; FD.pulse($('#cmt')); },
      reply: () => $('#replyBtn').click(),
      setRes: (r) => { res = r; drawCal(); },
      destroy() { typeRun++; clearInterval(talkT); clearTimeout(saveT); },
    };
  },
  steps: [
    {
      title: 'The function: working together',
      text: `<p>Online work spaces exist so that members can <strong>collaborate</strong> (work together) for the purposes of work.</p>
             <p>Examples include Slack, Microsoft SharePoint, Adobe Connect and Workplace.</p>
             <p>Team members can be in different offices or even different countries.</p>`,
      on: (a) => { a.reset(); a.fillDoc(); a.focus(null); },
    },
    {
      title: 'Cloud storage and web apps',
      text: `<p>Files are kept in <strong>cloud storage</strong>: storage on servers connected to the internet.</p>
             <p><strong>Web applications</strong> let members work on documents <strong>in a web browser</strong>, from any device. Every change is saved automatically.</p>`,
      async on(a, ctx) {
        a.reset(); a.fillDoc(); a.focus(['doc', 'cloud']);
        if (!(await ctx.sleep(800))) return;
        a.saving();
      },
    },
    {
      title: 'Editing at the same time',
      text: `<p>Two or more members can <strong>edit the same document at the same time</strong>.</p>
             <p>Here Leo (London) and Priya (Mumbai) are typing in the plan together. Everyone sees the changes live, so the team develops the document together.</p>`,
      async on(a, ctx) { a.reset(); a.focus('doc'); await a.coEdit(ctx); },
    },
    {
      title: 'Comments on documents',
      text: `<p>Members can leave <strong>comments</strong> on documents for other users to see and <strong>reply</strong> to.</p>
             <p>This is a quick way to ask questions or suggest changes without changing the text itself.</p>`,
      async on(a, ctx) {
        a.reset(); a.fillDoc(); a.focus('comments');
        a.comment();
        if (!(await ctx.sleep(1800))) return;
        a.reply();
      },
    },
    {
      title: 'Messaging, chat rooms and contacts',
      text: `<ul><li><strong>Messaging systems</strong> let members discuss the work.</li>
             <li><strong>Chat rooms</strong> show messages immediately, so a team can talk in real time.</li>
             <li><strong>Shared contact lists</strong> are a virtual address book with everyone’s details.</li></ul>`,
      async on(a, ctx) {
        a.reset(); a.fillDoc(); a.focus(['chat', 'contacts']);
        if (!(await ctx.sleep(1000))) return;
        a.say('Leo Park', 5, 'Can we meet on Thursday to check the budget?');
        if (!(await ctx.sleep(1300))) return;
        a.say('You', 0, 'Yes! I will book a room.');
      },
    },
    {
      title: 'Shared calendars and booking',
      text: `<p><strong>Shared calendars</strong> let members see each other’s diaries and arrange meetings when everyone is free.</p>
             <p><strong>Booking systems</strong> reserve resources such as meeting rooms, ICT equipment and transport, so two people cannot book the same thing.</p>`,
      async on(a, ctx) {
        a.reset(); a.fillDoc(); a.focus('calendar');
        if (!(await ctx.sleep(900))) return;
        a.book('Thu-09:00');
        if (!(await ctx.sleep(1600))) return;
        a.book('Thu-11:00');
      },
    },
    {
      title: 'Virtual meetings',
      text: `<p>Virtual meeting spaces let members:</p>
             <ul><li><strong>give and watch presentations</strong></li><li><strong>speak to each other</strong> using VoIP (voice calls over the internet)</li><li>use <strong>video conferencing</strong> tools.</li></ul>
             <p>A team spread across the world can meet without travelling.</p>`,
      async on(a, ctx) {
        a.reset(); a.fillDoc(); a.focus('meeting');
        if (!(await ctx.sleep(700))) return;
        a.join(true);
        if (!(await ctx.sleep(2200))) return;
        a.present(true);
      },
    },
    {
      title: 'Try it',
      text: `<ul><li>Type your part of the plan and watch it <strong>save to the cloud</strong>.</li>
             <li>Send a message in the <strong>chat room</strong>.</li>
             <li>Book the <strong>minibus</strong> for a time when it is free.</li>
             <li>Join the <strong>video call</strong> and present.</li></ul>`,
      on: (a) => { a.reset(); a.fillDoc(); a.focus(null); },
    },
  ],
});

FD.check({
  section: 'work',
  items: [
    {
      type: 'sort',
      q: 'Is each one a feature of an online work space?',
      bins: ['Work space feature', 'Not a work space feature'],
      rows: [['Editing a document at the same time as a colleague', 0], ['Shared calendars to arrange meetings', 0], ['Earning experience points for winning a match', 1], ['Booking a meeting room or a projector', 0], ['Video conferencing and VoIP calls', 0], ['Sponsored posts at the top of your stream', 1]],
      why: 'Work spaces help people collaborate: co-editing, shared calendars, booking systems and virtual meetings. XP belongs to gaming and sponsored posts to social networks.',
    },
    { type: 'mcq', q: 'Where are the files in an online work space usually kept?', opts: ['In cloud storage on servers connected to the internet', 'Only on a USB memory stick', 'On paper in the office', 'In the RAM of each computer'], why: 'Cloud storage means members can reach the documents from any device with a web browser.' },
    { type: 'multi', q: 'Why could online work spaces benefit a large international company?', need: 2, opts: [['Staff in different countries can edit the same documents together', true], ['Teams can hold video meetings without travelling', true], ['Staff never need an internet connection', false], ['Every member must work in the same office', false]], why: 'People can collaborate from anywhere, saving time and travel costs.' },
  ],
});
