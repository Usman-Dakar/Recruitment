import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService } from '../services/workflow.service';
import { WORKFLOW_KEY } from './useWorkflow';
import type { AddAutomationInput, TagType } from '../types/workflow.types';

const STAGES_KEY = [...WORKFLOW_KEY, 'stages'] as const;
const TAGS_KEY = [...WORKFLOW_KEY, 'tags'] as const;

export const useRenameStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      workflowService.renameStage(id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
};

export const useAddStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => workflowService.addStage(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
};

export const useDeleteStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workflowService.deleteStage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
};

export const useReorderStages = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => workflowService.reorderStages(orderedIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
};

export const useAddAutomation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddAutomationInput) => workflowService.addAutomation(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
};

export const useDeleteAutomation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ stageId, autoId }: { stageId: string; autoId: string }) =>
      workflowService.deleteAutomation(stageId, autoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
};

export const useAddTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, color, type }: { name: string; color: string; type: TagType }) =>
      workflowService.addTag(name, color, type),
    onSuccess: () => qc.invalidateQueries({ queryKey: TAGS_KEY }),
  });
};

export const useDeleteTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workflowService.deleteTag(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TAGS_KEY }),
  });
};
