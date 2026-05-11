import React from 'react';

function EventCard({ title, imgUrl, description }) {
    return (
        <article className="event-card">
            <img src={imgUrl} alt={title} style={{ width: '100%', borderRadius: '4px' }} />
            <h3>{title}</h3>
            <p>{description}</p>
        </article>
    );
}

export default EventCard;