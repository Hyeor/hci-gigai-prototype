/* ═══════════════════════════════════════════════════════════════
   GigAI Pro — Application Logic
   HCI Task 2 Prototype · BAXU 2313
═══════════════════════════════════════════════════════════════ */

/* ── SCREEN NAVIGATION ─────────────────────────────────── */
const PAGE_TITLES = {
  dashboard:  'Dashboard',
  profile:    'AI Trainer Profile',
  courses:    'Course Marketplace',
  marketing:  'AI Marketing Studio',
  automation: 'AI Automation Workflow',
  payment:    'AI Payment Agent'
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
    const keys = { '1':'dashboard','2':'profile','3':'courses','4':'marketing','5':'automation','6':'payment' };
    if (keys[e.key]) { e.preventDefault(); showScreen(keys[e.key]); }
  }
});

/* ── INIT ───────────────────────────────────────────────── */
// Allow pressing Enter on login inputs
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.login-card input').forEach(input => {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') startApp();
    });
  });
});
