import API from '../api.js';
import { el, spinner } from '../ui.js';

export default async function renderResults(root) {
  root.innerHTML = '';
  const listWrap = el('div');
  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Results'),
        el('h2', { class: 'section-title' }, '응답자 목록과 진단지 현황'),
        el('p', { class: 'section-subtitle' }, '생성된 진단지와 응답 상태를 확인하고, 후속 조치를 계획하세요.')
      ])
    ]),
    el('div', { class: 'section-body' }, [ listWrap ])
  ]));

  listWrap.appendChild(spinner());
  try {
    const res = await API.listDiagnosisSheets();
    listWrap.innerHTML = '';
    const items = (res?.data || res || []).map(x => el('div', { class: 'list-item' }, [
      el('div', {}, [
        el('div', { class: 'title' }, x.title || `진단지 #${x.id}`),
        el('div', { class: 'meta' }, (x.created_at || '').replace('T', ' ').slice(0, 19))
      ]),
      el('div', {}, el('span', { class: 'pill' }, x.status || 'draft'))
    ]));
    listWrap.appendChild(items.length ? el('div', { class: 'list' }, items) : el('div', { class: 'empty-state' }, '아직 생성된 진단지가 없습니다. Phase 2에서 진단지를 만들어보세요.'));
  } catch (e) {
    listWrap.innerHTML = '';
    listWrap.appendChild(el('div', { class: 'empty-state' }, `결과를 불러오지 못했습니다. ${e.message}`));
  }
}

