/* ═══════════════════════════════════════════════════════════════
   GigAI Pro — Application Logic
   HCI Task 2 Prototype · BAXU 2313
═══════════════════════════════════════════════════════════════ */

/* ── PROFILE STATE ──────────────────────────────────────── */
const PROFILE = {
  firstName: 'Alex',
  lastName:  'Rahman',
  bio:       'Empowering the next generation of AI practitioners through practical, hands-on learning experiences. Specialising in Prompt Engineering, LangChain, and AI tooling for professionals.',
  website:   'https://alexrahman.my',
};

const SOCIAL_PLATFORMS = {
  linkedin:  { label: 'LinkedIn',    icon: 'ti-brand-linkedin',  color: '#4d9de0', bg: 'rgba(10,102,194,0.15)' },
  instagram: { label: 'Instagram',   icon: 'ti-brand-instagram', color: '#e1306c', bg: 'rgba(225,48,108,0.12)' },
  youtube:   { label: 'YouTube',     icon: 'ti-brand-youtube',   color: '#ff4444', bg: 'rgba(255,0,0,0.12)' },
  twitter:   { label: 'X / Twitter', icon: 'ti-brand-x',         color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  tiktok:    { label: 'TikTok',      icon: 'ti-brand-tiktok',    color: '#ff0050', bg: 'rgba(255,0,80,0.12)' },
  facebook:  { label: 'Facebook',    icon: 'ti-brand-facebook',  color: '#4267b2', bg: 'rgba(66,103,178,0.12)' },
  github:    { label: 'GitHub',      icon: 'ti-brand-github',    color: '#a0aec0', bg: 'rgba(160,174,192,0.12)' },
  website:   { label: 'Website',     icon: 'ti-globe',           color: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
};

let socialLinks = [
  { platform: 'linkedin',  url: 'https://linkedin.com/in/alexrahman-ai' },
  { platform: 'instagram', url: 'https://instagram.com/alexrahman.ai' },
  { platform: 'youtube',   url: 'https://youtube.com/@GigAIAlex' },
];

/* Sync profile data to every UI location that displays it */
function updateProfileUI() {
  const fullName = `${PROFILE.firstName} ${PROFILE.lastName}`.trim();
  const initials = ((PROFILE.firstName[0] || '') + (PROFILE.lastName[0] || '')).toUpperCase();

  const $ = id => document.getElementById(id);

  // Sidebar
  const sidebarAvatar = $('sidebar-avatar');
  const sidebarName   = $('sidebar-user-name');
  if (sidebarAvatar) sidebarAvatar.textContent = initials;
  if (sidebarName)   sidebarName.textContent   = fullName;

  // Topbar
  const topbarAvatar = $('topbar-avatar');
  if (topbarAvatar) topbarAvatar.textContent = initials;

  // Dashboard greeting
  const welcomeName = $('welcome-user-name');
  if (welcomeName) welcomeName.textContent = fullName;

  // Profile screen – view mode
  const dispName = $('profile-display-name');
  const dispBio  = $('profile-display-bio');
  if (dispName) dispName.textContent = fullName;
  if (dispBio)  dispBio.textContent  = PROFILE.bio;

  // Keep Settings fields in sync
  const setFname   = $('set-fname');
  const setLname   = $('set-lname');
  const setBio     = $('set-bio');
  const setWebsite = $('set-website');
  if (setFname)   setFname.value   = PROFILE.firstName;
  if (setLname)   setLname.value   = PROFILE.lastName;
  if (setBio)     setBio.value     = PROFILE.bio;
  if (setWebsite) setWebsite.value = PROFILE.website;
}

/* Toggle profile inline edit mode */
function toggleProfileEdit(on) {
  const viewEl = document.getElementById('profile-view-mode');
  const editEl = document.getElementById('profile-edit-mode');
  if (!viewEl || !editEl) return;

  if (on) {
    document.getElementById('edit-profile-fname').value   = PROFILE.firstName;
    document.getElementById('edit-profile-lname').value   = PROFILE.lastName;
    document.getElementById('edit-profile-bio').value     = PROFILE.bio;
    document.getElementById('edit-profile-website').value = PROFILE.website;
    viewEl.style.display = 'none';
    editEl.style.display = 'block';
    document.getElementById('edit-profile-fname').focus();
  } else {
    viewEl.style.display = '';
    editEl.style.display = 'none';
  }
}

/* Save profile edits and propagate everywhere */
function saveProfile() {
  const fname = document.getElementById('edit-profile-fname').value.trim();
  const lname = document.getElementById('edit-profile-lname').value.trim();
  const bio   = document.getElementById('edit-profile-bio').value.trim();
  const web   = document.getElementById('edit-profile-website').value.trim();

  if (!fname) { showToast('First name cannot be empty.'); return; }

  PROFILE.firstName = fname;
  PROFILE.lastName  = lname;
  PROFILE.bio       = bio;
  PROFILE.website   = web;

  updateProfileUI();
  toggleProfileEdit(false);
  showToast('Profile updated successfully!');
}

/* ── SOCIAL LINKS ────────────────────────────────────────── */
function renderSocialLinks() {
  const container = document.getElementById('social-links-list');
  if (!container) return;

  if (socialLinks.length === 0) {
    container.innerHTML = '<p style="font-size:12px;color:var(--text-muted);padding:6px 2px">No social accounts linked yet — add one below.</p>';
    return;
  }

  container.innerHTML = socialLinks.map((link, idx) => {
    const p = SOCIAL_PLATFORMS[link.platform] || SOCIAL_PLATFORMS.website;
    return `
      <div class="social-link-item">
        <div class="social-link-icon" style="background:${p.bg};color:${p.color}">
          <i class="ti ${p.icon}"></i>
        </div>
        <span class="social-link-label">${p.label}</span>
        <span class="social-link-url" title="${link.url}" onclick="showToast('Opening: ${link.url}')">${link.url}</span>
        <button class="btn-icon sm" title="Remove" style="color:var(--danger);border-color:rgba(239,68,68,.3)" onclick="removeSocialLink(${idx})">
          <i class="ti ti-trash"></i>
        </button>
      </div>`;
  }).join('');
}

function addSocialLink() {
  const platform = document.getElementById('social-platform-select').value;
  const url      = document.getElementById('social-url-input').value.trim();
  const p        = SOCIAL_PLATFORMS[platform] || SOCIAL_PLATFORMS.website;

  if (!url) { showToast('Please enter the URL for this platform.'); return; }
  if (!url.startsWith('http')) { showToast('URL must start with https://'); return; }
  if (socialLinks.some(l => l.platform === platform)) {
    showToast(`${p.label} is already linked. Remove it first to update.`);
    return;
  }

  socialLinks.push({ platform, url });
  document.getElementById('social-url-input').value = '';
  renderSocialLinks();
  showToast(`${p.label} added!`);
}

function removeSocialLink(idx) {
  const p = SOCIAL_PLATFORMS[socialLinks[idx]?.platform] || {};
  socialLinks.splice(idx, 1);
  renderSocialLinks();
  showToast(`${p.label || 'Link'} removed.`);
}

/* ── INTEGRATIONS ────────────────────────────────────────── */
const INTEGRATIONS = [
  { id: 'linkedin',  name: 'LinkedIn',    icon: 'ti-brand-linkedin',  bg: '#0077b5',                                                                               handle: '@alexrahman',      connected: true  },
  { id: 'instagram', name: 'Instagram',   icon: 'ti-brand-instagram', bg: 'radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285AEB 90%)',   handle: '@alex.ai.trainer', connected: true  },
  { id: 'youtube',   name: 'YouTube',     icon: 'ti-brand-youtube',   bg: '#ff0000',                                                                               handle: 'Alex AI Channel',  connected: true  },
  { id: 'twitter',   name: 'X (Twitter)', icon: 'ti-brand-x',         bg: '#1a1a2e',                                                                               handle: '',                 connected: false },
  { id: 'paypal',    name: 'PayPal',      icon: 'ti-brand-paypal',    bg: '#00457c',                                                                               handle: 'alex@paypal.my',   connected: true  },
  { id: 'stripe',    name: 'Stripe',      icon: 'ti-credit-card',     bg: '#6772e5',                                                                               handle: '',                 connected: false },
];

let editingIntegrationId = null;

function renderIntegrations() {
  const grid = document.getElementById('integrations-grid');
  if (!grid) return;

  grid.innerHTML = INTEGRATIONS.map(intg => {
    const isEditing = editingIntegrationId === intg.id;

    if (isEditing) {
      return `
        <div class="integration-item intg-editing">
          <div class="integration-logo" style="background:${intg.bg}"><i class="ti ${intg.icon}"></i></div>
          <div class="integration-info" style="flex:1;min-width:0">
            <div class="integration-name">${intg.name}</div>
            <input class="intg-handle-input" id="intg-input-${intg.id}"
              value="${escapeHtml(intg.handle)}"
              placeholder="Enter username, handle or email"
              onkeydown="handleIntgKey(event,'${intg.id}')">
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0">
            <button class="btn-primary sm" onclick="saveIntegration('${intg.id}')">
              <i class="ti ti-check"></i> Save
            </button>
            <button class="btn-outline sm" onclick="cancelIntgEdit()">Cancel</button>
          </div>
        </div>`;
    }

    if (intg.connected) {
      return `
        <div class="integration-item">
          <div class="integration-logo" style="background:${intg.bg}"><i class="ti ${intg.icon}"></i></div>
          <div class="integration-info">
            <div class="integration-name">${intg.name}</div>
            <div class="integration-status connected">
              <i class="ti ti-circle-check" style="font-size:10px;margin-right:3px"></i>Connected
              <span class="intg-handle-chip" onclick="startIntgEdit('${intg.id}')" title="Click to edit">
                · ${escapeHtml(intg.handle)} <i class="ti ti-pencil intg-pencil"></i>
              </span>
            </div>
          </div>
          <button class="btn-outline" style="font-size:.8rem;" onclick="disconnectIntegration('${intg.id}')">Disconnect</button>
        </div>`;
    }

    return `
      <div class="integration-item intg-disconnected">
        <div class="integration-logo intg-logo-dim" style="background:${intg.bg}"><i class="ti ${intg.icon}"></i></div>
        <div class="integration-info">
          <div class="integration-name">${intg.name}</div>
          <div class="integration-status disconnected">Not connected</div>
        </div>
        <button class="btn-primary" style="font-size:.8rem;" onclick="startIntgEdit('${intg.id}')">Connect</button>
      </div>`;
  }).join('');
}

function startIntgEdit(id) {
  editingIntegrationId = id;
  renderIntegrations();
  setTimeout(() => {
    const input = document.getElementById(`intg-input-${id}`);
    if (input) { input.focus(); input.select(); }
  }, 30);
}

function cancelIntgEdit() {
  editingIntegrationId = null;
  renderIntegrations();
}

function saveIntegration(id) {
  const input = document.getElementById(`intg-input-${id}`);
  if (!input) return;
  const handle = input.value.trim();
  if (!handle) { showToast('Please enter a username, handle or email.'); input.focus(); return; }

  const intg = INTEGRATIONS.find(i => i.id === id);
  if (!intg) return;
  const wasConnected = intg.connected;
  intg.handle    = handle;
  intg.connected = true;
  editingIntegrationId = null;
  renderIntegrations();
  showToast(`${intg.name} ${wasConnected ? 'updated' : 'connected'} successfully!`);
}

function handleIntgKey(e, id) {
  if (e.key === 'Enter')  saveIntegration(id);
  if (e.key === 'Escape') cancelIntgEdit();
}

function disconnectIntegration(id) {
  const intg = INTEGRATIONS.find(i => i.id === id);
  if (!intg) return;
  intg.connected = false;
  intg.handle    = '';
  renderIntegrations();
  showToast(`${intg.name} disconnected.`);
}

/* ── PASSWORD TOGGLE (login) ─────────────────────────────── */
function togglePasswordVisibility() {
  const input = document.getElementById('login-password');
  const icon  = document.getElementById('pwd-toggle-icon');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'ti ti-eye-off';
  } else {
    input.type = 'password';
    icon.className = 'ti ti-eye';
  }
}

/* ── SCREEN NAVIGATION ─────────────────────────────────── */
const PAGE_TITLES = {
  dashboard:  'Dashboard',
  profile:    'AI Trainer Profile',
  courses:    'Course Marketplace',
  marketing:  'AI Marketing Studio',
  automation: 'AI Automation Workflow',
  payment:    'AI Payment Agent',
  settings:   'Settings'
};

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const screen = document.getElementById('screen-' + name);
  if (screen) screen.classList.add('active');

  const navItem = document.querySelector('.nav-item[data-screen="' + name + '"]');
  if (navItem) navItem.classList.add('active');

  const title = document.getElementById('page-title');
  if (title) title.textContent = PAGE_TITLES[name] || name;
}

