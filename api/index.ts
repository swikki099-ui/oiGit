import expressModule from "express";
import { registerRoutes } from "../server/routes";

const express = (expressModule as any).default || expressModule;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
registerRoutes(app);

export default app;
