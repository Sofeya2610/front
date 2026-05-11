import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Імпорти Firebase більше не потрібні в App.js, якщо ми юзаємо свій Node.js
import Timeline from './components/Timeline';
import Quiz from './components/Quiz';
import Feedback from './components/Feedback';
import Auth from './components/Auth';
import './style.css';

const HomePage = () => (
    <section className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h1>Вітаємо у MyHistoryZNOHub!</h1>
        <p>Ваш інтерактивний провідник у світ історії України.</p>
        <div style={{ marginTop: '30px' }}>
            <Link to="/events" className="btn-primary" style={{ textDecoration: 'none' }}>Почати подорож</Link>
        </div>
    </section>
);

const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Перевіряємо локальне сховище при завантаженні сторінки
        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('userName');
        
        if (token && userName) {
            setUser({ displayName: userName });
        }
        setLoading(false);
    }, []);

    if (loading) return <div className="container">Завантаження...</div>;

    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <header>
                    <div className="container header-content">
                        <div className="logo">
                            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>MyHistoryZNOHub</Link>
                        </div>
                        <nav>
                            <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
                                <li><Link to="/">Головна</Link></li>
                                <li><Link to="/events">Події</Link></li>
                                <li><Link to="/quiz">Тест</Link></li>
                                <li><Link to="/feedback">Відгуки</Link></li>
                                <li><Link to="/auth" style={{ color: '#e67e22' }}>
                                    {user ? 'Профіль' : 'Вхід'}
                                </Link></li>
                            </ul>
                        </nav>
                    </div>
                </header>

                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        
                        {/* КЛЮЧОВИЙ МОМЕНТ: передаємо setUser в Auth */}
                        <Route path="/auth" element={<Auth user={user} setUser={setUser} />} />
                        
                        <Route path="/events" element={<Timeline />} /> 

                        <Route path="/quiz" element={
                            <ProtectedRoute user={user}>
                                <Quiz />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/feedback" element={
                            <ProtectedRoute user={user}>
                                <Feedback user={user} />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>

                <footer>
                    <div className="container footer-content">
                        <p>&copy; 2026 MyHistoryZNOHub.</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
