import Accordion from '@/components/common/Accordion'
import type { AccordionItem } from '@/components/common/Accordion'

const items: AccordionItem[] = [
  {
    id: 'sitePageContent_6',
    title: 'Our Mission',
    content: (
      <div className="space-y-3">
        <p>
          At AX Group we strive to leverage our entrepreneurial skills to deliver
          high-quality innovative developments, products, and services. We are
          committed to creating exceptional experiences for our customers while
          generating sustainable value for our stakeholders and the communities in
          which we operate.
        </p>
        <p>
          Founded in 1975, AX Group has grown from a single hotel into a diversified
          group of companies spanning hospitality, real estate, healthcare, and
          construction. Our track record of excellence across Malta is built on a
          foundation of family values, strong leadership, and a commitment to quality
          that permeates everything we do.
        </p>
        <p>
          As an employer, we are dedicated to building a workplace where every
          individual can thrive. We believe that our people are our greatest asset,
          and we work hard every day to attract, develop, and retain the best talent
          in Malta.
        </p>
      </div>
    ),
  },
  {
    id: 'sitePageContent_8',
    title: 'Our Beliefs',
    content: (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-slate-200 mb-1.5">Creativity</h3>
          <p>
            We harness the ingenuity of our people to constantly innovate and improve.
            Thinking differently is encouraged at every level — from our kitchen teams
            to our leadership. Creative ideas drive our growth and keep us ahead in
            competitive markets.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-200 mb-1.5">Determination</h3>
          <p>
            We deliver exceptional quality and exceed the expectations of those we
            serve. Our teams are driven by a relentless pursuit of excellence —
            whether delivering a five-star guest experience or completing a complex
            construction project on time and on budget.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-200 mb-1.5">Integrity</h3>
          <p>
            Transparency, ethics, and trust form the bedrock of everything we do.
            We believe that doing the right thing — for our customers, our employees,
            and our community — is not just good business, it is our obligation as
            one of Malta&rsquo;s leading employers.
          </p>
        </div>
      </div>
    ),
  },
]

export default function AboutUsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">About AX Group</h1>
        <p className="text-sm text-slate-400">
          Established 1975 · Malta&rsquo;s leading diversified group · 1,000+ employees
        </p>
      </div>
      <Accordion items={items} />
    </div>
  )
}
