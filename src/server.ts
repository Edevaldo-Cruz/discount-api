import app from './app';
import connectDB from './config/db';
import { PORT, NODE_ENV } from './config/env';

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} no modo ${NODE_ENV}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Erro: ${err.message}`);
  server.close(() => process.exit(1));
});