# AI Assess - Vanilla JS

A lightweight, vanilla JavaScript frontend replicating the design and flows of the AI 역량 진단 플랫폼.

- Design reference: https://aiassess.pages.dev/
- API server: https://aiassess-api.nowfornext.workers.dev/
- OpenAPI: https://aiassess-api.nowfornext.workers.dev/docs/openapi.json

## Project Structure

```
index.html
styles/
  main.css
js/
  config.js
  api.js
  state.js
  ui.js
  router.js
  app.js
  pages/
    home.js
    phase1.js
    phase2.js
    diagnose.js
    results.js
    assistants.js
    auth.js
```

## Running Locally

1) Start a static server in the project folder and open index.html:

```bash
# Python
python -m http.server 5173
# Node (http-server)
npx http-server -p 5173 --cors
```

Open http://localhost:5173/

## Configuration
- `js/config.js` contains API base URL and localStorage keys.

## Key Flows
- Home: select a job (`/api/jobs`) to drive relevant competencies
- Phase 1: search/select diagnosis groups and see job-linked competencies
- Phase 2: respondent info, scale, display settings; create diagnosis sheet
- Diagnose: render items per selected groups as questions
- Results: list diagnosis sheets (requires auth)
- Auth: login/register with JWT persisted in localStorage

## Deploying to GitHub
Initialize git and push to your empty GitHub repo (replace origin URL):

```bash
git init -b main
git add .
git commit -m "feat: initial vanilla JS app"
git remote add origin https://github.com/now4next/aiassess.git
git push -u origin main
```

If authentication is required, use GitHub CLI (`gh auth login`) or a Personal Access Token in the remote URL.

