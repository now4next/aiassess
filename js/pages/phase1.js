import API from '../api.js';
import State from '../state.js';
import { el, toast, spinner } from '../ui.js';

export default function renderPhase1(root) {
  root.innerHTML = '';

  const keywordInput = el('input', { class: 'input', placeholder: '역량 키워드로 검색하세요', value: '' });
  const searchBtn = el('button', { class: 'button primary' }, '검색');
  const resultWrap = el('div');
  const selectedWrap = el('div');

  function renderSelected() {
    selectedWrap.innerHTML = '';
    if (!State.s.selectedGroups.length) {
      selectedWrap.appendChild(el('div', { class: 'helper-text' }, '선택된 역량이 없습니다. 직무 추천 역량 또는 검색을 통해 역량을 추가하세요.'));
      return;
    }
    const pills = State.s.selectedGroups.map(g => el('span', { class: 'pill' }, [
      g.name,
      el('span', { class: 'remove', onclick: () => { State.removeGroup(g.id); renderSelected(); } }, '×')
    ]));
    selectedWrap.appendChild(el('div', { class: 'tag-list' }, pills));
  }

  async function doSearch() {
    const keywordRaw = keywordInput.value.trim();
    if (!keywordRaw) {
      toast('검색 키워드를 입력하세요');
      return;
    }
    const keyword = keywordRaw.toLowerCase();

    resultWrap.innerHTML = '';
    resultWrap.appendChild(spinner());
    try {
      const res = await API.searchDiagnosisGroups({ keyword: keywordRaw, page: 1, limit: 15 });
      const groups = (res?.data || res?.results || res || []).filter(Boolean);

      const matchedGroups = [];
      for (const g of groups) {
        const matchInfo = { ...g };
        const name = (g.name || g.title || '').toString();
        const definition = (g.definition || g.description || '').toString();
        let isMatched = false;

        if (name.toLowerCase().includes(keyword) || definition.toLowerCase().includes(keyword)) {
          isMatched = true;
        }

        let matchedIndicators = [];
        if (!isMatched) {
          try {
            const itemRes = await API.listAssessmentItemsByGroup(g.id, { type: 'behavioral_indicator' });
            const items = Array.isArray(itemRes) ? itemRes : (itemRes?.data || itemRes?.results || itemRes?.items || itemRes?.data?.items || []);
            matchedIndicators = (items || []).filter(it => (it.item_text || '').toLowerCase().includes(keyword));
            if (matchedIndicators.length) isMatched = true;
          } catch (err) {
            // ignore fetch errors for matching purposes
          }
        }

        if (isMatched) {
          if (matchedIndicators.length) {
            matchInfo._matchedIndicators = matchedIndicators.slice(0, 5).map(it => it.item_text);
          }
          matchedGroups.push(matchInfo);
        }
      }

      resultWrap.innerHTML = '';
      if (!matchedGroups.length) {
        resultWrap.appendChild(el('div', { class: 'empty-state' }, '검색 결과가 없습니다. 역량명, 정의, 행동지표를 다시 확인해 보세요.'));
        return;
      }

      const listItems = matchedGroups.map(g => {
        const metaParts = [
          (g.category ? `카테고리: ${g.category}` : ''),
          (g.job_name ? ` · 직무: ${g.job_name}` : '')
        ].filter(Boolean);

        const indicatorChips = g._matchedIndicators?.length ? el('div', { class: 'job-competencies search-matches' }, g._matchedIndicators.map(txt => el('span', { class: 'job-competency-chip' }, txt))) : null;

        return el('div', { class: 'list-item' }, [
          el('div', {}, [
            el('div', { class: 'title' }, g.name || g.title || `그룹 #${g.id}`),
            metaParts.length ? el('div', { class: 'meta' }, metaParts.join('')) : null,
            g.definition ? el('div', { class: 'helper-text' }, g.definition) : null,
            indicatorChips
          ].filter(Boolean)),
          el('div', {}, [
            el('button', { class: 'button', onclick: () => { State.addGroup(g); renderSelected(); toast('추가되었습니다'); } }, '선택')
          ])
        ]);
      });

      resultWrap.appendChild(el('div', { class: 'list' }, listItems));
    } catch (e) {
      resultWrap.innerHTML = '';
      resultWrap.appendChild(el('div', { class: 'empty-state' }, `검색 중 문제가 발생했습니다. ${e.message}`));
    }
  }

  if (State.s.selectedJob) {
    const job = State.s.selectedJob;
    const jobListWrap = el('div');

    root.appendChild(el('section', { class: 'section' }, [
      el('div', { class: 'section-header' }, [
        el('div', { class: 'section-heading' }, [
          el('span', { class: 'section-eyebrow' }, '추천 역량'),
          el('h2', { class: 'section-title' }, '직무와 연결된 역량'),
          el('p', { class: 'section-subtitle' }, '선택한 직무에 매핑된 핵심 역량을 빠르게 추가하세요. 행동지표까지 자동 연동됩니다.')
        ])
      ]),
      el('div', { class: 'section-body' }, [
        el('div', { class: 'helper-text' }, `현재 선택한 직무: ${job.name}`),
        jobListWrap
      ])
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
        jobListWrap.appendChild(items.length ? el('div', { class: 'list' }, items) : el('div', { class: 'empty-state' }, '연결된 역량이 없습니다. 검색을 통해 직접 선택해 보세요.'));
      } catch (e) {
        jobListWrap.innerHTML = '';
        jobListWrap.appendChild(el('div', { class: 'empty-state' }, `역량 목록을 불러오지 못했습니다. ${e.message}`));
      }
    })();
  }

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Phase 1'),
        el('h2', { class: 'section-title' }, '역량 키워드 검색 및 선택'),
        el('p', { class: 'section-subtitle' }, '직무와 무관하게 필요한 역량을 직접 검색하여 진단 항목을 확장하세요.')
      ])
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'input-group' }, [ keywordInput, searchBtn ]),
      el('div', {}, [ el('div', { class: 'muted small' }, '선택된 역량'), selectedWrap ]),
      el('div', {}, [ el('div', { class: 'muted small' }, '검색 결과'), resultWrap ]),
      el('div', { class: 'section-footer' }, [
        el('a', { href: '#/diagnose', class: 'button primary' }, '선택한 역량으로 진단하기')
      ])
    ])
  ]));

  renderSelected();
  searchBtn.addEventListener('click', doSearch);
  keywordInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      doSearch();
    }
  });
}

