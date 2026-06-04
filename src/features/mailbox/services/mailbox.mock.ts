import { subDays, subHours, subMinutes } from 'date-fns';
import type { EmailThread, EmailMessage, ComposeEmailInput, FolderCounts } from '../types/mailbox.types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const now = new Date();

// TODO: replace with API — GET /mailbox/threads
let MOCK_THREADS: EmailThread[] = [
  {
    id: 't1', subject: 'Interview Invitation — Senior Frontend Engineer',
    folder: 'inbox', isRead: false, updatedAt: subHours(now, 2),
    candidateId: 'c1', candidateName: 'John Smith',
    messages: [
      { id: 'm1a', threadId: 't1', from: { name: 'Alice Johnson', email: 'alice@dakar.io' }, to: [{ name: 'John Smith', email: 'john.smith@email.com' }], subject: 'Interview Invitation — Senior Frontend Engineer', body: 'Hi John,\n\nWe\'d love to invite you for a technical interview for the Senior Frontend Engineer role. The session will be 90 minutes covering React, TypeScript, and system design.\n\nAre you available Thursday at 2pm or Friday between 10am–12pm?\n\nBest,\nAlice', sentAt: subDays(now, 2), isOwn: true },
      { id: 'm1b', threadId: 't1', from: { name: 'John Smith', email: 'john.smith@email.com' }, to: [{ name: 'Alice Johnson', email: 'alice@dakar.io' }], subject: 'Re: Interview Invitation — Senior Frontend Engineer', body: 'Hi Alice,\n\nThank you for reaching out! Thursday at 2pm works perfectly for me.\n\nLooking forward to it!\n\nBest,\nJohn', sentAt: subHours(now, 2), isOwn: false },
    ],
  },
  {
    id: 't2', subject: 'Application Follow-up — Product Manager',
    folder: 'inbox', isRead: true, updatedAt: subHours(now, 6),
    candidateId: 'c2', candidateName: 'Sarah Lee',
    messages: [
      { id: 'm2a', threadId: 't2', from: { name: 'Sarah Lee', email: 'sarah.lee@email.com' }, to: [{ name: 'Alice Johnson', email: 'alice@dakar.io' }], subject: 'Application Follow-up — Product Manager', body: 'Hi Alice,\n\nI wanted to follow up on my application for the Product Manager role. I\'m very interested and would love to discuss next steps.\n\nBest,\nSarah', sentAt: subDays(now, 4), isOwn: false },
      { id: 'm2b', threadId: 't2', from: { name: 'Alice Johnson', email: 'alice@dakar.io' }, to: [{ name: 'Sarah Lee', email: 'sarah.lee@email.com' }], subject: 'Re: Application Follow-up — Product Manager', body: 'Hi Sarah,\n\nYour application is in review and we\'ll be in touch by end of week.\n\nBest,\nAlice', sentAt: subHours(now, 6), isOwn: true },
    ],
  },
  {
    id: 't3', subject: 'Background Check Complete — Priya Nair',
    folder: 'inbox', isRead: false, updatedAt: subMinutes(now, 45),
    candidateId: 'c3', candidateName: 'Priya Nair',
    messages: [
      { id: 'm3a', threadId: 't3', from: { name: 'VerifyPro', email: 'checks@verifypro.com' }, to: [{ name: 'Alice Johnson', email: 'alice@dakar.io' }], subject: 'Background Check Complete — Priya Nair', body: 'Hello,\n\nThe background check for Priya Nair has been completed. All verifications passed. The full report is available in your portal.\n\nRegards,\nVerifyPro Team', sentAt: subMinutes(now, 45), isOwn: false },
    ],
  },
  {
    id: 't4', subject: 'Offer Letter — Senior Frontend Engineer',
    folder: 'inbox', isRead: true, updatedAt: subDays(now, 1),
    candidateId: 'c2', candidateName: 'Sarah Lee',
    messages: [
      { id: 'm4a', threadId: 't4', from: { name: 'Alice Johnson', email: 'alice@dakar.io' }, to: [{ name: 'Sarah Lee', email: 'sarah.lee@email.com' }], subject: 'Offer Letter — Senior Frontend Engineer', body: 'Hi Sarah,\n\nI\'m thrilled to extend a formal offer for the Senior Frontend Engineer position. Please find the offer letter attached.\n\nWe hope you\'ll join us!\n\nAlice', sentAt: subDays(now, 3), isOwn: true },
      { id: 'm4b', threadId: 't4', from: { name: 'Sarah Lee', email: 'sarah.lee@email.com' }, to: [{ name: 'Alice Johnson', email: 'alice@dakar.io' }], subject: 'Re: Offer Letter — Senior Frontend Engineer', body: 'Hi Alice,\n\nI\'m very excited to accept! Looking forward to joining the team.\n\nBest,\nSarah', sentAt: subDays(now, 1), isOwn: false },
    ],
  },
  {
    id: 't5', subject: 'Job Description Review — UX Designer',
    folder: 'sent', isRead: true, updatedAt: subDays(now, 2),
    messages: [
      { id: 'm5a', threadId: 't5', from: { name: 'Alice Johnson', email: 'alice@dakar.io' }, to: [{ name: 'Bob Chen', email: 'bob@dakar.io' }], subject: 'Job Description Review — UX Designer', body: 'Hi Bob,\n\nCould you review the JD for the UX Designer role before we post it? I\'ve attached the draft for your feedback.\n\nThanks,\nAlice', sentAt: subDays(now, 2), isOwn: true },
    ],
  },
  {
    id: 't6', subject: 'Onboarding Documents — Lena Fischer',
    folder: 'sent', isRead: true, updatedAt: subDays(now, 5),
    candidateId: 'c8', candidateName: 'Lena Fischer',
    messages: [
      { id: 'm6a', threadId: 't6', from: { name: 'Alice Johnson', email: 'alice@dakar.io' }, to: [{ name: 'Lena Fischer', email: 'lena.fischer@email.com' }], subject: 'Onboarding Documents — Lena Fischer', body: 'Hi Lena,\n\nCongratulations on joining the team! Please find the onboarding documents attached. Your first day is Monday, May 18th.\n\nWe\'re excited to have you!\n\nAlice', sentAt: subDays(now, 5), isOwn: true },
    ],
  },
];

