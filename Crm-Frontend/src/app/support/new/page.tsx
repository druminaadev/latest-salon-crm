'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LifeBuoy, Send, Upload, X, AlertCircle, HelpCircle, BookOpen } from 'lucide-react'

const CATEGORIES = [
  { value: 'billing', label: 'Billing & Payments', description: 'Issues with payments, invoices, or subscriptions' },
  { value: 'technical', label: 'Technical Issue', description: 'Software bugs, errors, or system problems' },
  { value: 'feature', label: 'Feature Request', description: 'Suggest new features or improvements' },
  { value: 'bug', label: 'Bug Report', description: 'Report software bugs or unexpected behavior' },
  { value: 'question', label: 'General Question', description: 'Ask questions about features or usage' },
]

const PRIORITIES = [
  { value: 'low', label: 'Low', description: 'Minor issue, no immediate impact' },
  { value: 'medium', label: 'Medium', description: 'Moderate issue, affects some features' },
  { value: 'high', label: 'High', description: 'Major issue, affects important features' },
  { value: 'critical', label: 'Critical', description: 'System down or critical functionality broken' },
]

export default function NewTicketPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    email: 'admin@hairahmedabad.com',
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [showGuidance, setShowGuidance] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate API call to send email to developer team
    const emailData = {
      to: 'dev-team@hairahmedabad.com',
      from: formData.email,
      subject: `[${formData.category.toUpperCase()}] ${formData.subject}`,
      priority: formData.priority,
      body: formData.description,
      attachments: attachments.map(f => f.name),
      timestamp: new Date().toISOString(),
    }
    
    console.log('Sending ticket to developer team:', emailData)
    
    // Show success message
    alert(' Support ticket created successfully!\n\nYour ticket has been sent to our developer team. You will receive a confirmation email shortly.')
    
    // Redirect to support page
    router.push('/support')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments([...attachments, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-full space-y-6 bg-[#FBF4F8] pb-6 text-gray-950 dark:bg-transparent dark:text-white">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6F5AA3] via-[#9D679F] to-[#C96F9B] px-6 py-6 shadow-[0_20px_50px_rgba(111,90,163,0.35)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <LifeBuoy size={12} />
            New Support Ticket
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Create Support Ticket</h1>
          <p className="mt-1 text-sm text-white/70">Submit your query to our developer team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-2xl border border-white/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Ticket Details</h2>
              
              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition focus:border-[#6F5AA3] focus:outline-none dark:border-white/10 dark:bg-white/[0.04]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {CATEGORIES.map(cat => (
                      <label
                        key={cat.value}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition ${
                          formData.category === cat.value
                            ? 'border-[#6F5AA3] bg-[#6F5AA3]/5'
                            : 'border-gray-200 bg-white hover:border-[#6F5AA3]/50 dark:border-white/10 dark:bg-white/[0.04]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.value}
                          checked={formData.category === cat.value}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="sr-only"
                          required
                        />
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                            formData.category === cat.value ? 'border-[#6F5AA3]' : 'border-gray-300'
                          }`}>
                            {formData.category === cat.value && (
                              <div className="h-2.5 w-2.5 rounded-full bg-[#6F5AA3]" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{cat.label}</div>
                            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{cat.description}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition focus:border-[#6F5AA3] focus:outline-none dark:border-white/10 dark:bg-white/[0.04]"
                    required
                  >
                    {PRIORITIES.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label} - {priority.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed information about your issue..."
                    rows={8}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition focus:border-[#6F5AA3] focus:outline-none dark:border-white/10 dark:bg-white/[0.04]"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                     Tip: Include steps to reproduce, error messages, and screenshots if applicable
                  </p>
                </div>

                {/* Attachments */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Attachments
                  </label>
                  <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-white/10 dark:bg-white/[0.02]">
                    <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                    <label className="cursor-pointer text-sm font-semibold text-[#6F5AA3] hover:text-[#9D679F]">
                      Click to upload
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="sr-only"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
                          <div className="flex-1 truncate text-sm">{file.name}</div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6F5AA3] to-[#9D679F] px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
              >
                <Send size={16} />
                Submit Ticket
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Guidance Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Quick Help */}
            <div className="rounded-2xl border border-white/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center gap-2">
                <HelpCircle size={20} className="text-[#6F5AA3]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Quick Help</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="rounded-lg bg-[#6F5AA3]/5 p-3">
                  <div className="mb-1 font-semibold text-gray-900 dark:text-white"> Email Notification</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your ticket will be sent to our developer team via email at dev-team@hairahmedabad.com
                  </p>
                </div>
                
                <div className="rounded-lg bg-[#6F9F8F]/5 p-3">
                  <div className="mb-1 font-semibold text-gray-900 dark:text-white">️ Response Time</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Critical: Within 2 hours<br />
                    High: Within 24 hours<br />
                    Medium/Low: Within 2-3 days
                  </p>
                </div>

                <div className="rounded-lg bg-[#D88385]/5 p-3">
                  <div className="mb-1 font-semibold text-gray-900 dark:text-white"> Updates</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    You'll receive email notifications for all ticket updates and responses
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-white/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-[#C7923E]" />
                <h3 className="font-bold text-gray-900 dark:text-white">Best Practices</h3>
              </div>
              
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#6F5AA3]">✓</span>
                  <span>Be specific and detailed in your description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#6F5AA3]">✓</span>
                  <span>Include error messages or screenshots</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#6F5AA3]">✓</span>
                  <span>Mention steps to reproduce the issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[#6F5AA3]">✓</span>
                  <span>Choose appropriate priority level</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="rounded-2xl border border-[#6F5AA3]/20 bg-gradient-to-br from-[#6F5AA3]/10 to-[#9D679F]/10 p-5">
              <div className="mb-2 font-bold text-gray-900 dark:text-white">Need urgent help?</div>
              <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                For critical issues, contact our support team directly:
              </p>
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-[#6F5AA3]"> dev-team@hairahmedabad.com</div>
                <div className="font-semibold text-[#6F5AA3]"> +91 98765 43210</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
