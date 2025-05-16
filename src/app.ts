import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import usuarioRoutes from "./routes/usuarioRoutes";
import empresaRoutes from "./routes/empresaRoutes";
import descontoRoutes from "./routes/descontoRoutes";
import { ErrorHandler, handleErrors } from "@utils/errorHandler";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.errorHandling();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(mongoSanitize());

    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    });
    this.app.use(limiter);
  }

  private routes(): void {
    this.app.use("/api/v1/usuarios", usuarioRoutes);
    this.app.use("/api/v1/empresas", empresaRoutes);
    this.app.use("/api/v1/descontos", descontoRoutes);
  }

  private errorHandling(): void {
    this.app.use(handleErrors);
  }
}

export default new App().app;
