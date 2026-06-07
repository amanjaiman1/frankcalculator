'use client';

import { useState } from 'react';
import { SITE_EMAIL } from '@/lib/seo';

/**
 * Simple, backend-free contact form. On submit it opens the visitor's email
 * client with a pre-filled message to our support address. This keeps a real,
 * working contact method on the site without storing any personal data.
 */
export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
    const mailSubject = encodeURIComponent(subject || `Message from ${name || 'a visitor'}`);
    window.location.href = `mailto:${SITE_EMAIL}?subject=${mailSubject}&body=${body}`;
  };

  const field =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-electric-blue/50 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs text-gray-400 mb-1.5">Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-gray-400 mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            placeholder="you@email.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-xs text-gray-400 mb-1.5">Subject</label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={field}
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-xs text-gray-400 mb-1.5">Message</label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder="Write your message..."
        />
      </div>
      <button type="submit" className="glow-button px-6 py-3 text-sm w-full sm:w-auto">
        Send Message
      </button>
    </form>
  );
}
