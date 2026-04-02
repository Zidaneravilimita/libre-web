import React from 'react';
import { MapPin, Users, Clock } from 'lucide-react';
import { format } from 'date-fns';

const EventCard = ({ event, className = '' }) => {
  return (
    <div className={`event-card ${className}`}>
      <div className="event-image">
        <img src={event.image || '/api/placeholder/300/200'} alt={event.title} />
        <div className="event-date">
          <span className="date-day">{format(new Date(event.date), 'dd')}</span>
          <span className="date-month">{format(new Date(event.date), 'MMM')}</span>
        </div>
      </div>
      
      <div className="event-content">
        <div className="event-category">{event.category}</div>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="event-detail">
            <Clock size={16} />
            <span>{format(new Date(event.date), 'HH:mm')}</span>
          </div>
          <div className="event-detail">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="event-detail">
            <Users size={16} />
            <span>{event.attendees || 0} participants</span>
          </div>
        </div>
        
        <div className="event-footer">
          <span className="event-price">
            {event.price === 0 ? 'Gratuit' : `${event.price}€`}
          </span>
          <button 
            className="event-btn"
            onClick={() => console.log(`Réservation pour ${event.title}`)}
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
