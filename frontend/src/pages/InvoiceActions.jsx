import axios from "axios";

const InvoiceActions = ({ invoiceId, isArchived, onRefresh }) => {
  const handleArchive = async () => {
    try {
      await axios.post("http://localhost:8080/api/invoices/archive", {
        id: invoiceId,
      });

      onRefresh();
    } catch (error) {
      console.error("Archive failed", error);
    }
  };

  const handleRestore = async () => {
    try {
      await axios.post("http://localhost:8080/api/invoices/restore", {
        id: invoiceId,
      });

      onRefresh();
    } catch (error) {
      console.error("Restore failed", error);
    }
  };

  return (
    <div className="flex gap-3">
      {!isArchived ? (
        <button
          onClick={handleArchive}
          className="px-4 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Archive
        </button>
      ) : (
        <button
          onClick={handleRestore}
          className="px-4 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Restore
        </button>
      )}
    </div>
  );
};

export default InvoiceActions;