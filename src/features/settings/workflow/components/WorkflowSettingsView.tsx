import { Separator } from '@/components/ui/separator';
import { WorkflowStageList } from './WorkflowStageList';
import { TagsSection } from './TagsSection';

export function WorkflowSettingsView() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Workflow</h1>
      <WorkflowStageList />
      <Separator />
      <TagsSection />
    </div>
  );
}
