import Router from './router.js';
import API from './api.js';
import { el } from './ui.js';
import renderHome from './pages/home.js';
import renderPhase1 from './pages/phase1.js';
import renderPhase2 from './pages/phase2.js';
import renderResults from './pages/results.js';
import renderAssistants from './pages/assistants.js';
import { renderLogin, renderRegister } from './pages/auth.js';
import renderDiagnose from './pages/diagnose.js';

const root = document.getElementById('app');
const authArea = document.getElementById('auth-area');

function isAuthed() {
  try { return !!localStorage.getItem(window.APP_CONFIG.storage.tokenKey); } catch { return false; }
}

function renderAuthArea() {
  authArea.innerHTML = '';
  if (isAuthed()) {
    const logoutBtn = el('button', { class: 'button', onclick: () => { API.logout(); renderAuthArea(); location.hash = '#/'; } }, '로그아웃');
    authArea.appendChild(logoutBtn);
  } else {
    authArea.appendChild(el('a', { href: '#/login', class: 'button' }, '로그인'));
    authArea.appendChild(el('span', { style: 'width:8px;display:inline-block;' }));
    authArea.appendChild(el('a', { href: '#/register', class: 'button' }, '회원가입'));
  }
}

Router.add('/', async () => { renderAuthArea(); renderHome(root); });
Router.add('/phase-1', async () => { renderAuthArea(); renderPhase1(root); });
Router.add('/phase-2', async () => { renderAuthArea(); if (!isAuthed()) location.hash = '#/login'; else renderPhase2(root); });
Router.add('/results', async () => { renderAuthArea(); if (!isAuthed()) location.hash = '#/login'; else renderResults(root); });
Router.add('/assistants', async () => { renderAuthArea(); renderAssistants(root); });
Router.add('/diagnose', async () => { renderAuthArea(); renderDiagnose(root); });
Router.add('/login', async () => { renderAuthArea(); renderLogin(root, () => { renderAuthArea(); location.hash = '#/'; }); });
Router.add('/register', async () => { renderAuthArea(); renderRegister(root, () => { renderAuthArea(); location.hash = '#/'; }); });

Router.setNotFound(async () => {
  renderAuthArea();
  root.innerHTML = '<div class="muted">페이지를 찾을 수 없습니다</div>';
});

Router.start();

