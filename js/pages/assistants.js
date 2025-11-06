import { el } from '../ui.js';

export default function renderAssistants(root) {
  root.innerHTML = '';
  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '실행 지원') ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        el('div', { class: 'card' }, [ el('div', { class: 'title' }, 'AI 컨설팅'), el('div', { class: 'muted small' }, '전략적 관점에서 조직 역량 개발 방향 제시') ]),
        el('div', { class: 'card' }, [ el('div', { class: 'title' }, 'AI 코칭'), el('div', { class: 'muted small' }, '질문과 대화를 통한 자기주도적 역량 개발') ]),
        el('div', { class: 'card' }, [ el('div', { class: 'title' }, 'AI 멘토링'), el('div', { class: 'muted small' }, '경험 공유와 실무 조언으로 성장 가속화') ])
      ]),
      el('div', { class: 'space' }),
      el('div', { class: 'card' }, [ el('div', {}, 'AI 어시스턴트'), el('div', { class: 'muted small' }, '온라인'), el('div', { class: 'space' }), el('input', { class: 'input', placeholder: '대화를 시작하세요' }), el('div', { class: 'space' }), el('button', { class: 'button primary' }, '전송') ])
    ])
  ]));
}

