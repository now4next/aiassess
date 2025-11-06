import API from '../api.js';
import State from '../state.js';
import { el, toast } from '../ui.js';

export default function renderPhase2(root) {
  root.innerHTML = '';

  const r = State.s.settings.respondent;
  const scale = State.s.settings.scale;
  const display = State.s.settings.display;

  const nameI = el('input', { class: 'input', placeholder: '이름 *', value: r.name });
  const emailI = el('input', { class: 'input', placeholder: '이메일 *', value: r.email });
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
  const perPageSelect = el('select', { class: 'select' }, [
    ...[1,2,3,4,5,6,7,8,9,10,9999].map(n => el('option', { value: String(n) }, n === 9999 ? '전체' : `${n}개`))
  ]);
  perPageSelect.value = String(display.perPage);

  const createBtn = el('button', { class: 'button primary' }, '진단지 구성하기');

  createBtn.addEventListener('click', async () => {
    r.name = nameI.value.trim(); r.email = emailI.value.trim(); r.dept = deptI.value.trim(); r.title = titleI.value.trim();
    scale.type = scaleSelect.value; display.perPage = Number(perPageSelect.value);
    if (!r.name || !r.email) { toast('이름과 이메일을 입력하세요'); return; }
    if (!State.s.selectedGroups.length) { toast('선택된 역량 그룹이 없습니다'); return; }
    try {
      const title = `진단지 - ${new Date().toLocaleString()}`;
      const group_ids = State.s.selectedGroups.map(g => g.id);
      const res = await API.createDiagnosisSheet({ title, description: '', group_ids });
      toast('진단지가 생성되었습니다');
      location.hash = '#/results';
    } catch (e) {
      toast(`생성 실패: ${e.message}`);
    }
  });

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '1 응답자 정보 입력') ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-2' }, [ nameI, emailI ]),
      el('div', { class: 'space' }),
      el('div', { class: 'grid cols-2' }, [ deptI, titleI ])
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '2 응답 척도 설정') ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-2' }, [
        scaleSelect,
        el('input', { class: 'input', placeholder: '각 척도 숫자 의미 (선택사항)' })
      ])
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '3 진단 문항 디스플레이 설정') ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-2' }, [ perPageSelect, el('div') ]),
      el('div', { class: 'space' }),
      createBtn
    ])
  ]));
}

