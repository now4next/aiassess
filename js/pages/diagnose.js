import API from '../api.js';
import State from '../state.js';
import { el, spinner, toast } from '../ui.js';

export default async function renderDiagnose(root) {
  root.innerHTML = '';
  if (!State.s.selectedGroups.length) {
    root.appendChild(el('div', { class: 'muted' }, '선택된 역량이 없습니다. 먼저 역량을 선택하세요.'));
    return;
  }

  // Always show all items from all selected groups per user request
  const perPage = 9999;
  const scaleType = Number(State.s.settings.scale.type || '5');

  const itemsWrap = el('div');
  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [ el('h2', {}, '역량 진단하기') ]),
    el('div', { class: 'section-body' }, [ itemsWrap ])
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

    itemsWrap.appendChild(el('div', { class: 'space' }));
    itemsWrap.appendChild(el('div', { class: 'row' }, [
      el('button', { class: 'button primary', onclick: () => toast('응답이 임시 저장되었습니다') }, '임시 저장')
    ]));
  } catch (e) {
    itemsWrap.innerHTML = '';
    itemsWrap.appendChild(el('div', { class: 'muted' }, `오류: ${e.message}`));
  }
}

function renderQuestion(item, scaleType) {
  const title = item.item_text || item.question || `문항 #${item.id}`;
  const groupName = item.group?.name || item.group_name || '';
  const current = State.s.responses[item.id] ?? null;

  const scaleRow = el('div', { class: 'row wrap' });
  for (let i = 1; i <= (Number.isFinite(scaleType) ? scaleType : 5); i++) {
    const label = String(i);
    const input = el('input', { type: 'radio', name: `q_${item.id}`, value: String(i) });
    if (String(current) === String(i)) input.checked = true;
    input.addEventListener('change', () => State.setResponse(item.id, i));
    const chip = el('label', { class: 'tab' }, [ input, el('span', { style: 'margin-left:6px;' }, label) ]);
    scaleRow.appendChild(chip);
  }

  return el('div', { class: 'list-item' }, [
    el('div', {}, [ el('div', { class: 'title' }, title), el('div', { class: 'meta' }, groupName) ]),
    el('div', {}, scaleRow)
  ]);
}

