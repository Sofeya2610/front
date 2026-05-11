const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
    origin: 'https://front-o43frp6j3-sofi-slabnulp-projects.vercel.app'
})); // Дозволяємо запити з фронтенду [cite: 106, 302]
app.use(express.json());

// --- MIDDLEWARE ДЛЯ ЗАХИСТУ МАРШРУТІВ [cite: 194, 281] ---
const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// --- МАРШРУТИ АВТЕНТИФІКАЦІЇ [cite: 177, 277] ---

// Реєстрація [cite: 278]
app.post('/api/auth/register', async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12); // Хешування пароля [cite: 181, 307]
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name }
        });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, userId: user.id });
    } catch (err) {
        res.status(400).json({ message: 'Користувач вже існує' });
    }
});

// Вхід [cite: 279]
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, name: user.name });
    } else {
        res.status(401).json({ message: 'Невірні дані' });
    }
});

// --- ВАРІАНТ 15: РОБОТА З ТЕСТАМИ [cite: 455] ---

// GET: Отримання середньої оцінки (Завдання 3) [cite: 459]
app.get('/api/items', async (req, res) => {
    try {
        const questions = await prisma.item.findMany();
        
        // Якщо база порожня, повертаємо хоча б одне питання, щоб програма не "лягла"
        if (questions.length === 0) {
            return res.json([
                {
                    id: 1,
                    question: "У якому році було проголошено незалежність України?",
                    options: '["1989", "1990", "1991", "1996"]', // Це рядок!
                    correctAnswer: "1991"
                }
            ]);
        }

        res.json(questions);
    } catch (err) {
        console.error("ПОМИЛКА БД:", err);
        res.status(500).json({ message: "Помилка завантаження тестів" });
    }
});




// POST: Збереження результату тесту (Завдання 4) [cite: 461]
app.post('/api/test-results', authenticate, async (req, res) => {
    try {
        const { score } = req.body;
        const result = await prisma.testResult.create({
            data: {
                score: Number(score),
                userId: req.userId
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/test-results/average', authenticate, async (req, res) => {
    try {
        const aggregate = await prisma.testResult.aggregate({
            where: { userId: req.userId },
            _avg: { score: true }
        });
        // Повертаємо середнє значення, або 0, якщо тестів ще немає
        res.json({ averageScore: aggregate._avg.score || 0 });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




// Запуск сервера [cite: 108, 275]
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));