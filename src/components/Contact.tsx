import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { Mail, Phone, Linkedin, Github, Send, CheckCircle2, MapPin, AlertCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

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
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-orange-600 tracking-wider uppercase mb-2">Get in Touch</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-sm text-slate-600">
            Have a project in mind, an internship opportunity, or want to discuss software architecture? Drop a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-2xl p-8 border border-slate-200/80 shadow-lg space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="flex items-center gap-3.5 text-sm text-slate-700 hover:text-orange-600 transition-colors p-3 rounded-xl hover:bg-white/80"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">Email Address</span>
                    <span className="font-semibold text-slate-900">{portfolioData.personal.email}</span>
                  </div>
                </a>

                <a
                  href={`tel:${portfolioData.personal.phone}`}
                  className="flex items-center gap-3.5 text-sm text-slate-700 hover:text-orange-600 transition-colors p-3 rounded-xl hover:bg-white/80"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">Phone Number</span>
                    <span className="font-semibold text-slate-900">{portfolioData.personal.phone}</span>
                  </div>
                </a>

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
                <a
                  href={portfolioData.personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 glass-card hover:bg-white rounded-xl flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href={portfolioData.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 glass-card hover:bg-white rounded-xl flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-8 border border-slate-200/80 shadow-lg">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Accepted & Logged!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out. Your message has been validated and accepted by the server. Mohammed Abdul Vasil will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Send a Message</h3>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Your Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project or opportunity..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Validating & Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
