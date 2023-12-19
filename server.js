import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import dbConnection from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
// Environment Variables
dotenv.config();

// App and PORT Setup
const app = express();
const PORT = process.env.PORT || 8080;

// Database Connection
dbConnection();

// Set Up Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, (req, res) => {
  console.log(`     Server is running on ${PORT}     `.bgCyan.black);
});
