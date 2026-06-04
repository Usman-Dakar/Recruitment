export type AutomationTrigger =
  | 'stage_entered'
  | 'stage_left'
  | 'evaluation_completed'
  | 'offer_sent';

export type AutomationAction =
  | 'send_email'
  | 'create_task'
  | 'send_notification'
  | 'move_to_stage';

export type TagType = 'candidate' | 'pipeline' | 'source';

export interface StageAutomation {
  id: string;
  stageId: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
  description: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  automations: StageAutomation[];
  isDefault: boolean;
}

export interface WorkflowTag {
  id: string;
  name: string;
  color: string;
  type: TagType;
}

export interface AddAutomationInput {
  stageId: string;
  trigger: AutomationTrigger;
  action: AutomationAction;
}