/* ── LOGIN / LOGOUT ────────────────────────────────────── */
function startApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  showScreen('dashboard');
}

function signOut() {
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}

/* ── TOAST ─────────────────────────────────────────────── */
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  msgEl.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
}

function copyOutput() {
  const text = document.getElementById('ai-output-text').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('Caption copied to clipboard!'));
  } else {
    showToast('Caption copied to clipboard!');
  }
}

/* ── AI CONTENT GENERATOR ──────────────────────────────── */
const AI_TEMPLATES = {
  linkedin: [
    `🚀 Excited to announce: {topic} is now LIVE!\n\nAfter months of crafting, my course is packed with:\n✅ Practical, hands-on projects\n✅ Real-world AI applications\n✅ Step-by-step video walkthroughs\n\nJoin {students}+ learners already transforming their careers with AI.\n\nLink in first comment 👇\n\n#AI #MachineLearning #{hashtag} #GigAI #AITrainer`,
    `💡 Want to future-proof your career with AI?\n\nMy new course — {topic} — is designed for professionals who want RESULTS, not theory.\n\n🎯 {duration} of focused content\n📹 Video lessons you can rewatch anytime\n🏆 Certificate upon completion\n\n{students}+ students. 4.8★ average rating.\n\nDM me "AI" to get started. 🤖\n\n#AISkills #PromptEngineering #FutureOfWork`,
  ],
  instagram: [
    `Level up your AI game ✨\n\n{topic} is HERE! 🎓\n\nWhat you'll master:\n🧠 Core AI concepts that actually matter\n⚡ Speed up your workflow by 10×\n💰 Turn AI skills into income\n\n{students}+ learners can't be wrong!\n\nLink in bio 🔗\n\n#{hashtag} #AI #OnlineLearning #AITrainer #GigAI #LearnAI`,
    `Your AI journey starts NOW 🚀\n\n{topic} — my most comprehensive course yet!\n\n💡 No experience needed\n🎯 Job-ready skills in {duration}\n🏆 Certificate included\n\nLimited spots available!\n\nTap link in bio to enroll 👆\n\n#AILearning #{hashtag} #SkillUp #FutureReady #GigAIPro`,
  ],
  email: [
    `Subject: 🎓 {topic} is now available — special launch price!\n\nHi [First Name],\n\nI'm thrilled to announce that {topic} is officially LIVE!\n\nHere's what you'll get:\n• {duration} of comprehensive, project-based content\n• Certificate of completion\n• Lifetime access to all future updates\n• Direct Q&A with me during live sessions\n\nAs a valued subscriber, you get 20% off for the next 48 hours.\n\nEnroll now → [Course Link]\n\nLet's build your AI future together,\nAlex Rahman\nAI Trainer · GigAI Pro`,
  ],
  youtube: [
    `🎯 {topic} — Complete Guide for Beginners to Advanced\n\nIn this comprehensive course, I'll take you from zero to proficient in {topic}. Whether you're a complete beginner or looking to level up your existing AI skills, this course has everything you need.\n\n📚 What you'll learn:\n• Fundamentals and core concepts\n• Real-world applications and case studies\n• Hands-on projects you can add to your portfolio\n• Industry best practices used by top AI professionals\n\n🏆 Course stats: {students}+ enrolled · 4.8★ rating · {duration} of content\n\n⏱️ TIMESTAMPS:\n0:00 — Introduction\n5:30 — Core concepts\n20:00 — First project\n...\n\n🔗 Enroll now: [Link]\n\n#AI #{hashtag} #OnlineLearning #AITrainer #MachineLearning`,
  ]
};

