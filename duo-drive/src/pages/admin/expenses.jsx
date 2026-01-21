import React, { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Download,
  FileText,
  DollarSign
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const categories = [
  "Fuel",
  "Maintenance",
  "Insurance",
  "Marketing",
  "Utilities",
  "Salaries",
  "Inventory",
  "Other"
];

const ENTRIES_PER_PAGE = 8;

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    date: "",
    category: "",
    amount: "",
    description: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [page, setPage] = useState(1);

  /* -------------------- FILTERING -------------------- */

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch =
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || e.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, filterCategory]);

  /* -------------------- PAGINATION -------------------- */

  const totalPages = Math.ceil(filteredExpenses.length / ENTRIES_PER_PAGE);
  const start = (page - 1) * ENTRIES_PER_PAGE;
  const currentExpenses = filteredExpenses.slice(
    start,
    start + ENTRIES_PER_PAGE
  );

  /* -------------------- TOTAL -------------------- */

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  /* -------------------- HANDLERS -------------------- */

  const handleSubmit = () => {
    if (!form.date || !form.category || !form.amount) return;

    if (editingIndex !== null) {
      const copy = [...expenses];
      copy[editingIndex] = form;
      setExpenses(copy);
      setEditingIndex(null);
    } else {
      setExpenses([...expenses, form]);
    }

    setForm({ date: "", category: "", amount: "", description: "" });
  };

  const handleEdit = index => {
    setForm(expenses[index]);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = index => {
    if (!window.confirm("Delete this expense?")) return;
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  /* -------------------- EXPORT EXCEL -------------------- */

  const exportExcel = () => {
    const data = filteredExpenses.map(e => ({
      Date: e.date,
      Category: e.category,
      Amount: Number(e.amount),
      Description: e.description
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");

    const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(
      new Blob([buffer]),
      `expenses_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  /* -------------------- EXPORT PDF -------------------- */

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Company Expenses Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Date", "Category", "Amount", "Description"]],
      body: filteredExpenses.map(e => [
        e.date,
        e.category,
        `$${Number(e.amount).toFixed(2)}`,
        e.description || ""
      ]),
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255
      },
      styles: { fontSize: 9 }
    });

    doc.save("expenses.pdf");
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <div className="flex gap-3">
            <button onClick={exportExcel} className="btn">
              <Download size={16} /> Excel
            </button>
            <button onClick={exportPDF} className="btn-dark">
              <FileText size={16} /> PDF
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card flex items-center gap-4">
            <DollarSign className="text-emerald-500" />
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-2xl font-bold">{filteredExpenses.length}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="card space-y-4">
          <h2 className="font-semibold">
            {editingIndex !== null ? "Edit Expense" : "Add Expense"}
          </h2>

          <div className="grid md:grid-cols-4 gap-3">
            <input type="date" className="input" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} />

            <select className="input" value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Category</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            <input type="number" placeholder="Amount" className="input"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })} />

            <input placeholder="Description" className="input col-span-1 md:col-span-4"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <button onClick={handleSubmit} className="btn-primary">
            <Plus size={16} /> Save Expense
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3">
          <input placeholder="Search..." className="input"
            value={search} onChange={e => setSearch(e.target.value)} />

          <select className="input"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* TABLE */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th className="text-right">Amount</th>
                <th>Description</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.map((e, i) => (
                <tr key={i} className="border-b">
                  <td>{e.date}</td>
                  <td>{e.category}</td>
                  <td className="text-right font-semibold">
                    ${Number(e.amount).toFixed(2)}
                  </td>
                  <td>{e.description || "—"}</td>
                  <td className="flex justify-center gap-2 py-2">
                    <button onClick={() => handleEdit(start + i)} className="btn-sm">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(start + i)} className="btn-sm-dark">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex gap-2 justify-center">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i}
                onClick={() => setPage(i + 1)}
                className={`page-btn ${page === i + 1 ? "active" : ""}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
