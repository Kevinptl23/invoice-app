import express from "express";
import {
  getInvoiceDetails,
  addPayment,
  archiveInvoice,
  restoreInvoice,
  createInvoice,
  addLineItem
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.get("/:id", getInvoiceDetails);
router.post("/payments/:id", addPayment);
router.post("/archive", archiveInvoice);
router.post("/restore", restoreInvoice);

// only for testing:
router.post("/create", createInvoice);
router.post("/:id", addLineItem);

export default router;