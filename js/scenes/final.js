FD.add({
  id: 'final',
  title: 'Final test',
  tab: 'Final test',
  icon: 'final',
  color: '--red',
  page: true,
  mount(el) {
    // [topic, question, options (first is correct), explanation]
    const Q = [
      ['function', 'What is the <b>function</b> of an online community?', ['What it does for the people who use it', 'The tools that allow it to work', 'The number of members it has', 'The company that owns it'], 'Features are the tools; the function is what the community is for.'],
      ['targeted marketing', 'How do some social networking sites decide which adverts to show to different members?', ['They match adverts to members’ profile data, such as age and interests', 'They show adverts in alphabetical order', 'Members pay to choose their own adverts', 'They only show adverts from friends'], 'This is targeted marketing.'],
      ['user suggestions', 'How do social networking sites suggest people you may want to connect with?', ['They analyse your interests and suggest friends of your connections', 'They pick members at random', 'They suggest people who live far away', 'They only suggest famous people'], 'Suggestions are based on your interests and the people already in your network.'],
      ['tags', 'What are tags used for in online communities?', ['To categorise content so that other members can search for it', 'To make posts private', 'To delete old posts', 'To block other members'], 'Tags are labels such as #ict. Members search for content using them.'],
      ['benefit of sharing', 'How do social networking services benefit from members sharing content?', ['More information to sell for targeted marketing and more activity to attract advertisers', 'They get faster internet connections', 'They do not need to store any data', 'Members pay a fee for every post'], 'Shared content gives data for advertisers, and an active community is a bigger market.'],
      ['experience points', 'In online gaming, what are experience points?', ['Credits earned for completing part of a game', 'Points for posting on a forum', 'A type of password', 'Money paid to play'], 'XP is shown on the profile so players can choose opponents at their level.'],
      ['work spaces', 'Which feature of an online work space lets two colleagues edit the same document at the same time?', ['Web apps with simultaneous (live) editing', 'A gradebook', 'Experience points', 'A sticky thread'], 'Documents in cloud storage can be edited by several members together.'],
      ['VLE example', 'Which of these is a virtual learning environment (VLE)?', ['Moodle', 'Steam', 'Pinterest', 'Xbox Live'], 'Moodle, Google Classroom, Schoology and Blackboard are VLEs.'],
      ['single sign-on', 'A student is logged in to the school network and is logged in to the VLE automatically. This is…', ['single sign-on', 'a gradebook', 'moderation', 'cloud storage'], 'Single sign-on: log in once to use several related systems.'],
      ['wikis', 'Which feature of a wiki lets the community see which member made each edit?', ['Member accounts (and the page history)', 'Experience points', 'Sponsored posts', 'Video conferencing'], 'Member accounts track which edits each member made.'],
      ['moderators', 'Why do some online communities have moderators?', ['To check that posts are appropriate and block those that break the rules', 'To write all the posts', 'To sell adverts', 'To make the website faster'], 'Moderators allow or block posts and members to keep the community safe.'],
      ['rules', 'Which one of these is used to set the rules for an online community?', ['Acceptable use policies', 'User ratings', 'Analytics', 'Features that allow commenting and sharing'], 'The acceptable use policy tells members what they can and cannot do.'],
      ['social bookmarking', 'What is the function of social bookmarking?', ['To let people share web documents and URLs with each other', 'To play multiplayer games', 'To hand in homework', 'To edit documents with colleagues'], 'Examples: Pinterest, reddit, Pocket, Digg.'],
      ['global', 'Why do many online communities have translation tools?', ['Members come from all over the world, so content reaches more people', 'To stop people from other countries joining', 'To make posts shorter', 'To hide content from teachers'], 'Translation gives wider access to content and services.'],
      ['misrepresentation', 'Pretending to be someone you are not, online, is called…', ['misrepresentation', 'geotagging', 'moderation', 'social bookmarking'], 'Anonymity can protect users, but it also allows misrepresentation.'],
    ];
    const LONG = [
      { q: 'Explain why some online communities have administrators and moderators.', m: 3, s: ['To check posts are appropriate / follow the rules (acceptable use policy) (1).', 'Moderators can allow or block posts, and block or mute members who break the rules (1).', 'Administrators can promote members to moderators or demote them (1).', 'This keeps members safe / protects them from harmful content or cyberbullying (1).'] },
      { q: 'State <b>four</b> ways in which students can use the features of VLEs to support their learning.', m: 4, s: ['Access learning materials: audio, video, links and files (1).', 'Submit assignments online (1).', 'Take quizzes that are marked automatically (1).', 'Check their progress in the gradebook (1).', 'Read announcements on the notice board (1).', 'Discuss work with teachers / classmates in forums, chat rooms, wikis or blogs (1).', 'Work on documents together using document editors (1).'] },
      { q: 'Discuss the factors that users of social networking sites should consider when sharing personal information.', m: 8, s: ['Who can see it: public, friends only or groups; check privacy settings regularly.', 'Location: GPS or Wi-Fi data and geotagged photos can show where you are or live.', 'Strangers may misrepresent themselves; information can be used for grooming.', 'Contact details (address, email, phone) can be used to find you, for phishing or identity theft.', 'Information is stored and used by the site for targeted marketing.', 'Once shared, information can be copied / shared again (viral) and is hard to delete.', 'Benefits: staying in touch, professional networking — balanced against the risks.', 'Conclusion: share only what is needed, with people you know in the real world, and report misuse.'] },
    ];
    const SS = { get: (k) => { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } } };
    let picks, start, finished, order;

    function build() {
      picks = {}; start = null; finished = false;
      order = Q.map((q) => FD.shuffle(q[2].map((o, k) => [o, k === 0])));
      el.innerHTML = `
        <div class="fin-head">
          <span class="chk-ic">${FD.icon.final}</span>
          <div><p class="kick">Online communities</p><h2>Final test</h2></div>
        </div>
        <p class="lead">${Q.length} multiple-choice questions and ${LONG.length} exam-style questions. When you finish, <b>copy your results</b> and send them to your teacher.</p>
        <div class="card who">
          <label>Your name<input id="fName" autocomplete="name" placeholder="First name and surname"></label>
          <label>Class<input id="fClass" placeholder="e.g. 10B"></label>
        </div>
        <h3 class="mt">Part A · Multiple choice</h3>
        <ol class="quiz" id="fq">${Q.map(([, q], i) => `
          <li class="card qz" data-i="${i}"><p class="qz-q">${q}</p>
            <div class="qz-opts">${order[i].map(([o, ok]) => `<button class="opt" data-ok="${ok}" aria-pressed="false">${o}</button>`).join('')}</div>
            <p class="qz-fb" hidden></p></li>`).join('')}</ol>
        <h3 class="mt">Part B · Exam-style questions</h3>
        ${LONG.map((l, i) => `
          <div class="card long">
            <p><b>${i + 1}.</b> ${l.q} <span class="marks">[${l.m} marks]</span></p>
            <textarea rows="${l.m > 4 ? 7 : 4}" id="lg${i}" placeholder="Write your answer here…" aria-label="Answer to question ${i + 1}"></textarea>
            <div class="scheme-box" id="ms${i}" hidden><b>Mark scheme</b><ul class="scheme">${l.s.map((s) => `<li>${s}</li>`).join('')}</ul></div>
          </div>`).join('')}
        <div class="fin-go"><p id="left" class="small"></p><button class="btn primary" id="finish">✓ Finish and mark my test</button></div>
        <div class="card results" id="results" hidden></div>`;
      const $ = (s) => el.querySelector(s);
      $('#fName').value = SS.get('oc-name'); $('#fClass').value = SS.get('oc-class');
      $('#fName').addEventListener('input', (e) => { SS.set('oc-name', e.target.value); begin(); });
      $('#fClass').addEventListener('input', (e) => SS.set('oc-class', e.target.value));
      el.querySelectorAll('textarea').forEach((t) => t.addEventListener('input', begin));
      el.querySelectorAll('.qz').forEach((li) => li.addEventListener('click', (e) => {
        const b = e.target.closest('.opt');
        if (!b || finished) return;
        begin();
        li.querySelectorAll('.opt').forEach((o) => { o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b); });
        picks[li.dataset.i] = [...li.querySelectorAll('.opt')].indexOf(b);
        li.classList.add('answered');
        left();
      }));
      $('#finish').addEventListener('click', finish);
      left();
    }
    function begin() { if (!start) start = Date.now(); }
    function left() {
      const n = Q.length - Object.keys(picks).length;
      el.querySelector('#left').textContent = n ? `${n} multiple-choice question${n > 1 ? 's' : ''} left to answer.` : 'All multiple-choice questions answered. Ready when you are!';
    }

    function finish() {
      const $ = (s) => el.querySelector(s);
      const name = $('#fName').value.trim();
      if (!name) { FD.shake($('#fName')); $('#fName').focus(); $('#left').innerHTML = '<b class="bad">Write your name first.</b>'; return; }
      const miss = Q.findIndex((_, i) => picks[i] == null);
      if (miss >= 0) {
        const li = el.querySelector(`.qz[data-i="${miss}"]`);
        li.scrollIntoView({ behavior: 'smooth', block: 'center' });
        FD.shake(li);
        return;
      }
      finished = true;
      const wrong = [];
      let right = 0;
      el.querySelectorAll('.qz').forEach((li) => {
        const i = +li.dataset.i, opts = [...li.querySelectorAll('.opt')];
        const ok = order[i][picks[i]][1];
        right += ok;
        if (!ok) wrong.push(i);
        li.classList.add('done');
        opts.forEach((o) => o.classList.remove('on'));
        opts[picks[i]].classList.add(ok ? 'right' : 'wrong');
        opts.find((o) => o.dataset.ok === 'true').classList.add('right');
        const fb = li.querySelector('.qz-fb');
        fb.hidden = false;
        fb.className = 'qz-fb ' + (ok ? 'good' : 'bad');
        fb.textContent = (ok ? '✓ Correct. ' : '✗ Not quite. ') + Q[i][3];
      });
      LONG.forEach((_, i) => { $('#ms' + i).hidden = false; $('#lg' + i).readOnly = true; });
      $('#finish').hidden = true; $('#left').hidden = true;

      const mins = Math.max(1, Math.round((Date.now() - (start || Date.now())) / 60000));
      const pct = Math.round((100 * right) / Q.length);
      const date = new Date().toLocaleDateString('en-GB');
      const checks = FD.SECTIONS.map((s) => { const r = FD.results['check-' + s.id]; return [s.short, r ? `${r.score}/${r.total}` : 'not done']; });
      const text = [
        'Online Communities – Final test (IGCSE ICT, Unit 3)',
        `Name: ${name} | Class: ${$('#fClass').value.trim() || '–'} | Date: ${date}`,
        `Score: ${right}/${Q.length} (${pct}%) | Time: ${mins} min`,
        `Section checks: ${checks.map(([n, v]) => `${n} ${v}`).join(' · ')}`,
        `Mistakes: ${wrong.length ? wrong.map((i) => `Q${i + 1} (${Q[i][0]})`).join(', ') : 'none'}`,
        '',
        'Written answers:',
        ...LONG.map((l, i) => `Q${i + 1} [${l.m}]: ${$('#lg' + i).value.trim().replace(/\s+/g, ' ') || '(no answer)'}`),
      ].join('\n');

      const r = $('#results');
      r.hidden = false;
      r.innerHTML = `
        <p class="kick">Your results</p>
        <div class="res-top"><span class="big-score">${right}<small>/${Q.length}</small></span>
          <span><b>${pct}%</b> · ${mins} min<br><span class="muted">${pct >= 80 ? 'Excellent work! 🎉' : pct >= 60 ? 'Good job. Review the questions you missed.' : 'Go back through the sections and try again.'}</span></span></div>
        <div class="res-checks">${checks.map(([n, v]) => `<span class="${v === 'not done' ? 'nd' : ''}"><small>${n}</small><b>${v}</b></span>`).join('')}</div>
        <p class="small muted">Check your written answers against the mark schemes above.</p>
        <pre class="res-text" id="resText"></pre>
        <div class="chk-btns">
          <button class="btn primary" id="copyBtn">${FD.icon.copy} Copy my results</button>
          <button class="btn ghost" id="dlBtn">${FD.icon.download} Download .txt</button>
          <button class="btn ghost" id="again">↺ Try the test again</button>
        </div>
        <p class="small" id="copyMsg">Then paste them (Ctrl+V / ⌘V) in an email or in Google Classroom for your teacher.</p>`;
      $('#resText').textContent = text;
      $('#copyBtn').addEventListener('click', async () => {
        const ok = await FD.copy(text);
        $('#copyMsg').innerHTML = ok ? '<b class="good">✓ Copied!</b> Now paste it (Ctrl+V / ⌘V) in an email or in Google Classroom.' : '<b class="bad">Could not copy automatically.</b> Select the text in the box above and copy it, or download the .txt file.';
      });
      $('#dlBtn').addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
        a.download = `online-communities-${name.replace(/[^\w]+/g, '-').toLowerCase()}.txt`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      });
      $('#again').addEventListener('click', () => { build(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      r.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    build();
  },
});
