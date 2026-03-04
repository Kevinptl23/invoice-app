import Invoice from "../models/invoice.model.js";
import InvoiceLine from "../models/invoiceLine.model.js";
import Payment from "../models/payment.model.js";

export const getInvoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ 
        message: "Invoice not found" 
      });
    }

    const lineItems = await InvoiceLine.find({ invoiceId: id });

    // Calculate total
    const total = lineItems.reduce((sum, item) => {
      return sum + item.lineTotal;
    }, 0);

    const payments = await Payment.find({ invoiceId: id });

    // Calculate amount paid
    const amountPaid = payments.reduce((sum, payment) => {
      return sum + payment.amount;
    }, 0);

    const balanceDue = total - amountPaid;

    const status = balanceDue === 0 ? "PAID" : "DRAFT";

    res.json({
      invoice,
      lineItems,
      payments,
      total,
      amountPaid,
      balanceDue,
      status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// add a payment to invoice
export const addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        message: "Amount must be greater than 0" 
      });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ 
        message: "Invoice not found" 
      });
    }

    const lineItems = await InvoiceLine.find({ invoiceId: id });
    const total = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const payments = await Payment.find({ invoiceId: id });
    const amountPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const balanceDue = total - amountPaid;

    if (amount > balanceDue) {
      return res.status(400).json({
        message: "Payment exceeds remaining balance",
      });
    }

    const newPayment = await Payment.create({
      invoiceId: id,
      amount,
    });

    res.status(201).json({
      message: "Payment added successfully",
      payment: newPayment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const archiveInvoice = async (req, res) => {
  try {
    const { id } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice archived successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const restoreInvoice = async (req, res) => {
  try {
    const { id } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { isArchived: false },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// only for testing purpose:
export const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, customerName, issueDate, dueDate } = req.body;

    if (!invoiceNumber || !customerName || !issueDate || !dueDate) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(400).json({ 
        message: "Invoice number already exists" 
      });
    }

    const invoice = await Invoice.create({
      invoiceNumber,
      customerName,
      issueDate,
      dueDate,
    });

    res.status(201).json({
        success: true,
        invoice
    });
  } catch (error) {
    res.status(500).json({ 
        message: "Server error" 
    });
  }
};

export const addLineItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, quantity, unitPrice } = req.body;

    if (!description || !quantity || !unitPrice) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ 
        message: "Invoice not found" 
      });
    }

    const lineItem = await InvoiceLine.create({
      invoiceId: id,
      description,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity
    });

    res.status(201).json({
        success: true,
        lineItem
    });
  } catch (error) {
    res.status(500).json({ 
        message: "Server error" 
    });
  }
};