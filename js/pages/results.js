import API from '../api.js';
import { el, spinner } from '../ui.js';

export default async function renderResults(root) {
  root.innerHTML = '';
  const listWrap = el('div');
  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '응답자 목록') ]),
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
      el('div', { class: 'muted small' }, x.status || 'draft')
    ]));
    listWrap.appendChild(items.length ? el('div', { class: 'list' }, items) : el('div', { class: 'muted' }, '목록이 없습니다'));
  } catch (e) {
    listWrap.innerHTML = '';
    listWrap.appendChild(el('div', { class: 'muted' }, `오류: ${e.message}`));
  }
}

