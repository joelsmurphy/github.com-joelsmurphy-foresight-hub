import { DatorArchetype, ChangeScope, LeaderRole } from '@/types';

export const ARCHETYPE_META: Record<DatorArchetype, {
  label: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}> = {
  growth: {
    label: 'Growth',
    description: 'Current systems continue, adapt, and flourish. Challenges are met with innovation and resilience.',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.2)',
  },
  collapse: {
    label: 'Collapse',
    description: 'Current systems break down. Institutions fragment, fail, or dissolve under accumulated pressure.',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
  },
  discipline: {
    label: 'Discipline',
    description: 'A forcing constraint reshapes all choices — scarcity, crisis, or new regulation demands simplification.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  transformation: {
    label: 'Transformation',
    description: 'Fundamental value and paradigm shift. The church becomes almost unrecognizable — but may be more alive.',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.2)',
  },
};

export const TONE_META: Record<string, { label: string; color: string }> = {
  hopeful:    { label: 'Hopeful',    color: '#22c55e' },
  tense:      { label: 'Tense',      color: '#ef4444' },
  ambiguous:  { label: 'Ambiguous',  color: '#94a3b8' },
  urgent:     { label: 'Urgent',     color: '#f59e0b' },
  surprising: { label: 'Surprising', color: '#a855f7' },
};

export const SCOPE_LABELS: Record<ChangeScope, string> = {
  local:     'Your congregation / institution',
  regional:  'Regional church landscape',
  national:  'National church landscape',
  ecclesial: 'The global church',
  global:    'Society and world',
};

export const DISRUPTION_LABELS: Record<number, string> = {
  1: 'Gentle drift',
  2: 'Moderate shift',
  3: 'Significant disruption',
  4: 'Substantial rupture',
  5: 'Fundamental transformation',
};

export const SPEED_LABELS: Record<number, string> = {
  1: 'Generational (25–40 years)',
  2: 'Long arc (15–25 years)',
  3: 'Medium term (10–15 years)',
  4: 'Within a decade',
  5: 'Rapid (2–5 years)',
};

export const ROLE_SCENARIO_CONFIG: Record<LeaderRole, {
  narrativeVoice: string;
  primarySpheres: string[];
  foregroundQuestions: string[];
  implKey: 'pastor' | 'educator' | 'organizational';
}> = {
  pastor: {
    narrativeVoice: 'Speak to a pastor leading a local congregation. Use congregational language. Reference preaching, discipleship, pastoral care, belonging, community formation, and personal calling.',
    primarySpheres: ['Congregational life', 'Preaching', 'Pastoral care', 'Community formation', 'Leadership sustainability'],
    foregroundQuestions: [
      'What does pastoral authority look like in this future?',
      'How do people belong and form faith in this world?',
      'What is personally asked of the pastor as shepherd?',
    ],
    implKey: 'pastor',
  },
  denominational: {
    narrativeVoice: 'Speak to a Christian organizational leader — denomination, para-church, or mission agency. Reference strategy, governance, funding, partnerships, mission alignment, and systemic change.',
    primarySpheres: ['Organizational strategy', 'Governance', 'Funding and stewardship', 'Mission alignment', 'Leadership pipeline'],
    foregroundQuestions: [
      'What does this organization exist to do in this future?',
      'Which structures become liabilities, and which become assets?',
      'Who are your partners, and do they still share your mission?',
    ],
    implKey: 'organizational',
  },
  educator: {
    narrativeVoice: 'Speak to a theological educator at a seminary, Bible college, or training institution. Reference curriculum, pedagogy, formation, institutional viability, scholarship, and ordination pipelines.',
    primarySpheres: ['Curriculum design', 'Institutional viability', 'Student formation', 'Pedagogical models', 'Research and scholarship'],
    foregroundQuestions: [
      'What knowledge and formation does ministry require in this future?',
      'Can this institution survive — and should it?',
      'Who is the student of theology in this world?',
    ],
    implKey: 'educator',
  },
  member: {
    narrativeVoice: 'Speak to a congregation member navigating faith, work, family, and community. Reference daily rhythms, belonging, vocation, and personal discipleship.',
    primarySpheres: ['Faith formation', 'Community and belonging', 'Vocation and work', 'Family and household', 'Civic engagement'],
    foregroundQuestions: [
      'What does belonging look like in this future?',
      'How does faith sustain ordinary life?',
      'Where do you find community?',
    ],
    implKey: 'pastor', // members see pastor implications as most relevant
  },
};
