import { Signal } from '@/types';

// Sample signals — replace or extend with your own dataset.
// x_position: 0–100 (left = emerging, right = structural)
// y_position: 0–100 (higher = greater impact/adoption)

export const SAMPLE_SIGNALS: Signal[] = [
  {
    id: 'sig-001',
    title: 'AI-Generated Pastoral Content',
    description:
      'AI tools can now produce sermons, liturgies, theological reflections, and pastoral letters indistinguishable from human authorship. Faith communities are beginning to encounter AI-written spiritual content without knowing it.',
    sources: [
      'Pew Research Center — AI and Religion 2024',
      'Christianity Today — "The AI Sermon Problem"',
    ],
    disruption_level: 'transformative',
    maturity_stage: 'scaling',
    zone: 'reactive',
    x_position: 36,
    y_position: 40,
    domain: 'Technology / Ministry',
    time_horizon: '3–7 years',
    confidence_level: 'High',
    date_observed: '2024',
    notes:
      'Raises urgent questions about authenticity, authority, and what it means to "speak" in the Spirit.',
  },
  {
    id: 'sig-002',
    title: 'Post-Institutional Spirituality',
    description:
      'Growing numbers of self-identifying Christians organize their spiritual lives entirely outside denominational structures — via apps, podcasts, online communities, and informal gatherings — without any connection to a local congregation.',
    sources: [
      'Barna Group — "Spiritual But Not Churched" 2023',
      'Ryan Burge, The Nones (Fortress Press, 2021)',
    ],
    disruption_level: 'transformative',
    maturity_stage: 'scaling',
    zone: 'reactive',
    x_position: 42,
    y_position: 48,
    domain: 'Ecclesiology / Culture',
    time_horizon: '3–7 years',
    confidence_level: 'High',
    date_observed: '2023',
    related_signals: ['sig-005'],
    notes:
      'Not just declining attendance — a structural shift in how people understand Christian community.',
  },
  {
    id: 'sig-003',
    title: 'Mental Health Crisis in Congregations',
    description:
      'Rates of anxiety, depression, loneliness, and trauma exposure have reached historic highs across all demographics. Congregations are fielding pastoral care requests that exceed the capacity of existing structures and the training of most clergy.',
    sources: [
      'American Psychological Association — Stress in America 2023',
      'Flourishing in Ministry Project, Notre Dame',
    ],
    disruption_level: 'substantive',
    maturity_stage: 'established',
    zone: 'active',
    x_position: 63,
    y_position: 68,
    domain: 'Pastoral Care / Public Health',
    time_horizon: '7–15 years',
    confidence_level: 'Very High',
    date_observed: '2023',
    related_signals: ['sig-010'],
  },
  {
    id: 'sig-004',
    title: 'Hybrid Work Reshaping Community Rhythms',
    description:
      'Remote and hybrid work patterns have permanently altered when, where, and how people have social bandwidth for community participation. Sunday morning is no longer the obvious gathering window for a growing share of the workforce.',
    sources: [
      'Statistics Canada — Labour Force Survey 2024',
      'McKinsey Global Institute — Future of Work 2023',
    ],
    disruption_level: 'incremental',
    maturity_stage: 'established',
    zone: 'active',
    x_position: 58,
    y_position: 64,
    domain: 'Work / Culture',
    time_horizon: '7–15 years',
    confidence_level: 'High',
    date_observed: '2023',
  },
  {
    id: 'sig-005',
    title: 'GenZ Faith Deconstruction Wave',
    description:
      'A significant and visible cohort of young adults raised in Christian contexts are publicly deconstructing or departing from institutional Christianity. This is not simply teen attrition — it is a sustained cultural phenomenon reshaping religious identity formation.',
    sources: [
      'Barna Research — Gen Z and Faith 2022',
      'Chrissy Stroop, "Leaving the Faith" podcast',
    ],
    disruption_level: 'substantive',
    maturity_stage: 'scaling',
    zone: 'reactive',
    x_position: 46,
    y_position: 52,
    domain: 'Discipleship / Culture',
    time_horizon: '3–7 years',
    confidence_level: 'High',
    date_observed: '2024',
    related_signals: ['sig-002'],
    notes:
      'Deconstruction content on social media has become a significant cultural force, especially on TikTok and YouTube.',
  },
  {
    id: 'sig-006',
    title: 'Climate Grief as Pastoral Need',
    description:
      'Environmental distress — eco-anxiety, grief over ecological loss, despair about the future — is emerging as a distinct and growing spiritual and pastoral care need, especially among younger generations.',
    sources: [
      'The Lancet — Climate Anxiety Study 2021',
      'Green Faith — Faith Community Responses to Climate Grief 2023',
    ],
    disruption_level: 'substantive',
    maturity_stage: 'emerging',
    zone: 'innovation',
    x_position: 16,
    y_position: 20,
    domain: 'Creation Care / Pastoral Care',
    time_horizon: '0–3 years',
    confidence_level: 'Medium',
    date_observed: '2023',
    notes:
      'Still emerging as a named pastoral category — most congregations have not yet developed language or practices to address it.',
  },
  {
    id: 'sig-007',
    title: 'Digital Worship as Permanent Dimension',
    description:
      'Congregations that built digital worship capacity during COVID have discovered that online participation is not a temporary substitute but a permanent and valued mode of ecclesial engagement for a significant portion of their community.',
    sources: [
      'Hartford Institute for Religion Research — Pandemic Survey 2022',
      'Faith Communities Today — Post-COVID Church Report 2023',
    ],
    disruption_level: 'incremental',
    maturity_stage: 'established',
    zone: 'active',
    x_position: 70,
    y_position: 74,
    domain: 'Worship / Technology',
    time_horizon: '7–15 years',
    confidence_level: 'Very High',
    date_observed: '2023',
  },
  {
    id: 'sig-008',
    title: 'Digital Giving and Stewardship Shift',
    description:
      'Traditional plate-and-envelope giving is being replaced by digital tithing apps, text giving, cryptocurrency donations, and giving-circle models, requiring denominations and congregations to fundamentally rethink stewardship culture and infrastructure.',
    sources: [
      'Giving USA — Annual Report 2023',
      'Pushpay — Church Giving Trends Report 2024',
    ],
    disruption_level: 'incremental',
    maturity_stage: 'scaling',
    zone: 'reactive',
    x_position: 50,
    y_position: 54,
    domain: 'Stewardship / Technology',
    time_horizon: '3–7 years',
    confidence_level: 'High',
    date_observed: '2023',
  },
  {
    id: 'sig-009',
    title: 'Seminary Enrollment Collapse',
    description:
      'Seminary enrollment has declined by 20–40% across North America over the past decade, threatening the institutional viability of many schools and exposing fragilities in conventional ordination pipelines.',
    sources: [
      'Association of Theological Schools — Data Trends 2023',
      'Christianity Today — "The Seminary Crisis" 2024',
    ],
    disruption_level: 'substantive',
    maturity_stage: 'established',
    zone: 'active',
    x_position: 67,
    y_position: 70,
    domain: 'Theological Education / Institution',
    time_horizon: '7–15 years',
    confidence_level: 'Very High',
    date_observed: '2024',
    related_signals: ['sig-005'],
  },
  {
    id: 'sig-010',
    title: 'Loneliness Epidemic — Public Recognition',
    description:
      'Governments and health authorities in Canada, the US, and the UK have formally declared loneliness a public health crisis. This opens new social legitimacy and partnership opportunity for the church\'s historic role in community formation and belonging.',
    sources: [
      'US Surgeon General — Our Epidemic of Loneliness 2023',
      'Canadian Mental Health Association — Loneliness Report 2024',
    ],
    disruption_level: 'substantive',
    maturity_stage: 'structural',
    zone: 'action',
    x_position: 82,
    y_position: 83,
    domain: 'Public Health / Community',
    time_horizon: '15+ years',
    confidence_level: 'Very High',
    date_observed: '2023',
    related_signals: ['sig-003'],
    notes:
      'A rare signal that creates *opportunity* rather than threat — the church has something real to offer.',
  },
  {
    id: 'sig-011',
    title: 'Intergenerational Wealth Transfer',
    description:
      'The largest wealth transfer in history is underway as Baby Boomers pass assets to younger generations. Charities, denominations, and congregations that cultivate relationships with this cohort now will shape philanthropic flows for decades.',
    sources: [
      'Cerulli Associates — The Great Wealth Transfer 2023',
      'Charitable Giving in Canada — Philanthropic Foundations Report 2024',
    ],
    disruption_level: 'incremental',
    maturity_stage: 'structural',
    zone: 'action',
    x_position: 87,
    y_position: 86,
    domain: 'Stewardship / Demographics',
    time_horizon: '15+ years',
    confidence_level: 'Very High',
    date_observed: '2023',
  },
  {
    id: 'sig-012',
    title: 'Indigenous Reconciliation Imperative',
    description:
      'The Truth and Reconciliation Commission\'s Calls to Action are generating sustained pressure on Canadian churches to address historic harms, restructure relationships with Indigenous communities, and examine inherited theological frameworks.',
    sources: [
      'Truth and Reconciliation Commission of Canada — Final Report',
      'Canadian Council of Churches — Reconciliation Working Group 2023',
    ],
    disruption_level: 'transformative',
    maturity_stage: 'established',
    zone: 'active',
    x_position: 61,
    y_position: 62,
    domain: 'Justice / Theology',
    time_horizon: '7–15 years',
    confidence_level: 'Very High',
    date_observed: '2023',
    notes:
      'Not a passing trend — a long-term structural renegotiation of the church\'s role in Canadian society.',
  },
  {
    id: 'sig-013',
    title: 'Distributed and Lay-Led Ministry Models',
    description:
      'Resource constraints, pastoral burnout, and shifting ecclesiological imagination are driving experimentation with distributed, team-based, and lay-led ministry models that deprioritize the solo professional pastor.',
    sources: [
      'Leadership Network — Future of Ministry 2023',
      'Forge Canada — Missional Church Report 2024',
    ],
    disruption_level: 'substantive',
    maturity_stage: 'emerging',
    zone: 'innovation',
    x_position: 22,
    y_position: 26,
    domain: 'Ecclesiology / Leadership',
    time_horizon: '0–3 years',
    confidence_level: 'Medium',
    date_observed: '2024',
    related_signals: ['sig-009'],
  },
  {
    id: 'sig-014',
    title: 'Attention Economy and Fragmented Discipleship',
    description:
      'The attention economy — driven by social media algorithms, short-form video, and infinite content — is fundamentally reshaping how people learn, form beliefs, and sustain commitments, making long-arc discipleship increasingly difficult.',
    sources: [
      'Jonathan Haidt, The Anxious Generation (2024)',
      'Common Sense Media — Screen Time and Faith 2023',
    ],
    disruption_level: 'transformative',
    maturity_stage: 'scaling',
    zone: 'reactive',
    x_position: 40,
    y_position: 43,
    domain: 'Discipleship / Culture',
    time_horizon: '3–7 years',
    confidence_level: 'High',
    date_observed: '2024',
    related_signals: ['sig-005'],
    notes:
      'The medium is reshaping the message in ways the church has barely begun to reckon with.',
  },
  {
    id: 'sig-015',
    title: 'Pastoral Burnout and Clergy Exodus',
    description:
      'A significant wave of clergy burnout, moral failure, and early retirement is depleting denominational leadership capacity. Many pastors are leaving parish ministry in their 40s, citing unrealistic expectations, poor support structures, and loss of meaning.',
    sources: [
      'Barna — The State of Pastors 2022',
      'Flourishing in Ministry Project — Clergy Wellbeing Report 2023',
    ],
    disruption_level: 'substantive',
    maturity_stage: 'established',
    zone: 'active',
    x_position: 73,
    y_position: 76,
    domain: 'Leadership / Wellbeing',
    time_horizon: '7–15 years',
    confidence_level: 'Very High',
    date_observed: '2023',
    related_signals: ['sig-009', 'sig-013'],
    notes:
      'The pipeline problem and the retention problem are compounding each other in dangerous ways.',
  },
];

