import React, { useState } from 'react';

function Auth({ user, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    // Адреса твого локального сервера
    const API_URL = 'https://server-vw7d.onrender.com/api';

    const handleAuth = async (e) => {
        e.preventDefault();
        
        // Визначаємо шлях залежно від режиму (вхід або реєстрація)
        const endpoint = isRegistering ? '/auth/register' : '/auth/login';
        
        const body = isRegistering 
            ? { email, password, name: `${firstName} ${lastName}` }
            : { email, password };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                // Зберігаємо токен та ім'я в браузері [cite: 214]
                localStorage.setItem('token', data.token);
                const displayName = data.name || (isRegistering ? `${firstName} ${lastName}` : 'Користувач');
                localStorage.setItem('userName', displayName);
                
                // Оновлюємо стан в App.js, щоб інтерфейс змінився на "Профіль"
                if (setUser) {
                    setUser({ email, displayName });
                }
                
                alert(isRegistering ? 'Реєстрація успішна!' : 'Вхід виконано!');
            } else {
                alert('Помилка: ' + data.message);
            }
        } catch (error) {
            console.error("Помилка автентифікації:", error);
            alert('Не вдалося з’єднатися з сервером');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        if (setUser) setUser(null);
    };

    if (user) {
        return (
            <section className="container" style={{ textAlign: 'center', marginTop: '40px' }}>
                <h2>Особистий кабінет</h2>
                <p>Вітаємо, <strong>{user.displayName || 'Користувач'}</strong>!</p>
                <p>Ваш статус: Автентифіковано через Node.js</p>
                <button className="btn-submit" onClick={handleLogout}>Вийти</button>
            </section>
        );
    }

    return (
        <section className="container" style={{ marginTop: '40px', maxWidth: '500px' }}>
            <h2>{isRegistering ? 'Створити профіль' : 'Вхід'}</h2>
            <form onSubmit={handleAuth} className="quiz-form">
                {isRegistering && (
                    <>
                        <div className="question">
                            <label>Ім'я:</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </div>
                        <div className="question">
                            <label>Прізвище:</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </div>
                    </>
                )}
                <div className="question">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="question">
                    <label>Пароль:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn-submit" style={{ width: '100%' }}>
                    {isRegistering ? 'Зареєструватися' : 'Увійти'}
                </button>
            </form>
            <button 
                onClick={() => setIsRegistering(!isRegistering)} 
                style={{ background: 'none', border: 'none', color: '#e67e22', cursor: 'pointer', display: 'block', margin: '15px auto' }}
            >
                {isRegistering ? 'Вже маєте акаунт?' : 'Немає акаунту? Створіть його зараз'}
            </button>
        </section>
    );
}

export default Auth;