// Shared namespace, helpers, icons, avatars and the results store.
window.FD = (() => {
  'use strict';
  const FD = { scenes: [], speed: 1 };

  FD.add = (scene) => FD.scenes.push(scene);

  // Build one element from an HTML string.
  FD.h = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  // Durations are divided by the playback speed.
  FD.dur = (ms) => ms / FD.speed;
  FD.wait = (ms) => new Promise((r) => setTimeout(r, FD.dur(ms)));
  FD.fmt = (n) => Math.round(n).toLocaleString('en-GB');
  FD.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  FD.shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

  // Animate a clone of `from` flying to where `to` sits.
  FD.flyFrom = (fromEl, toEl, ms = 650) => {
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    if (!b.width) return Promise.resolve();
    const anim = toEl.animate(
      [{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: 'none' }],
      { duration: FD.dur(ms), easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
    return anim.finished.catch(() => {});
  };

  FD.shake = (el) => {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
  };
  FD.pulse = (el) => {
    if (!el) return;
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
  };

  // Segmented control: buttons with data-v, one is .on.
  FD.segSet = (root, v) => {
    root.querySelectorAll('button[data-v]').forEach((b) => {
      const on = b.dataset.v === String(v);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
    });
  };

  // Highlight one zone of a mock app: root gets .focusing, matching [data-zone] gets .focus.
  FD.focus = (root, zones) => {
    const list = zones ? [].concat(zones) : [];
    root._zones = list;
    root.classList.toggle('focusing', list.length > 0);
    const zs = [...root.querySelectorAll('[data-zone]')];
    zs.forEach((z) => { z.classList.toggle('focus', list.includes(z.dataset.zone)); z.classList.remove('focus-in'); });
    // A zone that contains a highlighted zone must not be dimmed, or its child would be dimmed too.
    zs.filter((z) => z.classList.contains('focus')).forEach((z) => {
      for (let p = z.parentElement?.closest('[data-zone]'); p && root.contains(p); p = p.parentElement?.closest('[data-zone]')) p.classList.add('focus-in');
    });
  };

  FD.refocus = (root) => { if (root._zones && root._zones.length) FD.focus(root, root._zones); };

  // Small toast inside a mock app.
  FD.toast = (host, html, ms = 2600) => {
    const t = FD.h(`<div class="toast">${html}</div>`);
    host.appendChild(t);
    setTimeout(() => t.classList.add('out'), FD.dur(ms));
    setTimeout(() => t.remove(), FD.dur(ms) + 400);
  };

  // Copy text to the clipboard, with a fallback for older browsers.
  FD.copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  };

  // ---------- sections (the seven types of community + safety) ----------
  FD.SECTIONS = [
    { id: 'social', name: 'Social networking', short: 'Social', color: '--c4', line: 'Connect with people who share your interests.' },
    { id: 'gaming', name: 'Online gaming', short: 'Gaming', color: '--c3', line: 'Play multiplayer games together.' },
    { id: 'work', name: 'Online work spaces', short: 'Work', color: '--c2', line: 'Work together on the same projects.' },
    { id: 'vle', name: 'Virtual learning environments', short: 'VLE', color: '--c7', line: 'Teach, learn and hand in work online.' },
    { id: 'reference', name: 'Wikis and forums', short: 'Wikis & forums', color: '--c5', line: 'Build reference pages and discuss topics.' },
    { id: 'ugc', name: 'User-generated content', short: 'Content', color: '--c6', line: 'Share videos, photos, blogs and bookmarks.' },
    { id: 'global', name: 'Global communication', short: 'Global', color: '--c1', line: 'Communicate and collaborate all over the world.' },
    { id: 'safety', name: 'Staying safe online', short: 'Safety', color: '--c9', line: 'Protect yourself and other members.' },
  ];
  FD.section = (id) => FD.SECTIONS.find((s) => s.id === id);

  // ---------- results of the section checks (kept for this browser tab only) ----------
  FD.results = {};
  try { FD.results = JSON.parse(sessionStorage.getItem('oc-results') || '{}') || {}; } catch (e) { FD.results = {}; }
  FD.saveResult = (id, score, total) => {
    const r = FD.results[id] || { tries: 0 };
    FD.results[id] = { score, total, tries: r.tries + 1 };
    try { sessionStorage.setItem('oc-results', JSON.stringify(FD.results)); } catch (e) { /* ignore */ }
    if (FD.onResult) FD.onResult(id);
  };

  // ---------- icons (24×24 line icons) ----------
  const ic = (p) => `<svg viewBox="0 0 24 24" class="ic" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  FD.icon = {
    intro: ic('<circle cx="12" cy="12" r="3"/><circle cx="4.5" cy="5" r="2"/><circle cx="19.5" cy="5" r="2"/><circle cx="4.5" cy="19" r="2"/><circle cx="19.5" cy="19" r="2"/><path d="M6 6.4l3.8 3.6M18 6.4l-3.8 3.6M6 17.6l3.8-3.6M18 17.6l-3.8-3.6"/>'),
    social: ic('<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>'),
    gaming: ic('<path d="M7 8h10a4.5 4.5 0 0 1 4.4 5.5l-.8 3.4a2.4 2.4 0 0 1-4.2 1L14.6 16H9.4l-1.8 1.9a2.4 2.4 0 0 1-4.2-1l-.8-3.4A4.5 4.5 0 0 1 7 8z"/><path d="M7.5 11v3M6 12.5h3"/><circle cx="15.5" cy="11.5" r=".6"/><circle cx="17.5" cy="13.5" r=".6"/>'),
    work: ic('<rect x="3" y="7.5" width="18" height="12.5" rx="2"/><path d="M8.5 7.5V5.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v2"/><path d="M3 12.5h18"/>'),
    vle: ic('<path d="M2.5 9L12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c1.5 1.6 3.4 2.5 5.5 2.5s4-.9 5.5-2.5v-5"/><path d="M21.5 9v5"/>'),
    reference: ic('<path d="M4 4.5h11l5 5V20H4z"/><path d="M15 4.5v5h5"/><path d="M7.5 13h9M7.5 16.5h6"/>'),
    ugc: ic('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M10 9.2v5.6l4.8-2.8z"/>'),
    global: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>'),
    safety: ic('<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>'),
    terms: ic('<path d="M3.5 5h6a2.5 2.5 0 0 1 2.5 2.5V20a2 2 0 0 0-2-2H3.5z"/><path d="M20.5 5h-6A2.5 2.5 0 0 0 12 7.5V20a2 2 0 0 1 2-2h6.5z"/>'),
    final: ic('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1"/><path d="M8.5 11l1.6 1.6 3-3M8.5 16.5h7"/>'),
    check: ic('<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.2 9.6"/>'),
    tick: ic('<path d="M4.5 12.5l5 5 10-11"/>'),
    cross: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
    heart: ic('<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10z"/>'),
    share: ic('<path d="M17 3.5l4 4-4 4"/><path d="M21 7.5h-8a6 6 0 0 0-6 6V20"/>'),
    comment: ic('<path d="M4 5h16v11H9l-5 4z"/>'),
    bell: ic('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
    msg: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/>'),
    tag: ic('<path d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5z"/><circle cx="8" cy="8.5" r="1.4"/>'),
    star: ic('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>'),
    flag: ic('<path d="M5 21V4"/><path d="M5 4.5h12l-2.5 4 2.5 4H5"/>'),
    lock: ic('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
    globe: ic('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>'),
    pin: ic('<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
    up: ic('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    down: ic('<path d="M12 5v14M6 13l6 6 6-6"/>'),
    plus: ic('<path d="M12 5v14M5 12h14"/>'),
    search: ic('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),
    cloud: ic('<path d="M7 18.5h10.5a4 4 0 0 0 .6-8A6 6 0 0 0 6.6 9.2 4.7 4.7 0 0 0 7 18.5z"/>'),
    video: ic('<rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="M15.5 10.5l6-3.5v10l-6-3.5z"/>'),
    mic: ic('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
    calendar: ic('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    file: ic('<path d="M6 3h8l4.5 4.5V21H6z"/><path d="M14 3v4.5h4.5"/>'),
    edit: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
    eye: ic('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>'),
    translate: ic('<path d="M3.5 5.5h9M8 3.5v2M5.5 5.5c.8 3.4 3.1 6 6 7.2"/><path d="M10.5 5.5c-.7 3.6-3 6.6-6.5 8"/><path d="M12.5 20.5l4-9 4 9M14 17.3h5"/>'),
    copy: ic('<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5"/>'),
    download: ic('<path d="M12 4v11M7 10.5l5 5 5-5"/><path d="M4.5 19.5h15"/>'),
    bookmark: ic('<path d="M6.5 3.5h11V21l-5.5-4-5.5 4z"/>'),
    trophy: ic('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4"/><path d="M12 13v4M8.5 20.5h7M9.5 17h5v3.5h-5z"/>'),
    chart: ic('<path d="M3.5 3.5v17h17"/><path d="M7.5 15l4-4.5 3 2.5 5-6"/>'),
    user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    shield: ic('<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/>'),
  };

  // ---------- avatars: a coloured circle with initials (all names are made up) ----------
  const AV = ['#1c7ed6', '#e8590c', '#7048e8', '#2f9e44', '#d6336c', '#0b7f95', '#e67700', '#c92a2a', '#5c7cfa', '#0c8f7e'];
  FD.avatar = (name, k, cls = '') => {
    const ini = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const col = AV[(k == null ? name.length : k) % AV.length];
    return `<span class="av ${cls}" style="--av:${col}" aria-hidden="true">${ini}</span>`;
  };

  return FD;
})();
