import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Scenario, LeaderRole, StressTestResult } from '@/types';
import { ROLE_LABELS } from '@/data/signals';
import { ARCHETYPE_META } from '@/data/scenarioConfig';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function buildPrompt(strategy: string, scenarios: Scenario[], role: LeaderRole): string {
  const roleLabel = ROLE_LABELS[role] || role;

  const scenarioSummaries = scenarios.map((s, i) =>
    `Scenario ${i + 1} — ID: ${s.id}
Title: ${s.title}
Archetype: ${s.archetype} (${ARCHETYPE_META[s.archetype].description})
Key drivers: ${s.key_drivers.join(', ')}
Snapshot: ${s.snapshot}`
  ).join('\n\n');

  return `You are a strategic advisor helping a Christian leader evaluate how their current strategy performs across multiple possible futures.

## LEADER ROLE
${roleLabel}

## THEIR CURRENT STRATEGY / PLAN
"${strategy}"

## THE FUTURES TO TEST AGAINST
${scenarioSummaries}

## TASK
For each scenario, evaluate how well the leader's strategy performs in that future. Be honest — a strategy that works brilliantly in one future may be dangerously fragile in another.

For each scenario return:
- resilience: one of "strong", "moderate", "fragile", or "breaks"
- resilience_score: 0–100 (strong = 75–100, moderate = 45–74, fragile = 20–44, breaks = 0–19)
- strengths: 2–3 specific ways the strategy holds up in this future
- vulnerabilities: 2–3 specific ways the strategy is exposed or inadequate in this future
- adaptations: 2–3 concrete adjustments that would make the strategy more resilient in this future

Be specific to the strategy described. Do not give generic advice. Reference the actual elements of the plan.

## OUTPUT FORMAT
Return ONLY a valid JSON array. No markdown fences, no preamble.

[
  {
    "scenario_id": "scenario-1",
    "scenario_title": "Title of the scenario",
    "archetype": "growth",
    "resilience": "strong",
    "resilience_score": 82,
    "strengths": ["specific strength 1", "specific strength 2"],
    "vulnerabilities": ["specific vulnerability 1", "specific vulnerability 2"],
    "adaptations": ["concrete adaptation 1", "concrete adaptation 2"]
  }
]`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategy, scenarios, role } = body as {
      strategy: string;
      scenarios: Scenario[];
      role: LeaderRole;
    };

    if (!strategy || !scenarios?.length || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(buildPrompt(strategy, scenarios, role));
    const rawText = result.response.text();

    const cleaned = rawText.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

    let results: StressTestResult[];
    try {
      results = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse model response as JSON', raw: cleaned },
        { status: 500 },
      );
    }

    return NextResponse.json({ results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
