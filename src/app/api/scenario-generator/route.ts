import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScenarioInputs, Scenario } from '@/types';
import { SAMPLE_SIGNALS, ROLE_LABELS } from '@/data/signals';
import { ARCHETYPE_META, DISRUPTION_LABELS, SPEED_LABELS, SCOPE_LABELS, ROLE_SCENARIO_CONFIG } from '@/data/scenarioConfig';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function buildPrompt(inputs: ScenarioInputs): string {
  const roleLabel = ROLE_LABELS[inputs.role] || inputs.role;
  const roleConfig = ROLE_SCENARIO_CONFIG[inputs.role];

  const selectedSignalDetails = SAMPLE_SIGNALS
    .filter(s => inputs.selected_signals.includes(s.id))
    .map(s => `- ${s.title}: ${s.description}`)
    .join('\n');

  const customConcerns = inputs.custom_concerns.length > 0
    ? inputs.custom_concerns.map(c => `- ${c} (user-identified)`).join('\n')
    : '';

  const archetypeDescriptions = inputs.archetypes_enabled
    .map(a => `- ${ARCHETYPE_META[a].label}: ${ARCHETYPE_META[a].description}`)
    .join('\n');

  const contextStr = Object.entries(inputs.context)
    .filter(([, v]) => v)
    .map(([k, v]) => `  - ${k.replace(/_/g, ' ')}: ${v}`)
    .join('\n') || '  (no additional context provided)';

  const n = inputs.archetypes_enabled.length;

  return `You are a futures researcher and scenario planner specialising in Christian leadership, ecclesiology, and theological institution design. Your work draws on Dator's Four Futures framework, causal layered analysis, and rigorous scenario planning methodology.

## FUTURES PRINCIPLES YOU FOLLOW
- Always generate multiple, meaningfully distinct futures — never variations of the same story
- Every scenario contains at least one genuine surprise the user did not anticipate
- No utopias, no dystopias — every future has costs and gifts
- Causes are plural and interacting, never single-factor
- Avoid linear extrapolation — include discontinuities, reversals, and non-obvious cascades
- Maintain theological sensitivity without being preachy
- Language is thoughtful, grounded, and imaginative — not technical or corporate

## LEADER PROFILE
Role: ${roleLabel}
Context:
${contextStr}

## SIGNALS OF CONCERN (forces this leader is watching)
${selectedSignalDetails || '(no specific signals selected)'}
${customConcerns}

## PARAMETERS
- Disruption degree: ${DISRUPTION_LABELS[inputs.disruption_degree]} (${inputs.disruption_degree}/5)
- Speed of change: ${SPEED_LABELS[inputs.change_speed]} (${inputs.change_speed}/5)
- Scope: ${SCOPE_LABELS[inputs.scope]}
- Archetypes to generate: ${inputs.archetypes_enabled.join(', ')}

## ARCHETYPE DEFINITIONS
${archetypeDescriptions}

## NARRATIVE VOICE
${roleConfig.narrativeVoice}

## TASK
Generate exactly ${n} distinct future scenarios — one per archetype listed above. Each scenario must:
1. Be plausible and rooted in present-day signals and trends
2. Be internally coherent — causes and effects follow logically
3. Include a genuine surprise — something the leader probably did not anticipate
4. Have a causal pathway of 4–5 steps showing HOW this future unfolded
5. Be voiced for a ${roleLabel} — their world, their vocabulary
6. Include implications for all three roles (pastor, educator, organizational) — but foreground the ${roleLabel}'s perspective
7. Generate 4 discernment prompts that are theologically generative, not generic
8. Generate 4 "faithful responses" — concrete strategic actions grounded in this future

## OUTPUT FORMAT
Return ONLY a valid JSON array. No markdown fences, no preamble, no trailing text.

[
  {
    "id": "scenario-1",
    "archetype": "growth",
    "title": "Evocative 4-7 word title",
    "tagline": "8-12 word poetic subtitle",
    "snapshot": "2-3 sentences in present tense, as if glimpsing this future from inside it. Evocative and specific.",
    "narrative": "3-4 paragraphs telling the story of this future, voiced for a ${roleLabel}. Include texture, tension, and a surprise moment.",
    "key_drivers": ["Driver 1", "Driver 2", "Driver 3", "Driver 4"],
    "causal_pathway": [
      { "year_offset": "By 2027", "event": "What happened and why it mattered" },
      { "year_offset": "By 2029", "event": "..." },
      { "year_offset": "By 2032", "event": "..." },
      { "year_offset": "By 2035", "event": "..." },
      { "year_offset": "By 2040", "event": "..." }
    ],
    "emotional_tone": "hopeful",
    "signals_activated": ["sig-001", "sig-010"],
    "implications": {
      "pastor": [
        { "sphere": "Sphere name", "implication": "2-3 sentence implication for pastors in this future" },
        { "sphere": "Sphere name", "implication": "..." }
      ],
      "educator": [
        { "sphere": "Sphere name", "implication": "2-3 sentence implication for theological educators" },
        { "sphere": "Sphere name", "implication": "..." }
      ],
      "organizational": [
        { "sphere": "Sphere name", "implication": "2-3 sentence implication for Christian org leaders" },
        { "sphere": "Sphere name", "implication": "..." }
      ]
    },
    "discernment_prompts": [
      "What feels most plausible about this future, and why?",
      "What concerns you most in this scenario?",
      "What might God be opening in this future that you hadn't considered?",
      "What would faithful leadership look like in this world?"
    ],
    "faithful_responses": [
      "Specific strategic action 1",
      "Specific strategic action 2",
      "Specific strategic action 3",
      "Specific strategic action 4"
    ]
  }
]

Generate all ${n} scenarios now. Make them meaningfully different from each other in assumptions, emotional register, and implications. Each must feel like a genuinely different world.`;
}

export async function POST(request: NextRequest) {
  try {
    const inputs: ScenarioInputs = await request.json();

    if (!inputs.role || !inputs.archetypes_enabled?.length) {
      return NextResponse.json({ error: 'Missing required fields: role and archetypes_enabled' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(buildPrompt(inputs));
    const rawText = result.response.text();

    const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

    let scenarios: Scenario[];
    try {
      scenarios = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse model response as JSON', raw: cleaned },
        { status: 500 },
      );
    }

    return NextResponse.json({ scenarios });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
