import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function Timeline() {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('Всі');
    const [loading, setLoading] = useState(true);

    const periods = ['Всі', 'Середньовіччя', 'Новий час', 'Новітній час'];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Завантажуємо події з Firebase, відсортовані за роком
                const q = query(collection(db, "events"), orderBy("year", "asc"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error("Помилка завантаження подій: ", error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = filter === 'Всі' 
        ? events 
        : events.filter(event => event.period === filter);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Завантаження хронології з хмари...</div>;
    
    // Якщо база порожня
    if (events.length === 0) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>База даних порожня. Додайте події у Firebase!</div>;

    return (
        <section className="container">
            <h2>Хронологія подій</h2>
            <div style={{ marginBottom: '20px' }}>
                {periods.map(period => (
                    <button 
                        key={period} 
                        onClick={() => setFilter(period)}
                        style={{ marginRight: '10px', padding: '8px 15px', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', backgroundColor: filter === period ? '#e67e22' : '#2c3e50' }}
                    >
                        {period}
                    </button>
                ))}
            </div>
            
            <div className="timeline-wrapper">
                {filteredEvents.map(event => (
                    <div key={event.id} className="timeline-item">
                        <span className="date">{event.year} рік</span>
                        <span className="event">{event.title}</span>
                        {/* Додав відображення деталей, якщо вони є в базі */}
                        {event.details && <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>{event.details}</p>}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Timeline;