const HASHTAG_MAP = {
  'Prompt Engineering 101':      'PromptEngineering',
  'LangChain Mastery':           'LangChain',
  'AI Tools Bootcamp':           'AITools',
  'ML Foundations with Python':  'MachineLearning',
  'RAG Systems Deep Dive':       'RAG',
  'AI for Data Analysts':        'DataScience',
};

function generateContent() {
  const type    = document.getElementById('content-type').value;
  const topic   = document.getElementById('content-topic').value || 'AI Course';
  const hashtag = HASHTAG_MAP[topic] || topic.replace(/\s+/g, '');

  const templates = AI_TEMPLATES[type] || AI_TEMPLATES.linkedin;
  const template  = templates[Math.floor(Math.random() * templates.length)];

  const output = template
    .replace(/{topic}/g,    topic)
    .replace(/{students}/g, String(Math.floor(Math.random() * 100 + 200)))
    .replace(/{hashtag}/g,  hashtag)
    .replace(/{duration}/g, '3–6 hrs');

  const el = document.getElementById('ai-output-text');
  el.textContent = '';

  // Typewriter effect
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += output[i];
    i++;
    if (i >= output.length) clearInterval(interval);
  }, 12);
}

/* ── COURSE FILTERING ──────────────────────────────────── */
function filterCategory(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.course-card').forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterCourses() {
  const query = document.getElementById('course-search').value.toLowerCase();
  document.querySelectorAll('.course-card').forEach(card => {
    const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
    card.style.display = title.includes(query) ? '' : 'none';
  });
}

