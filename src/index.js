import "dotenv/config";
import cors from "cors";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connect from "./database";
import { routes as mylinks } from "./links";
import { routes as myreports } from "./reports";

const app = express();

// Application Level Middlewares
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware
app.use("/link", mylinks);
app.use("/report", myreports);

// Database Connection with host
connect()
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`)
    )
  )
  .catch((error) => {
    console.log(`Error is found: MongoDB`);
  });
