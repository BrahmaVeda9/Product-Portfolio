import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database.types';
import type { Metadata } from 'next';
import ContactForm from '@/components/public/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Start a Conversation',
  description: 'Connect regarding executive PM roles, advisory engagements, and product leadership.',
};

async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
  return data as Profile | null;
}

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <>
      {/* ══════════════════════════════════════════════════
          CONTACT SECTION — Deep Burgundy (#590907)
          Intentionally deep and rich for final engagement
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#590907] pt-32 pb-24 text-[#E8D2B5] min-h-screen flex flex-col justify-center">
        <div className="mx-auto max-w-5xl px-6 w-full">
          
          {/* Header */}
          <div className="mb-12 max-w-2xl">
            <span className="section-label-burgundy mb-3 block w-fit">Direct Dialogue</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#E8D2B5] leading-tight">
              Let's Start a Conversation.
            </h1>
            <p className="mt-3 text-base sm:text-lg text-[#E8D2B5]/80 leading-relaxed">
              Open to senior and executive product leadership roles, strategic advisory, and AI product architecture engagements.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start">

            {/* Left: Communication Channels on Burgundy */}
            <div className="space-y-4 lg:col-span-5">
              {profile?.email && (
                <div className="card-dark p-5 flex items-center gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E8D2B5] text-[#590907] text-lg font-bold">
                    ✉
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D2B5]/50 block">Direct Email</span>
                    <a href={`mailto:${profile.email}`} className="font-semibold text-sm text-[#E8D2B5] hover:underline">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="card-dark p-5 flex items-center gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#A5A79B]/25 text-[#E8D2B5] text-lg">
                    📍
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D2B5]/50 block">Current Location</span>
                    <p className="font-semibold text-sm text-[#E8D2B5]">{profile.location}</p>
                  </div>
                </div>
              )}

              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-dark p-5 flex items-center gap-4 group cursor-pointer block"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E8D2B5]/15 text-[#E8D2B5] text-lg font-bold">
                    in
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D2B5]/50 block">Professional Network</span>
                    <p className="font-semibold text-sm text-[#E8D2B5] group-hover:underline">LinkedIn Profile ↗</p>
                  </div>
                </a>
              )}

              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-dark p-5 flex items-center gap-4 group cursor-pointer block"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E8D2B5]/15 text-[#E8D2B5] text-lg font-bold">
                    📄
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8D2B5]/50 block">Documentation</span>
                    <p className="font-semibold text-sm text-[#E8D2B5] group-hover:underline">Download Executive Resume ↓</p>
                  </div>
                </a>
              )}

              {/* Status Note */}
              <div className="p-4 rounded-xl border border-[#E8D2B5]/15 bg-[#E8D2B5]/05 text-xs text-[#E8D2B5]/75 leading-relaxed">
                <span className="font-bold text-[#E8D2B5] block mb-1">Response Time:</span>
                I typically respond within 24 to 48 hours for verified leadership or advisory inquiries.
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
