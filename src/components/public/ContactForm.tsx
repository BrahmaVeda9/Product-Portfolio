'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // NOTE: Wire up to your preferred email service (Resend, SendGrid, etc.)
      // For now, opens mailto as a placeholder
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      toast.success('Message composed! Your mail client should have opened.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="exec-card p-8 sm:p-10 space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Send an Executive Inquiry</h2>
        <p className="mt-1 text-xs text-zinc-400">
          Direct communication for product leadership roles, strategic advisory, or enterprise initiatives.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-xs font-medium tracking-wide uppercase text-zinc-400">
            Full Name <span className="text-zinc-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            placeholder="e.g. Sarah Jenkins"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-xs font-medium tracking-wide uppercase text-zinc-400">
            Professional Email <span className="text-zinc-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-xs font-medium tracking-wide uppercase text-zinc-400">
          Executive Summary / Message <span className="text-zinc-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className="w-full resize-y rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
          placeholder="Briefly describe your company, scope of leadership opportunity, or strategic challenge..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>

      <button
        id="contact-submit"
        type="submit"
        disabled={loading}
        className="exec-btn-primary w-full py-3.5 text-sm font-semibold tracking-wide"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
            Dispatching Message…
          </>
        ) : (
          'Send Direct Message →'
        )}
      </button>

      <div className="flex items-center justify-center gap-2 pt-1 text-center text-xs text-zinc-500">
        <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Confidential & direct communication</span>
      </div>
    </form>
  );
}
