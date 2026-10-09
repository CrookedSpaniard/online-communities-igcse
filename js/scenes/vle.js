FD.add({
  id: 'vle',
  title: 'Virtual learning environments (VLEs)',
  tab: 'VLEs',
  icon: 'vle',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['virtual learning environment (VLE)', 'a website that contains teaching and learning tools'],
    ['single sign-on (SSO)', 'log in once to use a number of related websites and systems'],
    ['moderate', 'decide whether content is appropriate, and whether posts should be removed or posted at all'],
    ['gradebook', 'a virtual way of recording students’ scores on assignments and tests'],
  ],
  mount(el) {
    const QZ = [['A wiki is a website that…', ['many users can edit', 'only one person can edit', 'cannot be searched'], 0], ['XP stands for…', ['experience points', 'extra pages', 'external posts'], 0]];
    const STU = [['Sam Lee', 0, 9], ['Ana Ruiz', 4, 12], ['Tom Okafor', 2, 3], ['Maya Ortiz', 3, 7], ['Leo Park', 5, 1]];
    let view, submitted, quizScore, approved;

    el.innerHTML = `
      <div class="app vle">
        <div class="app-bar">
          <span class="app-logo">🎓 ClassHub <small>· 10B ICT</small></span>
          <span class="seg view" id="view"><button data-v="student">Student</button><button data-v="teacher">Teacher</button></span>
        </div>
        <div class="login" data-zone="login" id="login">
          <div class="login-card">
            <p class="app-logo">🎓 ClassHub</p>
            <p class="small muted">Riverside School network</p>
            <button class="btn primary small-btn" id="ssoBtn">🔑 Sign in with school account</button>
            <p class="small" id="ssoMsg"></p>
          </div>
        </div>
        <div class="vle-grid">
          <section class="pane v-left">
            <div data-zone="notice">
              <h5>📌 Notice board</h5>
              <ul class="notices"><li><b>Test on Unit 3</b><small>Friday 18 October</small></li><li><b>Computer room closed</b><small>Wednesday afternoon</small></li></ul>
            </div>
            <div data-zone="grades">
              <h5>Gradebook</h5>
              <table class="grades"><tr><td>Quiz: online communities</td><td id="gQuiz">–</td></tr><tr><td>Poster assignment</td><td id="gPoster">–</td></tr><tr><td>Unit 2 test</td><td>78%</td></tr></table>
            </div>
          </section>
          <section class="pane v-wall" data-zone="wall">
            <article class="vpost" data-zone="files">
              <header>${FD.avatar('Ms Navarro', 1)}<span><b>Ms Navarro</b><small>Teacher · today</small></span></header>
              <p>Here are the materials for this week:</p>
              <div class="atts"><span>🎬 Video: How wikis work</span><span>🔗 Link: Online safety guide</span><span>🎧 Podcast: Life online</span><span>📝 Worksheet (edit together)</span></div>
            </article>
            <article class="vpost" data-zone="assign">
              <header><span class="v-ic">📄</span><span><b>Assignment: online communities poster</b><small>Due Friday · 20 points</small></span></header>
              <div class="upl" id="upl"><span id="uplTxt">No file attached</span><button class="mini-btn" id="attBtn">📎 Add file</button><button class="btn small-btn primary" id="subBtn" disabled>Hand in</button></div>
            </article>
            <article class="vpost" data-zone="quiz">
              <header><span class="v-ic">✅</span><span><b>Quick quiz</b><small>Marked automatically</small></span></header>
              <div class="vquiz">${QZ.map(([q, o], i) => `<div class="vq" data-i="${i}"><p>${q}</p>${o.map((t, k) => `<button class="mini-btn" data-k="${k}">${t}</button>`).join('')}</div>`).join('')}</div>
              <p class="small" id="qRes"></p>
            </article>
            <article class="vpost" data-zone="moderate">
              <header>${FD.avatar('Tom Okafor', 2)}<span><b>Tom Okafor</b><small>Class forum</small></span></header>
              <p>Can someone explain what a moderator does? 🤔</p>
              <p class="pend" id="pend">⏳ Waiting for the teacher to approve this post</p>
              <div class="t-only"><button class="mini-btn ok" id="apprBtn">✓ Approve</button><button class="mini-btn" id="rejBtn">✕ Remove</button></div>
            </article>
          </section>
          <section class="pane v-right">
            <div data-zone="stats" class="t-only-block">
              <h5>Access statistics <small class="muted">· logins this week</small></h5>
              <ul class="stats">${STU.map(([n, k, v]) => `<li>${FD.avatar(n, k)}<span>${n.split(' ')[0]}</span><span class="bar"><i style="--v:${v * 8}%"></i></span><b>${v}</b></li>`).join('')}</ul>
              <p class="small muted">Leo has only logged in once. Maybe he needs help?</p>
            </div>
            <div class="s-only-block">
              <h5>Your progress</h5>
              <div class="prog-ring" id="ring"><span id="ringTxt">1 / 3</span></div>
              <p class="small muted">Tasks completed this week</p>
            </div>
          </section>
        </div>
        <div class="toasts" id="vToasts"></div>
      </div>`;
    const root = el.querySelector('.vle'), $ = (s) => el.querySelector(s);
    let attached = false;

    function setView(v) {
      view = v;
      FD.segSet($('#view'), v);
      root.dataset.view = v;
    }
    $('#view').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setView(b.dataset.v); });

    async function login(ctx) {
      const m = $('#ssoMsg');
      root.classList.add('locked');
      m.textContent = '';
      if (ctx && !(await ctx.sleep(900))) return root.classList.remove('locked');
      m.innerHTML = '✓ You are already logged in to the school network.<br>Signing you in automatically…';
      await FD.wait(1300);
      root.classList.remove('locked');
    }
    $('#ssoBtn').addEventListener('click', () => login());

    function progress() {
      const n = 1 + (submitted ? 1 : 0) + (quizScore != null ? 1 : 0);
      $('#ringTxt').textContent = `${n} / 3`;
      $('#ring').style.setProperty('--p', (n / 3) * 100 + '%');
    }
    function attach() { attached = true; $('#uplTxt').textContent = '🖼️ my-poster.png'; $('#subBtn').disabled = submitted; }
    function submit() {
      if (!attached || submitted) return;
      submitted = true;
      $('#upl').classList.add('done');
      $('#subBtn').textContent = 'Handed in ✓'; $('#subBtn').disabled = true; $('#attBtn').disabled = true;
      FD.toast($('#vToasts'), '📄 Assignment handed in. Your teacher has been notified.');
      setTimeout(() => { if (!root.isConnected || !submitted) return; $('#gPoster').textContent = '17 / 20'; FD.pulse($('#gPoster')); }, FD.dur(1600));
      progress();
    }
    $('#attBtn').addEventListener('click', attach);
    $('#subBtn').addEventListener('click', submit);

    const answers = {};
    function answer(i, k) {
      if (answers[i] != null || quizScore != null) return;
      answers[i] = k;
      const q = el.querySelector(`.vq[data-i="${i}"]`);
      q.querySelectorAll('button').forEach((b) => {
        b.disabled = true;
        if (+b.dataset.k === QZ[i][2]) b.classList.add('right');
        else if (+b.dataset.k === k) b.classList.add('wrong');
      });
      if (Object.keys(answers).length === QZ.length) {
        quizScore = QZ.filter((q2, j) => answers[j] === q2[2]).length;
        $('#qRes').innerHTML = `<b>Marked automatically: ${quizScore} / ${QZ.length}</b> · saved to your gradebook`;
        $('#gQuiz').textContent = `${quizScore} / ${QZ.length}`;
        FD.pulse($('#gQuiz'));
        progress();
      }
    }
    el.querySelectorAll('.vq').forEach((q) => q.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) answer(+q.dataset.i, +b.dataset.k); }));

    function approve(ok = true) {
      if (approved != null) return;
      approved = ok;
      const p = $('#pend');
      p.className = 'pend ' + (ok ? 'ok' : 'gone');
      p.textContent = ok ? '✓ Approved by the teacher: everyone can see it' : '✕ Removed by the teacher';
      root.classList.add('moderated');
    }
    $('#apprBtn').addEventListener('click', () => approve(true));
    $('#rejBtn').addEventListener('click', () => approve(false));

    function reset() {
      submitted = false; quizScore = null; approved = null; attached = false;
      Object.keys(answers).forEach((k) => delete answers[k]);
      root.classList.remove('locked', 'moderated');
      $('#upl').classList.remove('done');
      $('#uplTxt').textContent = 'No file attached';
      $('#subBtn').textContent = 'Hand in'; $('#subBtn').disabled = true; $('#attBtn').disabled = false;
      el.querySelectorAll('.vq button').forEach((b) => { b.disabled = false; b.classList.remove('right', 'wrong'); });
      $('#qRes').textContent = '';
      $('#gQuiz').textContent = '–'; $('#gPoster').textContent = '–';
      $('#pend').className = 'pend'; $('#pend').textContent = '⏳ Waiting for the teacher to approve this post';
      setView('student');
      progress();
    }
    reset();
    return {
      reset, login, setView, attach, submit, answer, approve,
      focus: (z) => FD.focus(root, z),
      open: (z) => { const n = el.querySelector(`[data-zone="${z}"]`); n && n.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); },
    };
  },
  steps: [
    {
      title: 'The function: learning online',
      text: `<p><strong>Virtual learning environments (VLEs)</strong> let students and teachers use <strong>learning and assessment materials</strong> online.</p>
             <p>Examples: Google Classroom, Moodle, Schoology, Blackboard and Pearson ActiveTeach.</p>
             <p>Many features are like work spaces and social networks, but a VLE does <strong>not</strong> connect you with people outside your class or school.</p>`,
      on: (a) => { a.reset(); a.focus(null); },
    },
    {
      title: 'Log in once: single sign-on',
      text: `<p>The <strong>log-in system</strong> is often linked to the school’s own network.</p>
             <p>If you are already logged in to the school network, you are logged in to the VLE automatically. This is called <strong>single sign-on (SSO)</strong>.</p>`,
      async on(a, ctx) { a.reset(); a.focus('login'); await a.login(ctx); },
    },
    {
      title: 'Wall and notice board',
      text: `<p>A <strong>wall</strong> or <strong>timeline</strong>, like on a social network, shows posts by teachers and students.</p>
             <p>A <strong>notice board</strong> shows important announcements about the course.</p>`,
      on: (a) => { a.reset(); a.focus(['wall', 'notice']); },
    },
    {
      title: 'Sharing files and documents',
      text: `<p>Teachers and students can share <strong>audio, video, web links and files</strong>.</p>
             <p><strong>Document editors</strong> let teachers create documents that students use, and sometimes work on together with the teacher.</p>`,
      on: (a) => { a.reset(); a.focus('files'); },
    },
    {
      title: 'Quizzes marked automatically',
      text: `<p>VLEs have <strong>quizzes</strong> and <strong>multiple-choice tests</strong> that are often <strong>graded automatically</strong>.</p>
             <p>Students get their result straight away, and the teacher saves time.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('quiz'); a.open('quiz');
        if (!(await ctx.sleep(1000))) return;
        a.answer(0, 0);
        if (!(await ctx.sleep(900))) return;
        a.answer(1, 0);
      },
    },
    {
      title: 'Handing in assignments',
      text: `<p>VLEs have <strong>tools for submitting assignments</strong>.</p>
             <p>Students upload their work before the deadline. The teacher is notified, marks it and returns it, all online.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('assign');
        if (!(await ctx.sleep(900))) return;
        a.attach();
        if (!(await ctx.sleep(900))) return;
        a.submit();
      },
    },
    {
      title: 'Moderated communication',
      text: `<p>VLEs have <strong>communication tools</strong>: forums, chat rooms, wikis, blogs and social networking features.</p>
             <p>Posts are usually <strong>moderated</strong> by the teacher: the teacher decides if a post is appropriate before everyone can see it.</p>`,
      async on(a, ctx) {
        a.reset(); a.focus('moderate'); a.open('moderate');
        if (!(await ctx.sleep(1200))) return;
        a.setView('teacher');
        if (!(await ctx.sleep(1200))) return;
        a.approve(true);
      },
    },
    {
      title: 'Gradebooks and access statistics',
      text: `<ul><li><strong>Gradebooks</strong> let teachers and students see progress through materials and assignments.</li>
             <li><strong>Access statistics</strong> let teachers see how often each student uses the VLE.</li></ul>`,
      async on(a, ctx) {
        a.reset(); a.focus(['grades', 'stats']);
        if (!(await ctx.sleep(900))) return;
        a.setView('teacher');
      },
    },
    {
      title: 'Try it',
      text: `<ul><li>Do the <strong>quick quiz</strong> and check the gradebook.</li><li>Attach your poster and <strong>hand it in</strong>.</li>
             <li>Switch to <strong>Teacher</strong> view: moderate Tom’s post and look at the access statistics.</li></ul>`,
      on: (a) => { a.reset(); a.focus(null); },
    },
  ],
});

