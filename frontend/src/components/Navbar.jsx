import { useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 text-white rounded-2xl shadow-md">
            <FileText size={20} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            InvoicePro
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="hover:text-blue-600 transition-colors">
            Dashboard
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Invoices
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            Reports
          </a>
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <button className="px-4 py-2 text-sm rounded-2xl bg-blue-600 text-white shadow hover:shadow-lg transition">
            Create Invoice
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl border"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden px-6 pb-4 space-y-3 text-sm"
        >
          <a href="#" className="block py-2 border-b">
            Dashboard
          </a>
          <a href="#" className="block py-2 border-b">
            Invoices
          </a>
          <a href="#" className="block py-2 border-b">
            Reports
          </a>
          <button className="w-full mt-3 px-4 py-2 rounded-2xl bg-blue-600 text-white">
            Create Invoice
          </button>
        </motion.div>
      )}
    </header>
  );
}
