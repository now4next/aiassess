export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    if (typeof c === 'string') node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  });
  return node;
}

export function toast(message) {
  const t = el('div', { class: 'toast' }, message);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

export function spinner() {
  const d = el('div', { class: 'muted small' }, '로딩 중...');
  return d;
}

