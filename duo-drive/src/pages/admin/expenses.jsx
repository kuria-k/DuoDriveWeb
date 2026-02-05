import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  Tag
} from "lucide-react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from "../../utils/api";
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
const COMPANY_NAME = "Duo Drive Kenya";
const PRIMARY_COLOR = [47, 168, 138];
const DARK_COLOR = [0, 0, 0];
const LIGHT_COLOR = [240, 253, 249];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    date: "",
    category: "",
    amount: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await getExpenses();
      setExpenses(res.data.results || res.data);
    } catch (err) {
      console.error("Error loading expenses:", err);
    }
  };

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

  const totalPages = Math.ceil(filteredExpenses.length / ENTRIES_PER_PAGE);
  const start = (page - 1) * ENTRIES_PER_PAGE;
  const currentExpenses = filteredExpenses.slice(start, start + ENTRIES_PER_PAGE);

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const handleSubmit = async () => {
    if (!form.date || !form.category || !form.amount) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      if (editingId !== null) {
        await updateExpense(editingId, form);
        setEditingId(null);
      } else {
        await createExpense(form);
      }
      setForm({ date: "", category: "", amount: "", description: "" });
      loadExpenses();
    } catch (err) {
      console.error("Error saving expense:", err);
      alert("Error saving expense");
    }
  };

  const handleEdit = (expense) => {
    setForm(expense);
    setEditingId(expense.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Error deleting expense");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header background
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text(COMPANY_NAME, pageWidth / 2, 20, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Expenses Report', pageWidth / 2, 32, { align: 'center' });

    // Date
    doc.setFontSize(10);
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Generated: ${reportDate}`, pageWidth / 2, 40, { align: 'center' });

    // Summary Section
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Summary', 15, 62);

    // Summary cards
    const cardY = 70;
    const cardHeight = 25;
    const cardWidth = (pageWidth - 40) / 3;

    // Card 1
    doc.setFillColor(...LIGHT_COLOR);
    doc.rect(15, cardY, cardWidth, cardHeight);
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(15, cardY, cardWidth, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Total Expenses', 17, cardY + 4);
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`KSh ${totalAmount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`, 17, cardY + 16);

    // Card 2
    doc.setFillColor(...LIGHT_COLOR);
    doc.rect(15 + cardWidth + 5, cardY, cardWidth, cardHeight);
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(15 + cardWidth + 5, cardY, cardWidth, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Total Records', 17 + cardWidth + 5, cardY + 4);
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`${filteredExpenses.length}`, 17 + cardWidth + 5, cardY + 16);

    // Card 3
    doc.setFillColor(...LIGHT_COLOR);
    doc.rect(15 + (cardWidth + 5) * 2, cardY, cardWidth, cardHeight);
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(15 + (cardWidth + 5) * 2, cardY, cardWidth, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Average', 17 + (cardWidth + 5) * 2, cardY + 4);
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    const avg = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
    doc.text(`KSh ${avg.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`, 17 + (cardWidth + 5) * 2, cardY + 16);

    // Table data
    const tableData = filteredExpenses.map(e => [
      e.date,
      e.category,
      `KSh ${Number(e.amount).toLocaleString('en-KE', { maximumFractionDigits: 2 })}`,
      e.description || '—'
    ]);

    autoTable(doc, {
      head: [['Date', 'Category', 'Amount', 'Description']],
      body: tableData,
      startY: 105,
      theme: 'grid',
      headStyles: {
        fillColor: PRIMARY_COLOR,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11,
        padding: 8,
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 10,
        padding: 7,
        textColor: DARK_COLOR,
        halign: 'left'
      },
      alternateRowStyles: {
        fillColor: LIGHT_COLOR
      },
      columnStyles: {
        0: { cellWidth: 28 },
        1: { cellWidth: 32 },
        2: { cellWidth: 38, halign: 'right' },
        3: { cellWidth: 'auto' }
      },
      margin: { top: 10, bottom: 15, left: 15, right: 15 },
      didDrawPage: (data) => {
        const pageCount = doc.internal.pages.length - 1;
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    });

    doc.save(`${COMPANY_NAME.replace(' ', '_')}_Expenses_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportCSV = () => {
    const headers = ["Date", "Category", "Amount", "Description"];
    const rows = filteredExpenses.map(e => [
      e.date,
      e.category,
      Number(e.amount).toFixed(2),
      e.description || ""
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${COMPANY_NAME.replace(' ', '_')}_Expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "32px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#000", margin: 0 }}>
                Expenses Management
              </h1>
              <p style={{ color: "#6b7280", fontSize: "16px", margin: "8px 0 0 0" }}>
                Track and manage your company expenses efficiently
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={exportPDF}
                style={{
                  background: "#2fa88a",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => e.target.style.background = "#248a72"}
                onMouseOut={(e) => e.target.style.background = "#2fa88a"}
              >
                <Download size={18} /> Export PDF
              </button>
              <button
                onClick={exportCSV}
                style={{
                  background: "#fff",
                  color: "#2fa88a",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "2px solid #2fa88a",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => e.target.background = "#f0fdf9"}
                onMouseOut={(e) => e.target.background = "#fff"}
              >
                <Download size={18} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "linear-gradient(135deg, #2fa88a 0%, #248a72 100%)", color: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(47,168,138,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <DollarSign size={28} />
              <div>
                <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>Total Expenses</p>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "700" }}>
                  KSh {totalAmount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                </h3>
              </div>
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, #000 0%, #1f2937 100%)", color: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FileText size={28} />
              <div>
                <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>Total Records</p>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "700" }}>
                  {filteredExpenses.length}
                </h3>
              </div>
            </div>
          </div>

          <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <TrendingUp size={28} color="#2fa88a" />
              <div>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Average Expense</p>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "700", color: "#000" }}>
                  KSh {filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toLocaleString('en-KE', { maximumFractionDigits: 0 }) : '0'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#000", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            {editingId ? <Pencil size={20} color="#2fa88a" /> : <Plus size={20} color="#2fa88a" />}
            {editingId ? "Edit Expense" : "Add New Expense"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={{ width: "100%", padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                Amount (KSh)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                step="0.01"
                style={{ width: "100%", padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                Description
              </label>
              <input
                type="text"
                placeholder="Enter expense description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ width: "100%", padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              background: "#2fa88a",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => e.target.style.background = "#248a72"}
            onMouseOut={(e) => e.target.style.background = "#2fa88a"}
          >
            <Plus size={18} /> {editingId ? "Update Expense" : "Save Expense"}
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ width: "100%", padding: "12px", border: "2px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" }}
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {currentExpenses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
              <FileText size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
              <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No expenses found</p>
              <p style={{ fontSize: "14px" }}>Add your first expense to get started</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                    <tr>
                      <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#6b7280", fontSize: "13px" }}>Date</th>
                      <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#6b7280", fontSize: "13px" }}>Category</th>
                      <th style={{ padding: "16px", textAlign: "right", fontWeight: "600", color: "#6b7280", fontSize: "13px" }}>Amount</th>
                      <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "#6b7280", fontSize: "13px" }}>Description</th>
                      <th style={{ padding: "16px", textAlign: "center", fontWeight: "600", color: "#6b7280", fontSize: "13px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExpenses.map((e) => (
                      <tr key={e.id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.2s" }} onMouseOver={(ev) => ev.currentTarget.style.background = "#f9fafb"} onMouseOut={(ev) => ev.currentTarget.style.background = ""}>
                        <td style={{ padding: "16px", fontWeight: "600", color: "#000" }}>{e.date}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{ background: LIGHT_COLOR, color: PRIMARY_COLOR.join(","), padding: "6px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
                            {e.category}
                          </span>
                        </td>
                        <td style={{ padding: "16px", textAlign: "right", fontWeight: "700", color: "#000" }}>
                          KSh {Number(e.amount).toLocaleString('en-KE', { maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: "16px", color: "#6b7280" }}>{e.description || "—"}</td>
                        <td style={{ padding: "16px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button onClick={() => handleEdit(e)} style={{ background: "#f0fdf9", color: "#2fa88a", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", transition: "all 0.3s" }} onMouseOver={(ev) => { ev.target.style.background = "#2fa88a"; ev.target.style.color = "white"; }} onMouseOut={(ev) => { ev.target.style.background = "#f0fdf9"; ev.target.style.color = "#2fa88a"; }}>
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(e.id)} style={{ background: "#f9fafb", color: "#1f2937", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer", transition: "all 0.3s" }} onMouseOver={(ev) => { ev.target.style.background = "#000"; ev.target.style.color = "white"; }} onMouseOut={(ev) => { ev.target.style.background = "#f9fafb"; ev.target.style.color = "#1f2937"; }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div style={{ padding: "20px", display: "flex", gap: "8px", justifyContent: "center", borderTop: "1px solid #f3f4f6" }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      style={{
                        padding: "10px 14px",
                        border: `2px solid ${page === i + 1 ? "#2fa88a" : "#e5e7eb"}`,
                        background: page === i + 1 ? "#2fa88a" : "white",
                        color: page === i + 1 ? "white" : "#1f2937",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.3s"
                      }}
                      onMouseOver={(ev) => {
                        if (page !== i + 1) {
                          ev.target.style.borderColor = "#2fa88a";
                          ev.target.style.color = "#2fa88a";
                        }
                      }}
                      onMouseOut={(ev) => {
                        if (page !== i + 1) {
                          ev.target.style.borderColor = "#e5e7eb";
                          ev.target.style.color = "#1f2937";
                        }
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}