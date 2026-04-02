import React, { useState, useMemo } from 'react';
import { ArrowLeft, CreditCard, X, CheckCircle, MessageCircle } from 'lucide-react';
import '../styles.css';

const ReservationPage = ({ event, onClose, onBack }) => {
  const [firstName, setFirstName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [wallet, setWallet] = useState('orange');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const code = useMemo(() => {
    const base = `${event?.id_event || 'event'}-${event?.titre || 'ticket'}`;
    let hash = 0;
    for (let i = 0; i < base.length; i++) hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
    const s = hash.toString(36).toUpperCase();
    return `EVT-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`.replace(/-+$/,'');
  }, [event?.id_event, event?.titre]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event?.id_event) {
      alert('Erreur: Aucun ID événement trouvé');
      return;
    }
    const amt = parseFloat(amount.replace(/,/g, '.'));
    if (!firstName.trim() || !address.trim() || !phone.trim() || !wallet || isNaN(amt) || amt <= 0) {
      alert('Veuillez renseigner les champs requis.');
      return;
    }
    setSubmitting(true);
    try {
      // Simuler l'envoi de la demande
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDone(true);
    } catch (e) {
      alert('Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  const messageOrganizer = async () => {
    // Simuler l'envoi de message à l'organisateur
    alert('Fonction de messagerie bientôt disponible');
  };

  if (!event) {
    return (
      <div className="reservation-page">
        <div className="reservation-header">
          <button onClick={onBack} className="back-btn">
            <ArrowLeft size={22} />
          </button>
          <h2>Réservation</h2>
          <button onClick={onClose} className="close-btn">
            <X size={22} />
          </button>
        </div>
        <div className="reservation-body">
          <p>Aucun événement sélectionné</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      <div className="reservation-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={22} />
        </button>
        <h2>Réserver un billet</h2>
        <button onClick={onClose} className="close-btn">
          <X size={22} />
        </button>
      </div>

      <div className="reservation-body">
        <h3 className="event-title">{event.titre || 'Titre de l\'événement'}</h3>

        {!done ? (
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
                placeholder="Prénom"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                placeholder="Adresse"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                placeholder="N° de téléphone du déposant"
                required
              />
            </div>

            <div className="wallet-selection">
              <label className="wallet-label">Mode de paiement:</label>
              <div className="wallet-row">
                <button
                  type="button"
                  onClick={() => setWallet('orange')}
                  className={`wallet-btn ${wallet === 'orange' ? 'active' : ''}`}
                >
                  <img 
                    src="/assets/mobile_money/orange_money.png" 
                    alt="Orange Money" 
                    className="wallet-logo"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setWallet('mvola')}
                  className={`wallet-btn ${wallet === 'mvola' ? 'mvola-active' : ''}`}
                >
                  <img 
                    src="/assets/mobile_money/mvola.png" 
                    alt="MVola" 
                    className="wallet-logo"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setWallet('airtel')}
                  className={`wallet-btn ${wallet === 'airtel' ? 'airtel-active' : ''}`}
                >
                  <img 
                    src="/assets/mobile_money/airtel_money.png" 
                    alt="Airtel Money" 
                    className="wallet-logo airtel-logo"
                  />
                </button>
              </div>
            </div>

            <div className="form-group">
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                placeholder="Montant d'achat"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="submit-btn"
            >
              <CreditCard size={20} />
              {submitting ? 'Traitement...' : 'Réserver'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="secondary-btn"
            >
              <X size={18} />
              Annuler
            </button>
          </form>
        ) : (
          <div className="success-message">
            <CheckCircle size={48} className="success-icon" />
            <h3>Demande de billet envoyée</h3>
            <p>L'organisateur vous enverra le code QR après validation de l'achat.</p>
            <button onClick={onBack} className="submit-btn">
              <X size={20} />
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationPage;
