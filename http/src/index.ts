import express from "express";
import docsRouter from "./routes/docs.routes";
import collaborationRouter from "./routes/collaboration.routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./utils/errorHelper";
import { initRedisListener } from "../src/services/saveToDb";
import { debounceAsync } from "../src/utils/debouncer";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(errorHandler);

app.use(cookieParser());

app.use("/docs", docsRouter);
app.use("/collaboration", collaborationRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

const debouncedInit = debounceAsync(initRedisListener, 3000);
debouncedInit(); // Will call it once after 3s if not called again in the meantime

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

export default app;
