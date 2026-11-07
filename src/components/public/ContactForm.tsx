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
      toast.success('Draft opened in your email client.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-dark p-8 sm:p-10 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#E8D2B5]">Send a Direct Message</h2>
        <p className="mt-1 text-sm text-[#E8D2B5]/70">
          Reach out directly regarding full-time roles, board advisory, or consulting.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-xs font-bold tracking-wider uppercase text-[#E8D2B5]/60">
            Full Name <span className="text-[#E8D2B5]/40">*</span>
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
          <label htmlFor="contact-email" className="mb-2 block text-xs font-bold tracking-wider uppercase text-[#E8D2B5]/60">
            Work Email <span className="text-[#E8D2B5]/40">*</span>
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

      <div>
        <label htmlFor="contact-subject" className="mb-2 block text-xs font-bold tracking-wider uppercase text-[#E8D2B5]/60">
          Subject / Scope
        </label>
        <input
          id="contact-subject"
          type="text"
          className="contact-input"
          placeholder="e.g. Product Leadership Role / Advisory"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-xs font-bold tracking-wider uppercase text-[#E8D2B5]/60">
          Message <span className="text-[#E8D2B5]/40">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className="contact-input resize-y min-h-[120px]"
          placeholder="Briefly describe your company, challenge, or the scope of the opportunity..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>

      <button
        id="contact-submit"
        type="submit"
        disabled={loading}
        className="btn-cream-on-burgundy w-full py-3.5 text-sm font-bold tracking-wide"
      >
        {loading ? 'Preparing…' : 'Send Message →'}
      </button>

      <div className="flex items-center justify-center gap-2 text-center text-xs text-[#E8D2B5]/50">
        <span>🔒 Confidential & direct communication</span>
      </div>
    </form>
  );
}