/* ── AI CHATBOT ─────────────────────────────────────────── */
const BOT_RESPONSES = {
  default: "I'm here to help! Feel free to ask me about your courses, progress, or anything else.",
  module:  "Modules unlock progressively as you complete each one. Check your progress bar on the course page!",
  payment: "For payment issues, please visit the AI Payment section or email support@gigaipro.my.",
  certificate: "Certificates are issued automatically upon 100% course completion. Check your profile page!",
  refund:  "Our refund policy allows refunds within 7 days of purchase. Contact us at support@gigaipro.my.",
  enroll:  "To enroll, simply click 'Enroll now' on any course in the Marketplace. Payment is processed instantly!",
  hello:   "Hello! 👋 I'm GigBot, your AI learning assistant. How can I help you today?",
  hi:      "Hi there! 👋 What can I help you with?",
  progress: "You can track your progress on each course's dashboard. You're doing great — keep going! 🚀",
  pricing:  "We offer Basic (RM 39/mo), Pro (RM 89/mo), and Enterprise (RM 299/mo) plans. The Pro plan is most popular!",
};

function getBotResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('hello') || m.includes('hey'))    return BOT_RESPONSES.hello;
  if (m.includes('hi'))                            return BOT_RESPONSES.hi;
  if (m.includes('module') || m.includes('access')) return BOT_RESPONSES.module;
  if (m.includes('payment') || m.includes('pay'))  return BOT_RESPONSES.payment;
  if (m.includes('certificate') || m.includes('cert')) return BOT_RESPONSES.certificate;
  if (m.includes('refund'))                        return BOT_RESPONSES.refund;
  if (m.includes('enroll') || m.includes('join'))  return BOT_RESPONSES.enroll;
  if (m.includes('progress'))                      return BOT_RESPONSES.progress;
  if (m.includes('price') || m.includes('plan') || m.includes('subscription')) return BOT_RESPONSES.pricing;
  return BOT_RESPONSES.default;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const msg   = input.value.trim();
  if (!msg) return;

  const window = document.getElementById('chatbot-window');

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user-msg';
  userMsg.innerHTML = `
    <div class="chat-bubble user-bubble">${escapeHtml(msg)}</div>
    <div class="chat-avatar user-avatar">U</div>
  `;
  window.appendChild(userMsg);

  input.value = '';
  window.scrollTop = window.scrollHeight;

  // Bot response after short delay
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot-msg';
    botMsg.innerHTML = `
      <div class="chat-avatar bot-avatar"><i class="ti ti-robot"></i></div>
      <div class="chat-bubble bot-bubble">${getBotResponse(msg)}</div>
    `;
    window.appendChild(botMsg);
    window.scrollTop = window.scrollHeight;
  }, 600);
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── TAGLINE SELECTOR ──────────────────────────────────── */
document.addEventListener('click', function(e) {
  const item = e.target.closest('.tagline-item');
  if (item) {
    item.closest('.tagline-list')?.querySelectorAll('.tagline-item').forEach(i => {
      i.classList.remove('selected');
      i.querySelector('.ti').className = 'ti ti-circle';
    });
    item.classList.add('selected');
    item.querySelector('.ti').className = 'ti ti-check-circle';
    showToast('Tagline selected and applied to your profile!');
  }
});

