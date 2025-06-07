import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET


const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Armazena os dados do usuário decodificado na requisição
    next(); // Chama o próximo middleware ou rota

  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}
 export default auth;