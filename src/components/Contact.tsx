import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { Mail, Phone, Linkedin, Github, Send, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';
import { fadeUp, fadeLeft, fadeRight, scaleIn, staggerContainer, sectionHeader, VIEWPORT, buttonTap } from '../lib/motionVariants';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionResult, setSubmissionResult] = useState<{ status: string; message: string; note?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');
      setSubmissionResult(data);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-100/50 border-t border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          variants={sectionHeader}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Get in Touch</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-sm text-slate-600">
            Have a project in mind, an internship opportunity, or want to discuss software architecture? Drop a message below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">

          {/* Contact Details */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="lg:col-span-5 space-y-6"
          >
            <div className="glass-card rounded-2xl p-8 border border-slate-200/80 shadow-lg space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>

              <div className="space-y-4">
                {[
                  { href: `mailto:${portfolioData.personal.email}`, icon: <Mail className="w-5 h-5" />, label: 'Email Address', value: portfolioData.personal.email },
                  { href: `tel:${portfolioData.personal.phone}`, icon: <Phone className="w-5 h-5" />, label: 'Phone Number', value: portfolioData.personal.phone },
                ].map(({ href, icon, label, value }) => (
                  <motion.a
                    key={href}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    href={href}
                    className="flex items-center gap-3.5 text-sm text-slate-700 hover:text-orange-600 transition-colors p-3 rounded-xl hover:bg-white/80"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                      {icon}
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 font-medium">{label}</span>
                      <span className="font-semibold text-slate-900">{value}</span>
                    </div>
                  </motion.a>
                ))}

                <div className="flex items-center gap-3.5 text-sm text-slate-700 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">Location</span>
                    <span className="font-semibold text-slate-900">{portfolioData.personal.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/60 flex items-center gap-3">
                {[
                  { href: portfolioData.personal.github, icon: <Github className="w-4 h-4" />, label: 'GitHub' },
                  { href: portfolioData.personal.linkedin, icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                ].map(({ href, icon, label }) => (
                  <motion.a
                    key={href}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 glass-card hover:bg-white rounded-xl flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                  >
                    {icon}
                    <span>{label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="lg:col-span-7"
          >
            <div className="glass-card rounded-2xl p-8 border border-slate-200/80 shadow-lg">
              {submitted ? (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="py-12 text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 24, delay: 0.1 }}
                    className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {submissionResult?.status === 'accepted_by_provider' ? 'Message Delivered to Provider' : 'Message Validated & Persisted'}
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    {submissionResult?.message || 'Thank you for reaching out. Your message has been validated and recorded.'}
                  </p>
                  {submissionResult?.note && (
                    <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-500 font-mono text-left">
                      <strong>Status:</strong> {submissionResult.status}<br />
                      <strong>Note:</strong> {submissionResult.note}
                    </div>
                  )}
                  <motion.button
                    {...buttonTap}
                    onClick={() => { setSubmitted(false); setSubmissionResult(null); }}
                    className="mt-4 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Send a Message</h3>

                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project or opportunity..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none transition-shadow"
                    />
                  </div>

                  <motion.button
                    {...buttonTap}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                        />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
