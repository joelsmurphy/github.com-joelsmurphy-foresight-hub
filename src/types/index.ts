export type DisruptionLevel = 'incremental' | 'substantive' | 'transformative';
export type MaturityStage = 'emerging' | 'scaling' | 'established' | 'structural';
export type Zone = 'innovation' | 'reactive' | 'active' | 'action';
export type LeaderRole = 'pastor' | 'denominational' | 'educator' | 'member';

export interface Signal {
  id: string;
  title: string;
  description: string;
  sources: string[];
  disruption_level: DisruptionLevel;
  maturity_stage: MaturityStage;
  zone: Zone;
  x_position: number; // 0–100 (maturity axis)
  y_position: number; // 0–100 (impact/adoption level, 100 = top)
  notes?: string;
  date_observed?: string;
  domain?: string;
  time_horizon?: string;
  confidence_level?: string;
  related_signals?: string[];
}

export interface ContextQuestion {
  id: string;
  label: string;
  type: 'select' | 'text';
  options?: string[];
  placeholder?: string;
}

export interface MinistryContext {
  [key: string]: string;
}

export interface SphereResponse {
  sphere_name: string;
  implication: string;
  responses: {
    incremental: string[];
    developmental: string[];
    transformational: string[];
  };
}

export interface MinistryOutput {
  spheres: SphereResponse[];
}

export interface FilterState {
  disruption: Set<DisruptionLevel>;
  stage: Set<MaturityStage>;
  showLabels: boolean;
}

// ── Scenario Generator ────────────────────────────────────────────────────────

export type DatorArchetype = 'growth' | 'collapse' | 'discipline' | 'transformation';
export type EmotionalTone = 'hopeful' | 'tense' | 'ambiguous' | 'urgent' | 'surprising';
export type ChangeScope = 'local' | 'regional' | 'national' | 'ecclesial' | 'global';

export interface ScenarioInputs {
  role: LeaderRole;
  context: MinistryContext;
  selected_signals: string[];       // Signal IDs from SAMPLE_SIGNALS
  custom_concerns: string[];
  disruption_degree: 1 | 2 | 3 | 4 | 5;
  change_speed: 1 | 2 | 3 | 4 | 5; // 1 = generational, 5 = within a decade
  scope: ChangeScope;
  archetypes_enabled: DatorArchetype[];
}

export interface CausalStep {
  year_offset: string; // e.g. "By 2027", "A decade later"
  event: string;
}

export interface RoleImplication {
  sphere: string;
  implication: string;
}

export interface Scenario {
  id: string;
  archetype: DatorArchetype;
  title: string;
  tagline: string;
  snapshot: string;
  narrative: string;
  key_drivers: string[];
  causal_pathway: CausalStep[];
  emotional_tone: EmotionalTone;
  signals_activated: string[];
  implications: {
    pastor: RoleImplication[];
    educator: RoleImplication[];
    organizational: RoleImplication[];
  };
  discernment_prompts: string[];
  faithful_responses: string[];
}

export interface StressTestResult {
  scenario_id: string;
  scenario_title: string;
  archetype: DatorArchetype;
  resilience: 'strong' | 'moderate' | 'fragile' | 'breaks';
  resilience_score: number; // 0–100
  strengths: string[];
  vulnerabilities: string[];
  adaptations: string[];
}
