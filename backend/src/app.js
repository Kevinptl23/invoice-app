import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoice.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/invoices", invoiceRoutes);

app.get("/", (req, res) => {
  res.send("app is running..");
});

export default app;