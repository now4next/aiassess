import API from '../api.js';
import State from '../state.js';
import { el, toast, spinner } from '../ui.js';

export default function renderPhase1(root) {
  root.innerHTML = '';

  // If a job is selected, show linked competencies/groups
  if (State.s.selectedJob) {
    const job = State.s.selectedJob;
    const jobListWrap = el('div');
    const header = el('div', { class: 'row' }, [
      el('div', {}, `선택된 직무: ${job.name}`),
      el('div', { class: 'right muted small' }, '연결된 역량')
    ]);

    root.appendChild(el('section', { class: 'section' }, [
      el('div', { class: 'section-header' }, [ el('h2', {}, '직무와 연결된 역량') ]),
      el('div', { class: 'section-body' }, [ header, el('div', { class: 'space' }), jobListWrap ])
    ]));

    jobListWrap.appendChild(spinner());
    (async () => {
      try {
        const res = await API.listAssessmentGroupsByJob(job.id, { type: 'competency' });
        const items = (res?.data || res || []).map(g => el('div', { class: 'list-item' }, [
          el('div', {}, [
            el('div', { class: 'title' }, g.name || `역량 #${g.id}`),
            el('div', { class: 'meta' }, [
              (g.definition ? g.definition : ''),
              (g.job_name ? ` · 직무: ${g.job_name}` : '')
            ].filter(Boolean).join(''))
          ]),
          el('div', {}, [
            el('button', { class: 'button', onclick: () => { State.addGroup(g); renderSelected(); toast('추가되었습니다'); } }, '선택')
          ])
        ]));
        jobListWrap.innerHTML = '';
        jobListWrap.appendChild(items.length ? el('div', { class: 'list' }, items) : el('div', { class: 'muted' }, '연결된 역량이 없습니다'));
      } catch (e) {
        jobListWrap.innerHTML = '';
        jobListWrap.appendChild(el('div', { class: 'muted' }, `오류: ${e.message}`));
      }
    })();
  }

  const keywordInput = el('input', { class: 'input', placeholder: '역량을 검색하세요', value: '' });
  const searchBtn = el('button', { class: 'button', }, '검색');
  const resultWrap = el('div');
  const selectedWrap = el('div');

  function renderSelected() {
    selectedWrap.innerHTML = '';
    const pills = State.s.selectedGroups.map(g => el('span', { class: 'pill' }, [
      g.name,
      el('span', { class: 'remove', onclick: () => { State.removeGroup(g.id); renderSelected(); } }, '×')
    ]));
    selectedWrap.appendChild(el('div', { class: 'row wrap' }, pills));
  }

  async function doSearch() {
    resultWrap.innerHTML = '';
    resultWrap.appendChild(spinner());
    try {
      const res = await API.searchDiagnosisGroups({ keyword: keywordInput.value.trim(), page: 1, limit: 10 });
      resultWrap.innerHTML = '';
      const items = (res?.data || res?.results || res || []).map(g => el('div', { class: 'list-item' }, [
        el('div', {}, [
          el('div', { class: 'title' }, g.name || g.title || `그룹 #${g.id}`),
          el('div', { class: 'meta' }, [
            (g.category ? `카테고리: ${g.category}` : ''),
            (g.job_name ? ` · 직무: ${g.job_name}` : '')
          ].filter(Boolean).join(''))
        ]),
        el('div', {}, [
          el('button', { class: 'button', onclick: () => { State.addGroup(g); renderSelected(); toast('추가되었습니다'); } }, '선택')
        ])
      ]));
      if (!items.length) resultWrap.appendChild(el('div', { class: 'muted' }, '검색 결과가 없습니다'));
      else resultWrap.appendChild(el('div', { class: 'list' }, items));
    } catch (e) {
      resultWrap.innerHTML = '';
      resultWrap.appendChild(el('div', { class: 'muted' }, `오류: ${e.message}`));
    }
  }

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '역량 키워드 검색 및 선택') ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'row' }, [ keywordInput, searchBtn ]),
      el('div', { class: 'space' }),
      el('div', {}, [ el('div', { class: 'muted small' }, '선택된 역량'), selectedWrap ]),
      el('div', { class: 'space' }),
      el('div', {}, [ el('div', { class: 'muted small' }, '검색 결과'), resultWrap ]),
      el('div', { class: 'space' }),
      el('div', { class: 'row' }, [
        el('a', { href: '#/diagnose', class: 'button primary' }, '역량 진단하기')
      ])
    ])
  ]));

  renderSelected();
  searchBtn.addEventListener('click', doSearch);
}

