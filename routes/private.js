import express from 'express';
import { PrismaClient } from '../prisma/generated/index.js';
const prisma = new PrismaClient();
const router = express.Router();

router.get('/users', async (req, res) => {  
  try {

    const user = await prisma.user.findMany({ omit: { password: true } });
    
    res.json(user);

  } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;