export const mockMailboxService = {
  getThreads: async (folder: string): Promise<EmailThread[]> => {
    await delay(300);
    return MOCK_THREADS.filter(t => t.folder === folder);
  },

  getThread: async (id: string): Promise<EmailThread | null> => {
    await delay(150);
    return MOCK_THREADS.find(t => t.id === id) ?? null;
  },

  getFolderCounts: async (): Promise<FolderCounts> => {
    await delay(100);
    const inbox = MOCK_THREADS.filter(t => t.folder === 'inbox' && !t.isRead).length;
    return { inbox, sent: 0, drafts: 0, trash: 0 };
  },

  markRead: async (threadId: string): Promise<void> => {
    await delay(100);
    MOCK_THREADS = MOCK_THREADS.map(t => t.id === threadId ? { ...t, isRead: true } : t);
  },

  // TODO: replace with API — POST /mailbox/send
  sendEmail: async (input: ComposeEmailInput): Promise<void> => {
    await delay(500);
    const id = `t${Date.now()}`;
    const thread: EmailThread = {
      id,
      subject: input.subject,
      folder: 'sent',
      isRead: true,
      updatedAt: new Date(),
      messages: [
        { id: `m${Date.now()}`, threadId: id, from: { name: 'Alice Johnson', email: 'alice@dakar.io' }, to: [{ name: input.to, email: input.to }], subject: input.subject, body: input.body, sentAt: new Date(), isOwn: true },
      ],
    };
    MOCK_THREADS = [thread, ...MOCK_THREADS];
  },

  // TODO: replace with API — POST /mailbox/threads/:id/reply
  reply: async (threadId: string, body: string): Promise<void> => {
    await delay(400);
    const thread = MOCK_THREADS.find(t => t.id === threadId);
    if (!thread) return;
    const firstMsg = thread.messages[0];
    const msg: EmailMessage = {
      id: `m${Date.now()}`, threadId,
      from: { name: 'Alice Johnson', email: 'alice@dakar.io' },
      to: firstMsg ? [firstMsg.from] : [],
      subject: `Re: ${thread.subject}`,
      body,
      sentAt: new Date(),
      isOwn: true,
    };
    MOCK_THREADS = MOCK_THREADS.map(t =>
      t.id === threadId ? { ...t, messages: [...t.messages, msg], updatedAt: new Date() } : t,
    );
  },

  // TODO: replace with API — DELETE /mailbox/threads/:id
  deleteThread: async (id: string): Promise<void> => {
    await delay(200);
    MOCK_THREADS = MOCK_THREADS.filter(t => t.id !== id);
  },
};
