'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { trackContactFormSubmit } from '@/lib/analytics';

interface ContactFormProps {
  locale: string;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from('contact_requests')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          request_type: 'contact',
          service_type: 'general',
          message: formData.message || null,
          status: 'pending',
        }]);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      // Track form submission
      trackContactFormSubmit('contact');

      // Send email notification
      try {
        await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'general_inquiry',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }),
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err: any) {
      console.error('Form submission error:', err);
      const errorMessage = locale === 'es'
        ? `Error al enviar el mensaje: ${err.message || 'Por favor intenta de nuevo.'}`
        : `Error sending message: ${err.message || 'Please try again.'}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const labels = {
    title: locale === 'es' ? 'Envíanos un mensaje' : 'Send us a message',
    subtitle: locale === 'es'
      ? 'Responderemos a tu consulta en menos de 24 horas.'
      : "We'll respond to your inquiry within 24 hours.",
    name: locale === 'es' ? 'Nombre completo' : 'Full Name',
    email: locale === 'es' ? 'Correo electrónico' : 'Email Address',
    phone: locale === 'es' ? 'Teléfono / WhatsApp (opcional)' : 'Phone / WhatsApp (optional)',
    message: locale === 'es' ? 'Tu mensaje' : 'Your message',
    messagePlaceholder: locale === 'es'
      ? '¿En qué podemos ayudarte?'
      : 'How can we help you?',
    submit: locale === 'es' ? 'Enviar mensaje' : 'Send message',
    sending: locale === 'es' ? 'Enviando...' : 'Sending...',
    successTitle: locale === 'es' ? '¡Mensaje enviado!' : 'Message sent!',
    successMessage: locale === 'es'
      ? 'Gracias por contactarnos. Te responderemos en menos de 24 horas.'
      : 'Thank you for contacting us. We will respond within 24 hours.',
    sendAnother: locale === 'es' ? 'Enviar otro mensaje' : 'Send another message',
  };

  // Success state
  if (success) {
    return (
      <div className="text-center py-8 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{labels.successTitle}</h3>
        <p className="text-muted mb-6">{labels.successMessage}</p>
        <button
          onClick={() => setSuccess(false)}
          className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
        >
          {labels.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{labels.title}</h2>
        <p className="text-muted text-sm">{labels.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            {labels.name} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            {labels.email} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            {labels.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            {labels.message} *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            placeholder={labels.messagePlaceholder}
            className="w-full px-4 py-3 rounded-lg border border-default bg-white dark:bg-navy-900 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 text-white font-semibold bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {loading ? labels.sending : labels.submit}
        </button>
      </form>
    </div>
  );
}
