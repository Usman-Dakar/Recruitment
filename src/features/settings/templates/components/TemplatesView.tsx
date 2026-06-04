import { useState } from 'react';
import { PageWrapper } from '@/components/layout';
import { TemplateTabNav } from './TemplateTabNav';
import { JobTemplateList } from './JobTemplateList';
import { EmailTemplateList } from './EmailTemplateList';
import { QuestionnaireList } from './QuestionnaireList';
import { CareersPageBuilder } from './CareersPageBuilder';
import type { TemplateTab } from '../types/templates.types';

export function TemplatesView() {
  const [activeTab, setActiveTab] = useState<TemplateTab>('job');

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold">Templates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage reusable templates for jobs, emails, questionnaires, and your careers page.
          </p>
        </div>

        <TemplateTabNav active={activeTab} onChange={setActiveTab} />

        <div>
          {activeTab === 'job' && <JobTemplateList />}
          {activeTab === 'email' && <EmailTemplateList />}
          {activeTab === 'questionnaire' && <QuestionnaireList />}
          {activeTab === 'careers' && <CareersPageBuilder />}
        </div>
      </div>
    </PageWrapper>
  );
}
