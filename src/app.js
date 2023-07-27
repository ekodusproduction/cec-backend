import express from "express";
import superAdminRoutes from "./Routes/superAdminRoutes.js";
import studentRoutes from "./Routes/studentRoutes.js";
import centerRoutes from "./Routes/centerRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js"
import multer from "multer";
import cors from 'cors';
import courseRoutes from "./Routes/courseRoutes.js";
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

export const upload = multer({ dest: 'public/' })

app.use(cors({
    origin: "*",
    methods:["GET","PUT","DELETE","POST"],
    credentials:true,
}))

// app.use(expressCors({
//     allowedOrigins: ["*"]
//   }));
  

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
//     });

app.use("/api", studentRoutes)
app.use("/api", courseRoutes)
app.use("/api", categoryRoutes)

app.use("/api", superAdminRoutes)
app.use("/api", centerRoutes)
app.use("/public", express.static('public'))

export default app;