/* ── KEYBOARD SHORTCUT ──────────────────────────────────── */
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
    const keys = { '1':'dashboard','2':'profile','3':'courses','4':'marketing','5':'automation','6':'payment','7':'settings' };
    if (keys[e.key]) { e.preventDefault(); showScreen(keys[e.key]); }
  }
});

/* ── SETTINGS ───────────────────────────────────────────── */
function saveSettings(section) {
  if (section === 'profile') {
    const fname = document.getElementById('set-fname')?.value.trim();
    const lname = document.getElementById('set-lname')?.value.trim();
    const bio   = document.getElementById('set-bio')?.value.trim();
    const web   = document.getElementById('set-website')?.value.trim();
    if (fname) PROFILE.firstName = fname;
    if (lname !== undefined) PROFILE.lastName = lname;
    if (bio   !== undefined) PROFILE.bio      = bio;
    if (web   !== undefined) PROFILE.website  = web;
    updateProfileUI();
  }
  const labels = { profile: 'Profile updated successfully!', password: 'Password changed successfully!' };
  showToast(labels[section] || 'Settings saved!');
}

function toggleNotif(checkbox, key) {
  const label = { enrolments:'Enrolment', reviews:'Review', payments:'Payment',
    marketing:'Marketing report', updates:'Platform update', sms:'SMS', '2fa':'Two-Factor Auth' }[key] || key;
  showToast(`${label} notifications ${checkbox.checked ? 'enabled' : 'disabled'}.`);
}

function previewAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const wrap = document.getElementById('settings-avatar-preview');
    wrap.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
  };
  reader.readAsDataURL(file);
  showToast('Profile photo updated!');
}

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  // Enter key on login
  document.querySelectorAll('.login-card input').forEach(input => {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') startApp();
    });
  });

  // Render social links list in profile screen
  renderSocialLinks();

  // Render integrations grid in settings screen
  renderIntegrations();

  // Sync profile to all UI elements on load
  updateProfileUI();
});
