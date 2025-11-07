import API from '../api.js';
import State from '../state.js';
import { el, spinner, toast } from '../ui.js';

export default async function renderDiagnose(root) {
  root.innerHTML = '';
  if (!State.s.selectedGroups.length) {
    root.appendChild(el('div', { class: 'empty-state' }, '선택된 역량이 없습니다. Phase 1에서 진단에 사용할 역량을 선택한 뒤 다시 시도하세요.'));
    return;
  }

  // Always show all items from all selected groups per user request
  const perPage = 9999;
  const scaleType = Number(State.s.settings.scale.type || '5');
  const scaleNote = State.s.settings.scale.labels?.note || '';

  const itemsWrap = el('div');
  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Diagnosis'),
        el('h2', { class: 'section-title' }, '선택한 역량으로 진단하기'),
        el('p', { class: 'section-subtitle' }, '각 행동지표별로 응답 척도를 선택해 현재 역량 수준을 평가하세요.')
      ])
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'helper-text' }, scaleNote ? `척도 안내: ${scaleNote}` : `현재 설정된 척도는 ${scaleType}점 척도입니다.`),
      itemsWrap
    ])
  ]));

  itemsWrap.appendChild(spinner());

  try {
    // Fetch items for all selected groups
    const allItems = [];
    for (const g of State.s.selectedGroups) {
      try {
        const groupType = (g.group_type || g.type || '').toString();
        const itemType = groupType === 'diagnosis_group' ? 'diagnosis_item' : 'behavioral_indicator';
        const r = await API.listAssessmentItemsByGroup(g.id, { type: itemType });
        let items = [];
        if (Array.isArray(r)) items = r;
        else if (Array.isArray(r?.data)) items = r.data;
        else if (Array.isArray(r?.results)) items = r.results;
        else if (Array.isArray(r?.data?.items)) items = r.data.items;
        else if (Array.isArray(r?.items)) items = r.items;
        else {
          console.warn(`Group ${g.id} returned non-array:`, r);
          continue;
        }
        const groupItems = items.map(x => ({ ...x, group: g }));
        allItems.push(...groupItems);
      } catch (e) {
        console.error(`Failed to fetch items for group ${g.id}:`, e);
        toast(`그룹 "${g.name || g.id}"의 아이템 조회 실패: ${e.message}`);
      }
    }

    itemsWrap.innerHTML = '';
    if (!allItems.length) {
      itemsWrap.appendChild(el('div', { class: 'muted' }, '표시할 진단 문항이 없습니다.'));
      return;
    }

    const pagedItems = perPage >= 9999 ? allItems : allItems.slice(0, perPage);

    const questions = pagedItems.map(item => renderQuestion(item, scaleType));
    itemsWrap.appendChild(el('div', { class: 'list' }, questions));

    itemsWrap.appendChild(el('div', { class: 'section-footer' }, [
      el('button', { class: 'button primary', onclick: () => toast('응답이 임시 저장되었습니다') }, '임시 저장')
    ]));
  } catch (e) {
    itemsWrap.innerHTML = '';
    itemsWrap.appendChild(el('div', { class: 'empty-state' }, `진단 문항을 불러오지 못했습니다. ${e.message}`));
  }
}

function renderQuestion(item, scaleType) {
  const title = item.item_text || item.question || `문항 #${item.id}`;
  const groupName = item.group?.name || item.group_name || '';
  const current = State.s.responses[item.id] ?? null;

  const scaleRow = el('div', { class: 'row wrap', style: 'gap:8px; justify-content:flex-end;' });
  for (let i = 1; i <= (Number.isFinite(scaleType) ? scaleType : 5); i++) {
    const label = String(i);
    const input = el('input', { type: 'radio', name: `q_${item.id}`, value: String(i), style: 'display:none;' });
    if (String(current) === String(i)) input.checked = true;
    input.addEventListener('change', () => State.setResponse(item.id, i));
    const chip = el('label', { class: 'tab', style: 'display:inline-flex; align-items:center; gap:6px;' }, [ input, el('span', {}, label) ]);
    scaleRow.appendChild(chip);
  }

  return el('div', { class: 'list-item' }, [
    el('div', {}, [ el('div', { class: 'title' }, title), el('div', { class: 'meta' }, groupName) ]),
    el('div', {}, scaleRow)
  ]);
}

