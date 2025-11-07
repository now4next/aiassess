import { el } from '../ui.js';

export default function renderAssistants(root) {
  root.innerHTML = '';

  const createCard = (icon, title, desc) => el('div', { class: 'card' }, [
    el('div', { class: 'card-icon' }, icon),
    el('div', { class: 'card-title' }, title),
    el('p', { class: 'card-text' }, desc)
  ]);

  const chatInput = el('input', { class: 'input', placeholder: 'AI 어시스턴트에게 대화를 요청해보세요' });

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Execution'),
        el('h2', { class: 'section-title' }, '진단 이후 실행까지 AI가 함께합니다'),
        el('p', { class: 'section-subtitle' }, '전략, 코칭, 멘토링, 티칭까지 원하는 어시스턴트를 선택해 맞춤형 지원을 받아보세요.')
      ])
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        createCard('🧠', 'AI 컨설팅', '조직과 직무별 역량 전략을 수립하고 단계별 실행 로드맵을 제시합니다.'),
        createCard('🗣️', 'AI 코칭', '진단 결과를 기반으로 대화형 질문을 주고 스스로 해결책을 찾도록 돕습니다.'),
        createCard('🤝', 'AI 멘토링', '선배의 경험과 사례를 학습하고, 실무 중심의 인사이트를 제공합니다.')
      ]),
      el('div', { class: 'card' }, [
        el('div', { class: 'card-title' }, 'AI 어시스턴트 라이브 채널'),
        el('p', { class: 'card-text' }, '온라인 · 실시간 연결'),
        chatInput,
        el('div', { class: 'section-footer' }, [ el('button', { class: 'button primary' }, '전송') ])
      ])
    ])
  ]));
}

