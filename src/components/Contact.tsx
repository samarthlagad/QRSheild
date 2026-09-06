import { useState, FormEvent } from 'react';
import { Send, CheckCircle2, ShieldCheck, Mail, Building, Lock } from 'lucide-react';

export function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-[#E5E5DC] bg-white/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#4338CA] font-semibold">
              Enterprise & Municipal Deployment
            </span>

            <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
              Protect Your Citizens and Customers From Quishing
            </h2>

            <p className="text-base text-[#61615B] leading-relaxed">
              Are you a municipal parking authority, hospitality group, or logistics enterprise seeing counterfeit stickers on your physical hardware? We deploy customized client-side telemetry, SDKs, and forensic enforcement.
            </p>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 text-sm text-[#1A1A1A]">
                <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E5E5DC] flex items-center justify-center text-[#4338CA]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#61615B] block font-mono">DIRECT INQUIRIES</span>
                  <span className="font-semibold">samarth.r.lagad@gmail.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#1A1A1A]">
                <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E5E5DC] flex items-center justify-center text-[#4338CA]">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#61615B] block font-mono">SOC 2 TYPE II AUDITED</span>
                  <span className="font-semibold">Air-gapped on-premise SDK available</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-[#1A1A1A]">
                <div className="w-8 h-8 rounded-lg bg-[#FAFAF8] border border-[#E5E5DC] flex items-center justify-center text-[#4338CA]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-[#61615B] block font-mono">PGP FINGERPRINT</span>
                  <span className="font-mono text-xs text-[#61615B]">4A91 2E9B 08C4 8821 FB90</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-[#E5E5DC] p-6 sm:p-8 paper-shadow">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-heading text-2xl text-[#1A1A1A]">
                  Pilot Request Transmitted
                </h3>
                <p className="text-sm text-[#61615B] max-w-sm mx-auto leading-relaxed">
                  Thank you. Our cyber threat intelligence team will review your deployment parameters and respond within 1 business day.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({ name: '', email: '', organization: '', message: '' });
                  }}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-[#FAFAF8] border border-[#E5E5DC] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F4F4F0] cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-mono font-semibold uppercase text-[#1A1A1A] mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E5E5DC] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-mono font-semibold uppercase text-[#1A1A1A] mb-1.5"
                    >
                      Work Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="jane@organization.gov"
                      className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E5E5DC] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-org"
                    className="block text-xs font-mono font-semibold uppercase text-[#1A1A1A] mb-1.5"
                  >
                    Organization / Municipal Authority
                  </label>
                  <input
                    id="contact-org"
                    type="text"
                    value={formState.organization}
                    onChange={(e) => setFormState({ ...formState, organization: e.target.value })}
                    placeholder="e.g. City Department of Transportation"
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E5E5DC] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-msg"
                    className="block text-xs font-mono font-semibold uppercase text-[#1A1A1A] mb-1.5"
                  >
                    Threat Vector Context & Notes *
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe where QR codes are deployed or suspected tampering incidents on physical infrastructure..."
                    className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E5E5DC] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#4338CA] focus:bg-white focus:ring-2 focus:ring-[#4338CA]/20 transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="btn-submit-contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#4338CA] text-white font-semibold text-sm hover:bg-[#3730A3] active:scale-[0.98] transition-all paper-shadow cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Encrypting & Transmitting...
                      </span>
                    ) : (
                      <>
                        <span>Request Pilot & Threat Evaluation</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
