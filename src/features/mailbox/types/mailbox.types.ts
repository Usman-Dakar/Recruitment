export type MailFolder = 'inbox' | 'sent' | 'drafts' | 'trash';

export interface EmailParticipant {
  name: string;
  email: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  from: EmailParticipant;
  to: EmailParticipant[];
  subject: string;
  body: string;
  sentAt: Date;
  isOwn: boolean;
}

export interface EmailThread {
  id: string;
  subject: string;
  folder: MailFolder;
  messages: EmailMessage[];
  isRead: boolean;
  updatedAt: Date;
  candidateId?: string;
  candidateName?: string;
  jobId?: string;
  jobTitle?: string;
}

export interface ComposeEmailInput {
  to: string;
  subject: string;
  body: string;
}

export type FolderCounts = Record<MailFolder, number>;
