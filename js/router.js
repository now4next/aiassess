const Router = (() => {
  const routes = new Map();
  let notFoundHandler = null;

  function add(path, handler) { routes.set(path, handler); }
  function setNotFound(handler) { notFoundHandler = handler; }

  async function navigate() {
    const hash = location.hash || '#/';
    const path = hash.replace(/^#/, '');
    const handler = routes.get(path);
    if (handler) await handler(); else if (notFoundHandler) await notFoundHandler();
  }

  function start() {
    window.addEventListener('hashchange', navigate);
    navigate();
  }

  return { add, setNotFound, start };
})();

export default Router;

