import express from 'express';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';
import auth from './middlewares/auth.js';
const app = express();
app.use(express.json());

app.use("/api", publicRoutes),
app.use("/api", auth, privateRoutes)

app.listen(3000, () => {
  console.log('Server rodando na porta 3000');
});