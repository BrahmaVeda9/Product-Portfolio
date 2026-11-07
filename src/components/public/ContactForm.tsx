'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const subjectLine = encodeURIComponent(form.subject || `Portfolio enquiry from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`);
      window.open(`mailto:?subject=${subjectLine}&body=${body}`, '_blank');
      toast.success('Message composed! Your mail client should have opened.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-dark p-8 sm:p-10 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Send a Direct Message</h2>
        <p className="mt-1 text-sm text-zinc-400">
          For leadership roles, advisory, or enterprise initiatives — I respond within 24–48 hours.
        </p>
      </div>

      {/* Name & Email */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-xs font-semibold tracking-wider uppercase text-zinc-400">
            Full Name <span className="text-zinc-600">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            className="contact-input"
            placeholder="e.g. Sarah Jenkins"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-xs font-semibold tracking-wider uppercase text-zinc-400">
            Professional Email <span className="text-zinc-600">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className="contact-input"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="mb-2 block text-xs font-semibold tracking-wider uppercase text-zinc-400">
          Subject / Opportunity Type
        </label>
        <input
          id="contact-subject"
          type="text"
          className="contact-input"
          placeholder="e.g. VP of Product Role at Acme Corp"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="mb-2 block text-xs font-semibold tracking-wider uppercase text-zinc-400">
          Message <span className="text-zinc-600">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className="contact-input resize-y min-h-[120px]"
          placeholder="Briefly describe your company, the scope of the opportunity, or strategic challenge you'd like to explore..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>

      {/* Submit */}
      <button
        id="contact-submit"
        type="submit"
        disabled={loading}
        className="btn-gold w-full py-3.5 text-sm font-semibold tracking-wide"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" />
            Sending…
          </>
        ) : (
          'Send Message →'
        )}
      </button>

      {/* Trust note */}
      <div className="flex items-center justify-center gap-2 text-center text-xs text-zinc-500">
        <svg className="h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Confidential & direct communication</span>
      </div>
    </form>
  );
}
