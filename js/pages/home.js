import { el, spinner, toast } from '../ui.js';
import API from '../api.js';
import State from '../state.js';

export default function renderHome(root) {
  root.innerHTML = '';

  const createFeatureCard = (icon, title, desc) => el('div', { class: 'card feature-card' }, [
    el('div', { class: 'card-icon' }, icon),
    el('div', { class: 'card-title' }, title),
    el('p', { class: 'card-text' }, desc)
  ]);

  const heroMetrics = [
    { value: '4단계', label: 'Phase 기반 진단 워크플로' },
    { value: 'AI 문항', label: '직무-역량에 맞춘 자동 생성' },
    { value: '24/7 지원', label: 'AI 어시스턴트와 실시간 상담' }
  ];

  root.appendChild(el('section', { class: 'hero' }, [
    el('div', { class: 'hero-content' }, [
      el('span', { class: 'hero-eyebrow' }, 'AI 기반 역량 진단'),
      el('h1', {}, '조직의 핵심 역량을 빠르게 분석하는 AI 진단 플랫폼'),
      el('p', {}, '직무별 추천 역량과 행동지표를 불러오고 AI가 생성한 문항으로 진단 설계와 실행을 한 번에 진행하세요.'),
      el('div', { class: 'hero-actions' }, [
        el('a', { href: '#/phase-1', class: 'button primary' }, '진단 설계 시작'),
        el('a', { href: '#/results', class: 'button ghost' }, '결과 분석 보기')
      ]),
      el('div', { class: 'hero-metrics' }, heroMetrics.map(m => el('div', { class: 'metric-card' }, [
        el('div', { class: 'metric-value' }, m.value),
        el('div', { class: 'metric-label' }, m.label)
      ])))
    ]),
    el('div', { class: 'hero-visual' }, [
      el('div', { class: 'hero-visual-pattern' }, [
        'Phase 1 → Phase 2 → 결과 분석 → 실행 지원',
        el('strong', {}, 'AI 기반 자동화'),
        '직무 연계 역량과 행동지표를 한 번에 연결'
      ])
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Start Here'),
        el('h2', { class: 'section-title' }, '직무 선택'),
        el('p', { class: 'section-subtitle' }, '직무에 최적화된 역량과 행동지표를 추천받고 진단 설계를 시작하세요.')
      ]),
      el('a', { href: '#/phase-1', class: 'button ghost' }, '건너뛰기')
    ]),
    el('div', { class: 'section-body' }, [
      (() => {
        const wrap = el('div');
        wrap.appendChild(spinner());
        (async () => {
          try {
            const res = await API.listJobs();
            const jobs = res?.data || res || [];
            wrap.innerHTML = '';
            if (!jobs.length) {
              wrap.appendChild(el('div', { class: 'empty-state' }, '등록된 직무가 없습니다. 먼저 직무를 생성해 주세요.'));
              return;
            }
            const cards = jobs.map(j => {
              const competencyInfo = el('div', { class: 'job-competencies muted small' }, '역량을 불러오는 중...');

              const card = el('div', {
                class: 'card job-card',
                onclick: () => {
                  State.setSelectedJob(j);
                  State.clearGroups();
                  State.clearResponses();
                  toast(`${j.name} 선택됨`);
                  location.hash = '#/phase-1';
                },
                style: 'cursor:pointer;'
              }, [
                el('div', { class: 'card-title' }, j.name || `직무 #${j.id}`),
                competencyInfo
              ]);

              (async () => {
                try {
                  const res = await API.listAssessmentGroupsByJob(j.id, { type: 'competency' });
                  const groups = (res?.data || res || []).filter(g => g && g.name);
                  competencyInfo.innerHTML = '';
                  if (groups.length) {
                    const names = groups.map(g => g.name.trim()).filter(Boolean);
                    const maxVisible = 5;
                    names.slice(0, maxVisible).forEach(name => {
                      competencyInfo.appendChild(el('span', { class: 'job-competency-chip' }, name));
                    });
                    const moreCount = names.length - Math.min(names.length, maxVisible);
                    if (moreCount > 0) {
                      competencyInfo.appendChild(el('span', { class: 'job-competency-chip more' }, `외 ${moreCount}개`));
                    }
                    if (!competencyInfo.children.length) {
                      competencyInfo.textContent = '역량 정보 없음';
                    }
                  } else {
                    competencyInfo.textContent = '역량 정보 없음';
                  }
                } catch (err) {
                  competencyInfo.textContent = '역량 정보를 불러오지 못했습니다';
                }
              })();

              return card;
            });
            wrap.appendChild(el('div', { class: 'grid cols-3' }, cards));
          } catch (e) {
            wrap.innerHTML = '';
            wrap.appendChild(el('div', { class: 'empty-state' }, `직무 목록을 불러오지 못했습니다. ${e.message}`));
          }
        })();
        return wrap;
      })()
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Phase 1'),
        el('h2', { class: 'section-title' }, '진단 설계'),
        el('p', { class: 'section-subtitle' }, '역량 키워드 검색과 AI 문항 생성으로 진단 설계를 자동화하세요.')
      ]),
      el('a', { href: '#/phase-1', class: 'button ghost' }, '바로가기')
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        createFeatureCard('🔍', '역량 키워드 검색', '직무와 맞는 역량을 빠르게 검색하고 건강한 역량 풀을 구성합니다.'),
        createFeatureCard('🤖', 'AI 문항 생성', '선택한 역량을 기반으로 AI가 행동지표와 진단 문항을 자동으로 제안합니다.'),
        createFeatureCard('📁', '선택 그룹 관리', '선택한 역량 그룹을 저장하고 재활용하며 조직의 표준을 유지합니다.')
      ])
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, 'Phase 2'),
        el('h2', { class: 'section-title' }, '진단 설정'),
        el('p', { class: 'section-subtitle' }, '응답자 정보, 척도, 디스플레이 옵션을 맞춤 설정하여 진단 경험을 구성하세요.')
      ]),
      el('a', { href: '#/phase-2', class: 'button ghost' }, '바로가기')
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        createFeatureCard('👤', '응답자 정보', '이름, 이메일, 부서 정보 등을 입력하여 개인화된 진단 링크를 구성합니다.'),
        createFeatureCard('📊', '응답 척도', '1점부터 10점까지 다양한 척도를 선택하고 각 단계의 의미를 정의합니다.'),
        createFeatureCard('🖥️', '디스플레이 옵션', '한 화면에 표시할 문항 수를 조절하여 사용자 경험을 최적화합니다.')
      ])
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, '결과 분석'),
        el('h2', { class: 'section-title' }, 'AI 인사이트 리포트'),
        el('p', { class: 'section-subtitle' }, '응답자의 점수 분포와 핵심 인사이트를 자동으로 시각화하고 리포트를 생성합니다.')
      ]),
      el('a', { href: '#/results', class: 'button ghost' }, '바로가기')
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        createFeatureCard('🧭', '응답자 추적', '진단 대상자별 진행 상황과 응답 현황을 실시간으로 확인합니다.'),
        createFeatureCard('📈', '점수 분석', '역량별, 행동지표별 점수 분포를 비교하여 조직의 강점과 보완점을 파악합니다.'),
        createFeatureCard('📝', '리포트 자동화', 'AI가 진단 결과 요약과 권장 액션을 제안하여 보고서를 자동 생성합니다.')
      ])
    ])
  ]));

  root.appendChild(el('section', { class: 'section' }, [
    el('div', { class: 'section-header' }, [
      el('div', { class: 'section-heading' }, [
        el('span', { class: 'section-eyebrow' }, '실행 지원'),
        el('h2', { class: 'section-title' }, 'AI 어시스턴트와 성장 여정'),
        el('p', { class: 'section-subtitle' }, '진단 이후의 실행까지 AI가 함께합니다. 원하는 어시스턴트를 선택해 맞춤형 지원을 받아보세요.')
      ]),
      el('a', { href: '#/assistants', class: 'button ghost' }, '어시스턴트 선택')
    ]),
    el('div', { class: 'section-body' }, [
      el('div', { class: 'grid cols-3' }, [
        createFeatureCard('🧠', 'AI 컨설팅', '조직 역량 개발 전략을 세우고 우선순위를 제안합니다.'),
        createFeatureCard('🗣️', 'AI 코칭', '대화형 질문으로 구성원의 자기 주도적 학습을 돕습니다.'),
        createFeatureCard('🤝', 'AI 멘토링', '현업 사례 기반의 조언과 실행 팁을 제공합니다.')
      ])
    ])
  ]));
}

