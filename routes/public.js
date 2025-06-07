import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../prisma/generated/index.js';
const prisma = new PrismaClient();
const routes = express.Router();


// criare um usuario
routes.post('/crateruser', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, e password são obrigatórios' });
    }
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password : hasPassword
        }
    });
    res.status(201).json(user);
});

//Login do usuario
routes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e password são obrigatórios' });
    }
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user?.email) {
        return res.status(404).json({ error: 'E-mail não encontrado' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha inválida' });
    }

    // criar token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1m'
    });

    res.status(200).json({ message: 'Login bem-sucedido', token });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
        
    }
});


export default routes
