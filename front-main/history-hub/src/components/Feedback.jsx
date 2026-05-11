import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

function Feedback({ user }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setFeedbacks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    // Усередині функції Feedback({ user })
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await addDoc(collection(db, "feedbacks"), {
                // Тепер використовуємо displayName, який ми встановили при реєстрації
                name: user.displayName || "Анонімний історик", 
                userId: user.uid,
                comment: comment,
                timestamp: serverTimestamp()
            });
            setComment('');
        } catch (error) {
            console.error("Помилка:", error);
        }
    };

    return (
        <section className="container">
            <h2>Відгуки</h2>
            <p>Ви пишете як: <strong>{user.email}</strong></p>
            
            <form onSubmit={handleSubmit} className="quiz-form">
                <textarea 
                    rows="3" 
                    placeholder="Ваш відгук..."
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
                ></textarea>
                <button type="submit" className="btn-submit" style={{ marginTop: '10px' }}>Надіслати</button>
            </form>

            <div style={{ marginTop: '30px' }}>
                {feedbacks.map((item) => (
                    <div key={item.id} className="feedback-item" style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                        <strong style={{ color: '#e67e22' }}>{item.name}</strong>
                        <p>{item.comment}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Feedback;