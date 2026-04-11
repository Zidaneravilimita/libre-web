import React, { useState } from 'react';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
import '../styles.css';

const ContactAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    setSubmitting(true);
    try {
      // Simuler l'envoi du message
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="contact-admin-section">
        <div className="contact-admin-container">
          <div className="contact-success">
            <Mail size={48} className="success-icon" />
            <h2>Message envoyé avec succès!</h2>
            <p>Nous vous répondrons dans les plus brefs délais.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="btn-primary"
            >
              Envoyer un autre message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-admin-section">
      <div className="contact-admin-container">
        <div className="contact-header">
          <div className="contact-icon">
            <MessageSquare size={32} />
          </div>
          <div className="contact-title">
            <h2>Contactez l'administrateur</h2>
            <p>Une question ? Une suggestion ? Envoyez-nous un message !</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                <User size={16} />
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Sujet</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Sujet de votre message"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Votre message..."
              rows="5"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="submit-contact-btn"
          >
            <Send size={20} />
            {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactAdmin;
