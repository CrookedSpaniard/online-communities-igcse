FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['intro', 'Online community', 'A group of people with a shared common interest who communicate online.'],
      ['intro', 'Member', 'Someone who is part of an online community.'],
      ['intro', 'Function / features', 'The function is what a community does for its users. Features are the tools that allow it to achieve its function.'],
      ['social', 'Profile', 'A collection of information about a user, such as name, photo, school and contact details.'],
      ['social', 'Post', 'A message put online so that other members can see it.'],
      ['social', 'Connections', 'People or accounts that a user is connected to (friends, followers…).'],
      ['social', 'Tag', 'A label added to a post to categorise it, so others can search for it, e.g. #ict.'],
      ['social', 'Targeted marketing', 'Advertising matched to users by their age, gender or browsing history.'],
      ['social', 'Viral', 'Shared so widely that it spreads far beyond the creator’s own network.'],
      ['social', 'Notification', 'An alert that tells a user about a new interaction or new content.'],
      ['social', 'Analytics', 'Information that results from the analysis of data, e.g. how many people viewed a post.'],
      ['gaming', 'Multiplayer game', 'A game played by more than one person, usually online.'],
      ['gaming', 'MMORPG', 'Massively Multiplayer Online Role-Playing Game: huge numbers of people play together.'],
      ['gaming', 'Experience points (XP)', 'Credits earned for completing part of a game. Shown on the player’s profile.'],
      ['work', 'Cloud storage', 'Storage provided by servers that are connected to the internet.'],
      ['work', 'Contact list', 'A virtual address book with the contact details of friends and colleagues.'],
      ['work', 'Chat room', 'A place on the internet where users write messages and get replies immediately.'],
      ['vle', 'Virtual learning environment (VLE)', 'A website that contains teaching and learning tools, e.g. Google Classroom or Moodle.'],
      ['vle', 'Single sign-on (SSO)', 'Logging in once to use a number of related websites and systems.'],
      ['vle', 'Moderate', 'Decide whether content is appropriate and whether posts should be removed or posted at all.'],
      ['vle', 'Gradebook', 'A virtual way of recording students’ scores on assignments and tests.'],
      ['reference', 'Wiki', 'A website or database built by many collaborating users, who can all add and edit content.'],
      ['reference', 'Forum', 'A website where users post comments and reply to each other (bulletin board, message board).'],
      ['reference', 'Thread', 'A series of messages about the same subject on a forum.'],
      ['reference', 'Moderator / administrator', 'Moderators allow or block posts and members. Administrators can also promote and demote members.'],
      ['reference', 'Acceptable use policy', 'The rules that tell members what they can and cannot do in a community.'],
      ['ugc', 'User-generated content', 'Content online that has been made by the users of a site or service.'],
      ['ugc', 'Blog / vlog', 'A website updated regularly, like a diary or articles. A vlog is a video blog.'],
      ['ugc', 'Blogger', 'Someone who creates or maintains a blog.'],
      ['ugc', 'Social bookmarking', 'Using tags to categorise web documents and URLs so other people can find them.'],
      ['global', 'Translation tools', 'Software that changes text into other languages, giving wider access to content.'],
      ['safety', 'Anonymity', 'When other people do not know who you are or what your name is.'],
      ['safety', 'Misrepresentation', 'Pretending to be someone or something that you are not.'],
      ['safety', 'Disclose', 'Make information known to other people.'],
      ['safety', 'Grooming', 'Pretending to befriend someone (often a child or young adult) in order to harm them.'],
      ['safety', 'Geotag', 'To add location data to a piece of content, such as a photo.'],
      ['safety', 'Cyberbullying', 'Using the internet to send text or images to upset or embarrass someone.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms"><span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = !s || c.textContent.toLowerCase().includes(s); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
    };
    q.addEventListener('input', filter);
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
