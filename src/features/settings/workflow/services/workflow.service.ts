import type { AddAutomationInput, TagType } from '../types/workflow.types';
import { mockWorkflowService } from './workflow.mock';

export const workflowService = {
  getStages: () => mockWorkflowService.getStages(),
  renameStage: (id: string, name: string) => mockWorkflowService.renameStage(id, name),
  addStage: (name: string) => mockWorkflowService.addStage(name),
  deleteStage: (id: string) => mockWorkflowService.deleteStage(id),
  reorderStages: (orderedIds: string[]) => mockWorkflowService.reorderStages(orderedIds),
  addAutomation: (input: AddAutomationInput) => mockWorkflowService.addAutomation(input),
  deleteAutomation: (stageId: string, autoId: string) => mockWorkflowService.deleteAutomation(stageId, autoId),
  getTags: (type?: TagType) => mockWorkflowService.getTags(type),
  addTag: (name: string, color: string, type: TagType) => mockWorkflowService.addTag(name, color, type),
  deleteTag: (id: string) => mockWorkflowService.deleteTag(id),
};
