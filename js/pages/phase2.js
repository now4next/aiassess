import API from '../api.js';
import State from '../state.js';
import { el, toast } from '../ui.js';

export default function renderPhase2(root) {
  root.innerHTML = '';

  const r = State.s.settings.respondent;
  const scale = State.s.settings.scale;
  const display = State.s.settings.display;

  const nameI = el('input', { class: 'input', placeholder: '이름 (필수)', value: r.name });
  const emailI = el('input', { class: 'input', placeholder: '이메일 (필수)', value: r.email });
  const deptI = el('input', { class: 'input', placeholder: '부서', value: r.dept });
  const titleI = el('input', { class: 'input', placeholder: '직급', value: r.title });

  const scaleSelect = el('select', { class: 'select' }, [
    el('option', { value: '1' }, '1점 (O, X)'),
    el('option', { value: '3' }, '3점 척도'),
    el('option', { value: '5' }, '5점 척도'),
    el('option', { value: '6' }, '6점 척도'),
    el('option', { value: '7' }, '7점 척도'),
    el('option', { value: '10' }, '10점 척도')
  ]);
  scaleSelect.value = scale.type;

  const scaleMeaningInput = el('input', { class: 'input', placeholder: '각 척도 숫자에 대한 설명 (선택)' });
  if (scale.labels?.note) scaleMeaningInput.value = scale.labels.note;

  const perPageSelect = el('select', { class: 'select' }, [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9999].map(n => el('option', { value: String(n) }, n === 9999 ? '전체 보기' : `한 화면에 ${n}개`))
  ]);
  perPageSelect.value = String(display.perPage);

  const createBtn = el('button', { class: 'button primary' }, 'AI로 진단지 구성하기');

  createBtn.addEventListener('click', async () => {
    r.name = nameI.value.trim();
    r.email = emailI.value.trim();
    r.dept = deptI.value.trim();
    r.title = titleI.value.trim();
    scale.type = scaleSelect.value;
    scale.labels.note = scaleMeaningInput.value.trim();
    display.perPage = Number(perPageSelect.value);
    if (!r.name || !r.email) { toast('이름과 이메일은 필수 입력 항목입니다.'); return; }
    if (!State.s.selectedGroups.length) { toast('선택된 역량이 없습니다. Phase 1에서 역량을 선택하세요.'); return; }
    try {
      const title = `진단지 - ${new Date().toLocaleString()}`;
      const group_ids = State.s.selectedGroups.map(g => g.id);
      await API.createDiagnosisSheet({ title, description: '', group_ids });
      toast('진단지가 생성되었습니다');
      location.hash = '#/results';
    } catch (e) {
      toast(`생성 실패: ${e.message}`);
    }
  });

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Step 1'),
        el('h2', { class: 'section-title' }, '응답자 정보 입력'),
        el('p', { class: 'section-subtitle' }, '진단 대상자의 기본 정보를 입력하면 개인화된 진단 링크가 생성됩니다.')
      ])
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-2' }, [ nameI, emailI ]),
      el('div', { class: 'grid cols-2' }, [ deptI, titleI ]),
      el('div', { class: 'helper-text' }, '메일 정보는 진단 링크 전달과 결과 공유에 활용됩니다.')
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Step 2'),
        el('h2', { class: 'section-title' }, '응답 척도 설정'),
        el('p', { class: 'section-subtitle' }, '진단 목적에 맞는 척도를 선택하고 각 점수의 의미를 정의하세요.')
      ])
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-2' }, [
        scaleSelect,
        scaleMeaningInput
      ]),
      el('div', { class: 'helper-text' }, '예: 1점 - 개선 필요, 3점 - 기대 수준, 5점 - 뛰어남')
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Step 3'),
        el('h2', { class: 'section-title' }, '진단 문항 디스플레이 설정'),
        el('p', { class: 'section-subtitle' }, '응답자의 집중도를 고려해 한 화면에 표시할 문항 수를 조절하세요.')
      ])
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-2' }, [
        perPageSelect,
        el('div', { class: 'helper-text' }, '문항이 많은 경우 “전체 보기” 대신 3~5개 단위로 나누어 표시하는 것을 추천합니다.')
      ]),
      el('div', { class: 'section-footer' }, [ createBtn ])
    ])
  ]));
}

