const State = (() => {
  const s = {
    user: null,
    selectedJob: null,
    selectedGroups: [],
    settings: {
      respondent: { name: '', email: '', dept: '', title: '' },
      scale: { type: '5', labels: {} },
      display: { perPage: 3 }
    },
    responses: {}
  };

  function setUser(user) { s.user = user; }
  function setSelectedJob(job) { s.selectedJob = job; }
  function addGroup(group) {
    if (!s.selectedGroups.some(g => g.id === group.id)) s.selectedGroups.push(group);
  }
  function removeGroup(id) {
    s.selectedGroups = s.selectedGroups.filter(g => g.id !== id);
  }
  function clearGroups() { s.selectedGroups = []; }

  function setResponse(itemId, value) { s.responses[itemId] = value; }

  function clearResponses() { s.responses = {}; }

  return { s, setUser, setSelectedJob, addGroup, removeGroup, clearGroups, clearResponses, setResponse };
})();

export default State;

