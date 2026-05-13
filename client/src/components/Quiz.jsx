import React, { useState, useEffect } from 'react';

function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(null);
    const [averageScore, setAverageScore] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Адреса твого бекенду (зміни на URL від Render після деплою)
    const API_URL = 'https://server-1-yyut.onrender.com';

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                // 1. Завантаження питань (Завдання 2)
                const questionsRes = await fetch(`${API_URL}/items`);
                const questionsData = await questionsRes.json();
                setQuestions(questionsData);

                // 2. Отримання середньої оцінки (Завдання 3 Варіанту 15)
                const avgRes = await fetch(`${API_URL}/test-results/average`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const avgData = await avgRes.json();
                setAverageScore(avgData.averageScore);

                setLoading(false);
            } catch (error) {
                console.error("Помилка завантаження даних: ", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let currentScore = 0;
        const formData = new FormData(e.target);
        const token = localStorage.getItem('token');
        
        // Розрахунок результату локально
        questions.forEach((q) => {
            if (formData.get(q.id.toString()) === q.correctAnswer) {
                currentScore += 1;
            }
        });

        try {
            // 3. Збереження результату у базі даних (Завдання 4 Варіанту 15)
            const response = await fetch(`${API_URL}/test-results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ score: currentScore })
            });

            if (response.ok) {
                setScore(currentScore);
                // Оновлюємо середню оцінку після проходження
                const avgRes = await fetch(`${API_URL}/test-results/average`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const avgData = await avgRes.json();
                setAverageScore(avgData.averageScore);
            }
        } catch (error) {
            alert("Помилка збереження результату");
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Завантаження тесту з сервера...</div>;
    
    if (questions.length === 0) return <div className="container" style={{ textAlign: 'center', padding: '50px' }}>Тести відсутні у базі даних.</div>;

    return (
        <section className="container">
            {/* Відображення середньої оцінки зверху (Вимога Варіанту 15) [cite: 460] */}
            <div style={{ 
                background: '#2c3e50', 
                color: 'white', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px', 
                textAlign: 'center' 
            }}>
                <h3>Ваш середній бал: <span style={{ color: '#e67e22' }}>{Number(averageScore).toFixed(2)}</span></h3>
            </div>

            <h2>Перевір свої знання</h2>
            <form onSubmit={handleSubmit} className="quiz-form">
                {questions.map((q, index) => (
                    <div key={q.id} className="question" style={{ marginBottom: '20px', padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <p><strong>{index + 1}. {q.question}</strong></p>
                        {q.options && JSON.parse(q.options).map((option, idx) => (
                            <label key={idx} style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
                                <input type="radio" name={q.id.toString()} value={option} required style={{ marginRight: '10px' }} />
                                {option}
                            </label>
                        ))}
                    </div>
                ))}
                <button type="submit" className="btn-submit" style={{ marginTop: '15px', width: '100%' }}>Завершити тест</button>
            </form>

            {score !== null && (
                <div style={{ marginTop: '30px', textAlign: 'center', padding: '20px', background: '#eafaf1', borderRadius: '8px', border: '2px solid #27ae60' }}>
                    <h3>Твій результат: {score} з {questions.length}</h3>
                    <p>Результат збережено у профілі!</p>
                </div>
            )}
        </section>
    );
}

export default Quiz;