
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

// Імпортуємо твої старі дані (переконайся, що файл data.js існує!)
import { eventsData, quizData } from '../data'; 

function DataUploader() {
    const [status, setStatus] = useState('Очікування...');

    const uploadEvents = async () => {
        setStatus('Завантаження подій...');
        try {
            for (const item of eventsData) {
                await addDoc(collection(db, 'events'), {
                    title: item.title,
                    year: Number(item.year), 
                    period: item.period,
                    details: item.details || ""
                });
            }
            setStatus('✅ Всі події успішно завантажено в нову базу!');
        } catch (error) {
            console.error(error);
            setStatus('❌ Помилка завантаження подій: ' + error.message);
        }
    };

    const uploadQuiz = async () => {
        setStatus('Завантаження питань тесту...');
        try {
            for (const item of quizData) {
                await addDoc(collection(db, 'quiz'), {
                    question: item.question,
                    options: item.options,
                    correctAnswer: item.correctAnswer
                });
            }
            setStatus('✅ Всі питання успішно завантажено в нову базу!');
        } catch (error) {
            console.error(error);
            setStatus('❌ Помилка завантаження тесту: ' + error.message);
        }
    };

    return (
        <div style={{ padding: '20px', border: '2px dashed red', margin: '20px', textAlign: 'center', backgroundColor: '#fff3f3' }}>
            <h2>🛠️ Технічна панель: Завантаження даних у новий Firebase</h2>
            <p>Статус: <strong>{status}</strong></p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
                <button onClick={uploadEvents} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Завантажити події
                </button>
                <button onClick={uploadQuiz} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Завантажити тести
                </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'red', marginTop: '10px' }}>Натискай кнопки ЛИШЕ ОДИН РАЗ!</p>
        </div>
    );
}

export default DataUploader;