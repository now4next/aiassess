import { el, spinner, toast } from '../ui.js';
import API from '../api.js';
import State from '../state.js';

export default function renderHome(root) {
  root.innerHTML = '';

  root.appendChild(el('section', { class: 'hero' }, [
    el('h1', {}, 'AI 역량 진단 플랫폼'),
    el('p', { class: 'muted' }, '진단 설계 · 결과 분석 · 실행 지원')
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('h2', {}, '직무 선택'),
      el('a', { href: '#/phase-1', class: 'button ghost' }, '건너뛰기')
    ]),
    el('div', { class: 'section-body' }, [
      (() => {
        const wrap = el('div');
        wrap.appendChild(spinner());
        (async () => {
          try {
            const res = await API.listJobs();
            const jobs = res?.data || res || [];
            wrap.innerHTML = '';
            if (!jobs.length) { wrap.appendChild(el('div', { class: 'muted' }, '등록된 직무가 없습니다')); return; }
            const cards = jobs.map(j => el('div', { class: 'card', onclick: () => { State.setSelectedJob(j); State.clearGroups(); State.clearResponses(); toast(`${j.name} 선택됨`); location.hash = '#/phase-1'; }, style: 'cursor:pointer;' }, [
              el('div', { class: 'title' }, j.name || `직무 #${j.id}`),
              el('div', { class: 'muted small' }, j.description || ''),
              el('div', { class: 'muted small' }, (typeof j.competency_count === 'number') ? `역량 ${j.competency_count}개` : '')
            ]));
            wrap.appendChild(el('div', { class: 'grid cols-3' }, cards));
          } catch (e) {
            wrap.innerHTML = '';
            wrap.appendChild(el('div', { class: 'muted' }, `오류: ${e.message}`));
          }
        })();
        return wrap;
      })()
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('h2', {}, 'Phase 1: 진단 설계'),
      el('a', { href: '#/phase-1', class: 'button ghost' }, '바로가기')
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        el('div', { class: 'card' }, [ el('div', { class: 'muted' }, '역량 키워드 검색 및 선택') ]),
        el('div', { class: 'card' }, [ el('div', { class: 'muted' }, 'AI 문항 생성') ]),
        el('div', { class: 'card' }, [ el('div', { class: 'muted' }, '선택한 그룹 관리') ])
      ])
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('h2', {}, 'Phase 2: 진단 설정'),
      el('a', { href: '#/phase-2', class: 'button ghost' }, '바로가기')
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        el('div', { class: 'card' }, [ el('div', { class: 'muted' }, '응답자 정보 입력') ]),
        el('div', { class: 'card' }, [ el('div', { class: 'muted' }, '응답 척도 설정') ]),
        el('div', { class: 'card' }, [ el('div', { class: 'muted' }, '문항 디스플레이 설정') ])
      ])
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('h2', {}, '결과 분석'),
      el('a', { href: '#/results', class: 'button ghost' }, '바로가기')
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'muted' }, '응답자 목록, 점수 분포, 인사이트')
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('h2', {}, '실행 지원'),
      el('a', { href: '#/assistants', class: 'button ghost' }, '바로가기')
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        el('div', { class: 'card' }, 'AI 컨설팅'),
        el('div', { class: 'card' }, 'AI 코칭'),
        el('div', { class: 'card' }, 'AI 멘토링')
      ])
    ])
  ]));
}

