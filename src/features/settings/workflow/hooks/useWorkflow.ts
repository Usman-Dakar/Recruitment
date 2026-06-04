import { useQuery } from '@tanstack/react-query';
import { workflowService } from '../services/workflow.service';
import type { TagType } from '../types/workflow.types';

export const WORKFLOW_KEY = ['settings', 'workflow'] as const;

export const usePipelineStages = () =>
  useQuery({
    queryKey: [...WORKFLOW_KEY, 'stages'],
    queryFn: () => workflowService.getStages(),
    staleTime: 1000 * 60 * 5,
  });

export const useWorkflowTags = (type?: TagType) =>
  useQuery({
    queryKey: [...WORKFLOW_KEY, 'tags', type ?? 'all'],
    queryFn: () => workflowService.getTags(type),
    staleTime: 1000 * 60 * 5,
  });
