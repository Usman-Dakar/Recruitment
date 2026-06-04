import type {
  PipelineStage,
  WorkflowTag,
  AddAutomationInput,
  TagType,
} from '../types/workflow.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const TRIGGER_LABELS: Record<string, string> = {
  stage_entered: 'Stage entered',
  stage_left: 'Stage left',
  evaluation_completed: 'Evaluation completed',
  offer_sent: 'Offer sent',
};
const ACTION_LABELS: Record<string, string> = {
  send_email: 'Send email',
  create_task: 'Create task',
  send_notification: 'Send notification',
  move_to_stage: 'Move to next stage',
};

// TODO: replace with API — GET /settings/workflow/stages
let MOCK_STAGES: PipelineStage[] = [
  { id: 'st1', name: 'Applied',    order: 0, color: '#94a3b8', isDefault: true,  automations: [{ id: 'aut1', stageId: 'st1', trigger: 'stage_entered', action: 'send_notification', description: 'Stage entered → Send notification' }] },
  { id: 'st2', name: 'Screening',  order: 1, color: '#818cf8', isDefault: false, automations: [] },
  { id: 'st3', name: 'Interview',  order: 2, color: '#a78bfa', isDefault: false, automations: [{ id: 'aut2', stageId: 'st3', trigger: 'stage_entered', action: 'create_task', description: 'Stage entered → Create task' }] },
  { id: 'st4', name: 'Assessment', order: 3, color: '#c4b5fd', isDefault: false, automations: [] },
  { id: 'st5', name: 'Offer',      order: 4, color: '#6366f1', isDefault: false, automations: [{ id: 'aut3', stageId: 'st5', trigger: 'offer_sent', action: 'send_email', description: 'Offer sent → Send email' }] },
  { id: 'st6', name: 'Hired',      order: 5, color: '#22c55e', isDefault: true,  automations: [] },
];

// TODO: replace with API — GET /settings/workflow/tags
let MOCK_TAGS: WorkflowTag[] = [
  { id: 'tag1', name: 'React',       color: '#60a5fa', type: 'candidate' },
  { id: 'tag2', name: 'TypeScript',  color: '#818cf8', type: 'candidate' },
  { id: 'tag3', name: 'Senior',      color: '#34d399', type: 'candidate' },
  { id: 'tag4', name: 'Leadership',  color: '#f59e0b', type: 'candidate' },
  { id: 'tag5', name: 'Fast track',  color: '#f43f5e', type: 'pipeline' },
  { id: 'tag6', name: 'On hold',     color: '#94a3b8', type: 'pipeline' },
  { id: 'tag7', name: 'LinkedIn',    color: '#0ea5e9', type: 'source' },
  { id: 'tag8', name: 'Referral',    color: '#10b981', type: 'source' },
];

export const mockWorkflowService = {
  getStages: async (): Promise<PipelineStage[]> => {
    await delay(250);
    return MOCK_STAGES.slice().sort((a, b) => a.order - b.order);
  },

  // TODO: replace with API — PATCH /settings/workflow/stages/:id
  renameStage: async (id: string, name: string): Promise<void> => {
    await delay(200);
    MOCK_STAGES = MOCK_STAGES.map(s => (s.id === id ? { ...s, name } : s));
  },

  // TODO: replace with API — POST /settings/workflow/stages
  addStage: async (name: string): Promise<PipelineStage> => {
    await delay(300);
    const maxOrder = Math.max(...MOCK_STAGES.map(s => s.order));
    const stage: PipelineStage = {
      id: `st${Date.now()}`,
      name,
      order: maxOrder + 1,
      color: '#94a3b8',
      isDefault: false,
      automations: [],
    };
    MOCK_STAGES = [...MOCK_STAGES, stage];
    return stage;
  },

  // TODO: replace with API — DELETE /settings/workflow/stages/:id
  deleteStage: async (id: string): Promise<void> => {
    await delay(250);
    MOCK_STAGES = MOCK_STAGES.filter(s => s.id !== id);
  },

  // TODO: replace with API — PATCH /settings/workflow/stages/reorder
  reorderStages: async (orderedIds: string[]): Promise<void> => {
    await delay(200);
    MOCK_STAGES = MOCK_STAGES.map(s => ({
      ...s,
      order: orderedIds.indexOf(s.id),
    }));
  },

  // TODO: replace with API — POST /settings/workflow/stages/:id/automations
  addAutomation: async (input: AddAutomationInput): Promise<void> => {
    await delay(300);
    const auto = {
      id: `aut${Date.now()}`,
      stageId: input.stageId,
      trigger: input.trigger,
      action: input.action,
      description: `${TRIGGER_LABELS[input.trigger] ?? input.trigger} → ${ACTION_LABELS[input.action] ?? input.action}`,
    };
    MOCK_STAGES = MOCK_STAGES.map(s =>
      s.id === input.stageId ? { ...s, automations: [...s.automations, auto] } : s,
    );
  },

  // TODO: replace with API — DELETE /settings/workflow/stages/:stageId/automations/:autoId
  deleteAutomation: async (stageId: string, autoId: string): Promise<void> => {
    await delay(200);
    MOCK_STAGES = MOCK_STAGES.map(s =>
      s.id === stageId
        ? { ...s, automations: s.automations.filter(a => a.id !== autoId) }
        : s,
    );
  },

  getTags: async (type?: TagType): Promise<WorkflowTag[]> => {
    await delay(200);
    return type ? MOCK_TAGS.filter(t => t.type === type) : [...MOCK_TAGS];
  },

  // TODO: replace with API — POST /settings/workflow/tags
  addTag: async (name: string, color: string, type: TagType): Promise<WorkflowTag> => {
    await delay(250);
    const tag: WorkflowTag = { id: `tag${Date.now()}`, name, color, type };
    MOCK_TAGS = [...MOCK_TAGS, tag];
    return tag;
  },

  // TODO: replace with API — DELETE /settings/workflow/tags/:id
  deleteTag: async (id: string): Promise<void> => {
    await delay(150);
    MOCK_TAGS = MOCK_TAGS.filter(t => t.id !== id);
  },
};
