import express from "express";
import superAdminRoutes from "./Routes/superAdminRoutes.js";
import studentRoutes from "./Routes/studentRoutes.js";
import centerRoutes from "./Routes/centerRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import multer from "multer";
import cors from "cors";
import xss from "xss-clean";
import hpp from "hpp";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import courseRoutes from "./Routes/courseRoutes.js";
import qualificationRoutes from "./Routes/qualificationRotes.js";
import centerAdminRoutes from "./Routes/centerAdminRoutes.js";
import paymentsRoutes from "./Routes/paymentsRoutes.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any());

export const upload = multer({ dest: "public/" });

app.use(cors());
app.options("*", cors());
// app.options('/api/v1/tours/:id', cors());
// Serving static files
// Set security HTTP headers
app.use(helmet());
app.set('trust proxy', true)
// Development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
// Limit requests from same API

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use('/static', express.static(path.join(__dirname, '../public')))
console.log("path-------------------",path.join(__dirname, '../public'))
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api", studentRoutes);
app.use("/api", courseRoutes);
app.use("/api", categoryRoutes);
app.use("/api", superAdminRoutes);
app.use("/api", centerRoutes);
app.use("/api", qualificationRoutes);
app.use("/api", centerAdminRoutes);
app.use("/api", paymentsRoutes);




app.all("*", (req, res, next) => {
  return res
    .status(404)
    .send({ message: `Can't find ${req.originalUrl} on this server!` });
});
export default app;