FD.check({
  section: 'vle',
  items: [
    {
      type: 'multi',
      q: 'State <b>four</b> ways students can use the features of a VLE to support their learning.',
      need: 4,
      opts: [['Download materials shared by the teacher', true], ['Hand in assignments online', true], ['Take quizzes that are marked automatically', true], ['Check their progress in the gradebook', true], ['Earn experience points by beating other players', false], ['Promote posts to reach more people', false], ['Book the school minibus for a trip', false], ['Connect with strangers outside the school', false]],
      why: 'Students use VLEs to get materials, submit work, do auto-graded quizzes, check grades, read notices and discuss work.',
    },
    { type: 'mcq', q: 'What is single sign-on (SSO)?', opts: ['Logging in once to use a number of related websites and systems', 'A password that is only one character long', 'Signing a document online', 'Logging in with your fingerprint'], why: 'With SSO, if you are logged in to the school network you are logged in to the VLE too.' },
    { type: 'tf', q: 'Posts on a VLE are usually moderated by the teacher.', a: true, why: 'The teacher decides whether posts are appropriate.' },
    { type: 'mcq', q: 'Which VLE feature lets a teacher see how often each student uses the VLE?', opts: ['Access statistics', 'Notice board', 'Gradebook', 'Document editor'], why: 'Access statistics track how frequently students use the VLE’s facilities.' },
  ],
});
