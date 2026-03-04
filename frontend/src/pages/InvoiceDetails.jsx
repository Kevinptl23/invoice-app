import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InvoiceDetails = () => {
  const { id } = useParams();

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInvoice = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/invoices/${id}`
      );
      setInvoiceData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleAddPayment = async () => {
    setErrorMessage("");

    const amount = Number(paymentAmount);

    if (!amount || amount <= 0) {
      setErrorMessage("Enter valid amount greater than 0");
      return;
    }

    if (amount > invoiceData.balanceDue) {
      setErrorMessage("Amount exceeds balance due");
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `http://localhost:8080/api/invoices/payments/${id}`,
        { amount }
      );

      setShowModal(false);
      setPaymentAmount("");
      fetchInvoice();
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.message || "Server error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!invoiceData) {
    return <div className="p-6">Invoice not found</div>;
  }

  const {
    invoice,
    lineItems,
    payments,
    total,
    amountPaid,
    balanceDue,
    status,
  } = invoiceData;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Invoice #{invoice.invoiceNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              Customer: {invoice.customerName}
            </p>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              status === "PAID"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Dates */}
        <div className="mb-6 text-sm text-gray-600">
          <p>Issue Date: {new Date(invoice.issueDate).toDateString()}</p>
          <p>Due Date: {new Date(invoice.dueDate).toDateString()}</p>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Line Items</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Description</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">₹ {item.unitPrice}</td>
                  <td className="p-3 font-medium">
                    ₹ {item.lineTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>₹ {total}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span>₹ {amountPaid}</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Balance Due:</span>
              <span>₹ {balanceDue}</span>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Payments</h2>

            {balanceDue > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700"
              >
                Add Payment
              </button>
            )}
          </div>

          {payments.length === 0 ? (
            <p className="text-sm text-gray-500">
              No payments yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {payments.map((payment) => (
                <li
                  key={payment._id}
                  className="flex justify-between border p-3 rounded text-sm"
                >
                  <span>
                    {new Date(payment.paymentDate).toDateString()}
                  </span>
                  <span>₹ {payment.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Add Payment
            </h3>

            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border p-2 rounded mb-3 text-sm"
            />

            {errorMessage && (
              <p className="text-red-500 text-sm mb-3">
                {errorMessage}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setErrorMessage("");
                }}
                className="px-4 py-1 text-sm border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddPayment}
                disabled={submitting}
                className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;