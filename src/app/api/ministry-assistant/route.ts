import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SPHERE_DESCRIPTIONS: Record<string, string[]> = {
  pastor: [
    'Congregational life and formation — how people gather, belong, form faith, and care for one another',
    'Preaching and communication — how the gospel is proclaimed across fragmented attention, digital fluency, and narrative pluralism',
    'Pastoral care and presence — how care, crisis response, and accompaniment evolve amid digital mediation and mental health needs',
    'Community and neighbourhood engagement — how the local church relates to its surrounding context — social, economic, and demographic change',
    'Leadership and personal sustainability — how pastors lead themselves and their teams in a high-burnout, rapidly shifting ministry environment',
  ],
  denominational: [
    'Organizational strategy and governance — how institutions are structured, resourced, and governed for agility in a destabilized landscape',
    'Resource allocation and stewardship — how financial, human, and physical assets are deployed in response to declining or shifting flows',
    'Interchurch and ecumenical relations — how denominations relate to one another and collaborate for shared mission and mutual accountability',
    'Cultural voice and public engagement — how the church speaks into public life — policy, ethics, culture — with credibility and coherence',
    'Leadership pipeline and vocation — how the next generation of leaders is identified, formed, supported, and retained',
  ],
  educator: [
    'Curriculum and pedagogical design — what is taught, how it is taught, and how formation is sequenced in an age of rapid knowledge change',
    'Institutional viability and models — how theological education is funded, delivered, and structured — residential, hybrid, distributed',
    'Research and theological scholarship — what questions the church needs scholarship to address, and how research translates into practice',
    'Student formation and mentorship — how the whole person — character, spirituality, vocation — is developed alongside academic competence',
    'Contextual and global perspectives — how the global church and local context shape theological training beyond Western dominant frameworks',
  ],
  member: [
    'Faith formation and discipleship — how people grow as followers of Jesus in the rhythms of ordinary life',
    'Vocation and work — how faith integrates with work, career, technology, and economic life in a transforming world',
    'Family and household life — how faith is practised and passed on within households amid pressures on family structure and time',
    'Community and civic participation — how Christians engage as neighbours, citizens, and agents of change in their local communities',
    'Belonging and spiritual community — how people find, sustain, and contribute to genuine Christian community beyond institutional attendance',
  ],
};

const ROLE_LABELS: Record<string, string> = {
  pastor: 'Pastor',
  denominational: 'Denominational / Christian Organization Leader',
  educator: 'Theological Educator',
  member: 'Congregation Member',
};

function buildPrompt(
  role: string,
  context: Record<string, string>,
  signalTitle: string,
  signalDescription: string,
  disruptionLevel: string,
  maturityStage: string,
): string {
  const roleLabel = ROLE_LABELS[role] || role;
  const spheres = SPHERE_DESCRIPTIONS[role] || [];
  const sphereList = spheres.map((s, i) => `${i + 1}. ${s}`).join('\n');

  const contextStr = Object.entries(context)
    .filter(([, v]) => v)
    .map(([k, v]) => `  - ${k.replace(/_/g, ' ')}: ${v}`)
    .join('\n');

  return `You are a strategic ministry innovation assistant. Your role is to help Christian leaders think creatively and practically about ministry responses to significant signals of change. You help leaders move from signals of change to practical, grounded ministry responses — concrete, theologically grounded, and contextually sensitive.

## LEADER PROFILE
Role: ${roleLabel}
Context:
${contextStr || '  (no context provided)'}

## SIGNAL OF CHANGE
Title: ${signalTitle}
Description: ${signalDescription}
Disruption Level: ${disruptionLevel} (${disruptionLevel === 'incremental' ? 'builds on existing systems' : disruptionLevel === 'substantive' ? 'requires meaningful structural change' : 'challenges core assumptions'})
Maturity Stage: ${maturityStage} (${maturityStage === 'emerging' ? '0–3 years, fringe / early adopters' : maturityStage === 'scaling' ? '3–7 years, accelerating growth' : maturityStage === 'established' ? '7–15 years, mainstream adoption' : '15+ years, embedded in structures'})

## TASK
Generate focused, immediately useful ministry implications and practical responses for this leader.

For each of the five spheres of influence listed below, provide:
1. ONE clear implication statement (2–3 sentences) explaining how this signal creates challenge, tension, or opportunity in that sphere for this specific leader
2. Response A — Incremental: 2–3 specific, realistic actions implementable within existing structures and resources, achievable this month
3. Response B — Developmental: 2–3 meaningful actions requiring some new thinking or modest new investment, achievable within 12–18 months
4. Response C — Transformational: 2–3 bold, imaginative responses that challenge current assumptions — stretching but not fantasy

The five spheres for a ${roleLabel}:
${sphereList}

## IMPORTANT GUIDANCE
- Be specific and concrete, not generic or vague
- Ground responses in this leader's actual context (role, setting, size, challenges described above)
- Each implication should feel like it speaks *to this person*, not to everyone
- Incremental responses should feel actionable by a busy leader who opens this on a Monday morning
- Transformational responses should feel bold but rooted — achievable with courage and investment, not just aspiration
- Use plain, direct language. Avoid jargon unless it is natural to this ministry context
- Do not frame responses as if exploring all possibilities — pick the 2–3 most interesting and useful ideas for this leader
- Your output is meant to stimulate 3 minutes of creative thinking, not provide an exhaustive report

## OUTPUT FORMAT
Return ONLY a valid JSON object with this exact structure (no markdown, no preamble, no trailing text):
{
  "spheres": [
    {
      "sphere_name": "Short sphere name (3–5 words)",
      "implication": "2–3 sentence implication statement",
      "responses": {
        "incremental": ["action 1", "action 2", "action 3"],
        "developmental": ["action 1", "action 2", "action 3"],
        "transformational": ["action 1", "action 2", "action 3"]
      }
    }
  ]
}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, context, signal } = body;

    if (!role || !signal) {
      return NextResponse.json({ error: 'Missing required fields: role and signal' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const prompt = buildPrompt(
      role,
      context || {},
      signal.title,
      signal.description,
      signal.disruption_level,
      signal.maturity_stage,
    );

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse model response as JSON', raw: cleaned },
        { status: 500 },
      );
    }

    return NextResponse.json({ output: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
