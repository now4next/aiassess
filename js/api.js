const API = (() => {
  const base = window.APP_CONFIG.apiBaseUrl;
  const tKey = window.APP_CONFIG.storage.tokenKey;

  function getToken() {
    return localStorage.getItem(tKey) || '';
  }

  function setToken(token) {
    if (token) localStorage.setItem(tKey, token); else localStorage.removeItem(tKey);
  }

  async function request(path, { method = 'GET', body, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(base + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) {
      const message = data && (data.message || data.error) ? (data.message || data.error) : `HTTP ${res.status}`;
      throw new Error(message);
    }
    return data;
  }

  // Auth
  async function login(email, password) {
    const data = await request('/api/auth/login', { method: 'POST', body: { email, password } });
    const token = data?.data?.token;
    if (token) setToken(token);
    return data;
  }
  async function register(name, email, password, phone) {
    const data = await request('/api/auth/register', { method: 'POST', body: { name, email, password, phone } });
    const token = data?.data?.token;
    if (token) setToken(token);
    return data;
  }
  function logout() { setToken(''); }

  // Diagnosis Groups
  async function searchDiagnosisGroups({ keyword = '', category = '', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    return request('/api/diagnosis-groups/search' + (params.toString() ? `?${params.toString()}` : ''));
  }
  async function getDiagnosisGroup(id) {
    return request(`/api/diagnosis-groups/${id}`);
  }

  // Jobs
  async function listJobs() {
    return request('/api/jobs');
  }

  async function listAssessmentGroupsByJob(jobId, { type = 'competency' } = {}) {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    return request(`/api/assessments/jobs/${jobId}/groups` + (params.toString() ? `?${params.toString()}` : ''));
  }

  async function listAssessmentItemsByGroup(groupId, { type = 'behavioral_indicator' } = {}) {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    return request(`/api/assessments/groups/${groupId}/items` + (params.toString() ? `?${params.toString()}` : ''), { auth: true });
  }

  // Diagnosis Sheets
  async function listDiagnosisSheets({ status } = {}) {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    return request('/api/diagnosis-sheets' + (params.toString() ? `?${params.toString()}` : ''), { auth: true });
  }
  async function createDiagnosisSheet(payload) {
    return request('/api/diagnosis-sheets', { method: 'POST', body: payload, auth: true });
  }

  return {
    request,
    login, register, logout,
    listJobs, listAssessmentGroupsByJob, listAssessmentItemsByGroup,
    searchDiagnosisGroups, getDiagnosisGroup,
    listDiagnosisSheets, createDiagnosisSheet
  };
})();

export default API;

