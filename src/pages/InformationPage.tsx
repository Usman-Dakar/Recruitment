import Accordion from '@/components/common/Accordion'
import type { AccordionItem } from '@/components/common/Accordion'

const items: AccordionItem[] = [
  {
    id: 'sitePageContent_4',
    title: 'Career Development',
    content: (
      <div className="space-y-3">
        <p>
          AX Group is one of Malta&rsquo;s leading companies, established in 1975. With over
          1,000 employees across four core sectors — Hospitality, Real Estate, Healthcare,
          and Construction — AX Group is a proud employer of choice in Malta.
        </p>
        <p>
          We invest in our people through structured learning pathways, mentorship programmes,
          and cross-departmental mobility. Whether you are starting your career or looking to
          advance, AX Group provides the environment and support to help you grow.
        </p>
        <p>
          Our commitment to employee development is reflected in our continuous training
          initiatives, transparent performance review processes, and a culture of recognition
          that rewards dedication and talent.
        </p>
      </div>
    ),
  },
  {
    id: 'sitePageContent_5',
    title: 'Useful Links',
    content: (
      <ul className="space-y-2">
        <li>
          <a
            href="https://axgroup.mt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
          >
            AX Group Website
          </a>
          <span className="text-slate-500"> — Learn more about AX Group and its companies</span>
        </li>
        <li>
          <a
            href="https://europass.cedefop.europa.eu/en/documents/curriculum-vitae"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
          >
            Europass CV Builder
          </a>
          <span className="text-slate-500"> — Create a professional European-format CV</span>
        </li>
      </ul>
    ),
  },
  {
    id: 'sitePageContent_23',
    title: 'General Provisions',
    content: (
      <div className="space-y-3">
        <p>
          This portal is designed to provide the best possible experience for all candidates.
          For optimal performance, we recommend using a modern up-to-date web browser such
          as Google Chrome, Mozilla Firefox, or Microsoft Edge.
        </p>
        <p>
          All personal data submitted through this portal is processed in accordance with
          the General Data Protection Regulation (GDPR) and AX Group&rsquo;s Privacy Policy.
          Your information will only be used for recruitment purposes.
        </p>
        <p>
          Applications submitted via this portal are reviewed by our HR team. Successful
          candidates will be contacted directly. AX Group is an equal opportunities employer.
        </p>
      </div>
    ),
  },
]

export default function InformationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Information</h1>
        <p className="text-sm text-slate-400">
          Career development resources and general information for candidates.
        </p>
      </div>
      <Accordion items={items} />
    </div>
  )
}
