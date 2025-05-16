import mongoose from 'mongoose';
import { MONGODB_URI } from './env';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB conectado com sucesso');
  } catch (err) {
    console.error('Erro na conexão com MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;