import API from '../api.js';
import { el, toast } from '../ui.js';

export function renderLogin(root, onSuccess) {
  root.innerHTML = '';
  const emailI = el('input', { class: 'input', placeholder: '이메일', type: 'email' });
  const pwI = el('input', { class: 'input', placeholder: '비밀번호', type: 'password' });
  const btn = el('button', { class: 'button primary' }, '로그인');
  btn.addEventListener('click', async () => {
    try {
      await API.login(emailI.value.trim(), pwI.value);
      toast('로그인 성공');
      onSuccess?.();
    } catch (e) { toast(`실패: ${e.message}`); }
  });
  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '로그인') ]),
    el('div', { class: 'section-body' }, [ emailI, el('div', { class: 'space' }), pwI, el('div', { class: 'space' }), btn ])
  ]));
}

export function renderRegister(root, onSuccess) {
  root.innerHTML = '';
  const nameI = el('input', { class: 'input', placeholder: '이름' });
  const emailI = el('input', { class: 'input', placeholder: '이메일', type: 'email' });
  const pwI = el('input', { class: 'input', placeholder: '비밀번호', type: 'password' });
  const phoneI = el('input', { class: 'input', placeholder: '전화번호 (선택)' });
  const btn = el('button', { class: 'button primary' }, '회원가입');
  btn.addEventListener('click', async () => {
    try {
      await API.register(nameI.value.trim(), emailI.value.trim(), pwI.value, phoneI.value.trim());
      toast('가입 성공');
      onSuccess?.();
    } catch (e) { toast(`실패: ${e.message}`); }
  });
  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '회원가입') ]),
    el('div', { class: 'section-body' }, [ nameI, el('div', { class: 'space' }), emailI, el('div', { class: 'space' }), pwI, el('div', { class: 'space' }), phoneI, el('div', { class: 'space' }), btn ])
  ]));
}

