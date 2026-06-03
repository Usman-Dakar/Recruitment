import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Phone, Mail, Send } from 'lucide-react'
import Accordion from '@/components/common/Accordion'
import MessageModal from '@/components/modals/MessageModal'
import type { AccordionItem } from '@/components/common/Accordion'
import { inputClass, labelClass, errClass } from '@/lib/formStyles'

const schema = z.object({
  Name:      z.string().min(1, 'Name is required.').max(40, 'First Name length is 40 characters.'),
  Email:     z.string().min(1, 'Email is required.').email('Please provide proper email').max(100),
  Telephone: z.string().min(1, 'Telephone is required.').max(25),
  Message:   z.string().min(1, 'Message is required.').max(250, 'Message max length is 250 character'),
})

type ContactFields = z.infer<typeof schema>

function ContactForm() {
  const [modal, setModal] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFields>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: ContactFields) => {
    await new Promise<void>((r) => setTimeout(r, 600))
    reset({ Name: data.Name, Email: data.Email, Telephone: '', Message: '' })
    setModal({ open: true, message: 'Your message has been sent successfully. We will be in touch shortly.' })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="contact-name" className={labelClass}>Name</label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            {...register('Name')}
            className={inputClass}
            aria-describedby={errors.Name ? 'contact-name-err' : undefined}
          />
          {errors.Name && <p id="contact-name-err" className={errClass}>{errors.Name.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>Email</label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('Email')}
            className={inputClass}
            aria-describedby={errors.Email ? 'contact-email-err' : undefined}
          />
          {errors.Email && <p id="contact-email-err" className={errClass}>{errors.Email.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-tel" className={labelClass}>Telephone</label>
          <input
            id="contact-tel"
            type="tel"
            autoComplete="tel"
            placeholder="+356 2000 0000"
            {...register('Telephone')}
            className={inputClass}
            aria-describedby={errors.Telephone ? 'contact-tel-err' : undefined}
          />
          {errors.Telephone && <p id="contact-tel-err" className={errClass}>{errors.Telephone.message}</p>}
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            Message
            <span className="ml-1 normal-case font-normal text-slate-600">(max 250 chars)</span>
          </label>
          <textarea
            id="contact-message"
            rows={5}
            placeholder="Your message…"
            {...register('Message')}
            className={inputClass + ' resize-none'}
            aria-describedby={errors.Message ? 'contact-message-err' : undefined}
          />
          {errors.Message && <p id="contact-message-err" className={errClass}>{errors.Message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-400 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>

      <MessageModal
        isOpen={modal.open}
        message={modal.message}
        onClose={() => setModal({ open: false, message: '' })}
      />
    </>
  )
}

const contactDetailsItems: AccordionItem[] = [
  {
    id: 'contact-details',
    title: 'Contact Details',
    content: (
      <address className="not-italic space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium text-slate-300 mb-0.5">Address</p>
            <p>AX Business Centre<br />Triq Id-Difiza Civili<br />Mosta MST 1741, Malta</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-brand-400 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium text-slate-300 mb-0.5">Phone</p>
            <a href="tel:+35623312345" className="text-brand-400 hover:text-brand-300 transition-colors">
              +356 2331 2345
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-brand-400 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium text-slate-300 mb-0.5">Email</p>
            <a href="mailto:info@axgroup.mt" className="text-brand-400 hover:text-brand-300 transition-colors">
              info@axgroup.mt
            </a>
          </div>
        </div>
      </address>
    ),
  },
]

export default function ContactUsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Contact Us</h1>
        <p className="text-sm text-slate-400">
          Have a question? Get in touch with the AX Group HR team.
        </p>
      </div>

      <div className="space-y-8">
        <div className="glass rounded-xl p-6">
          <h2 className="font-semibold text-slate-200 mb-5 text-sm uppercase tracking-wider">
            Send a Message
          </h2>
          <ContactForm />
        </div>

        <Accordion items={contactDetailsItems} defaultOpenId="contact-details" />
      </div>
    </div>
  )
}