export const CONTEXT_QUESTIONS = {
  pastor: [
    {
      id: 'setting',
      label: 'What type of setting do you serve in?',
      type: 'select' as const,
      options: ['Urban', 'Suburban', 'Small town', 'Rural', 'Multi-site'],
    },
    {
      id: 'size',
      label: 'Approximate congregation size?',
      type: 'select' as const,
      options: ['Under 50', '50–150', '150–400', '400–1000', 'Over 1000'],
    },
    {
      id: 'challenge',
      label: 'What is your most pressing ministry challenge right now?',
      type: 'text' as const,
      placeholder: 'e.g. declining attendance, staff transitions, community engagement…',
    },
  ],
  denominational: [
    {
      id: 'org_type',
      label: 'What type of organization do you lead?',
      type: 'select' as const,
      options: [
        'Denomination / judicatory',
        'Para-church ministry',
        'Mission agency',
        'Christian non-profit',
        'Church planting network',
      ],
    },
    {
      id: 'scale',
      label: 'Geographic scope of your organization?',
      type: 'select' as const,
      options: ['Local / regional', 'National', 'International'],
    },
    {
      id: 'challenge',
      label: 'What is your most significant strategic challenge right now?',
      type: 'text' as const,
      placeholder: 'e.g. financial sustainability, leadership pipeline, relevance…',
    },
  ],
  educator: [
    {
      id: 'institution',
      label: 'What type of institution do you work in?',
      type: 'select' as const,
      options: [
        'Seminary / divinity school',
        'Bible college',
        'Christian university',
        'Lay training program',
        'Online theological education',
      ],
    },
    {
      id: 'tradition',
      label: 'What theological tradition do you represent?',
      type: 'text' as const,
      placeholder: 'e.g. Reformed, Anabaptist, Anglican, Pentecostal…',
    },
    {
      id: 'challenge',
      label: 'What is the most significant challenge facing theological education in your context?',
      type: 'text' as const,
      placeholder: 'e.g. enrolment, funding, relevance, hybrid delivery…',
    },
  ],
  member: [
    {
      id: 'life_stage',
      label: 'What is your current life stage?',
      type: 'select' as const,
      options: [
        'Student',
        'Young adult (20s)',
        'Parent with young children',
        'Mid-career adult',
        'Empty nester',
        'Senior',
      ],
    },
    {
      id: 'engagement',
      label: 'How would you describe your engagement with your faith community?',
      type: 'select' as const,
      options: ['Very active', 'Regularly attending', 'Occasional', 'Exploring / returning'],
    },
    {
      id: 'context',
      label: 'What context shapes your daily life most?',
      type: 'text' as const,
      placeholder: 'e.g. tech sector, healthcare, parenting, caregiving, education…',
    },
  ],
};

export const ROLE_LABELS: Record<string, string> = {
  pastor: 'Pastor',
  denominational: 'Denominational / Christian Organization Leader',
  educator: 'Theological Educator',
  member: 'Congregation Member',
};

export const SPHERES: Record<string, string[]> = {
  pastor: [
    'Congregational life and formation',
    'Preaching and communication',
    'Pastoral care and presence',
    'Community and neighbourhood engagement',
    'Leadership and personal sustainability',
  ],
  denominational: [
    'Organizational strategy and governance',
    'Resource allocation and stewardship',
    'Interchurch and ecumenical relations',
    'Cultural voice and public engagement',
    'Leadership pipeline and vocation',
  ],
  educator: [
    'Curriculum and pedagogical design',
    'Institutional viability and models',
    'Research and theological scholarship',
    'Student formation and mentorship',
    'Contextual and global perspectives',
  ],
  member: [
    'Faith formation and discipleship',
    'Vocation and work',
    'Family and household life',
    'Community and civic participation',
    'Belonging and spiritual community',
  ],
};
