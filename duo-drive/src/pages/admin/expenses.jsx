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

  // 🔹 Load expenses from API
  useEffect(() => {
    loadExpenses();
  }, [page]);

  const loadExpenses = async () => {
    try {
      const res = await getExpenses();
      // DRF pagination returns {count, next, previous, results}
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

  // 🔹 Submit logic with API
  const handleSubmit = async () => {
    if (!form.date || !form.category || !form.amount) return;
    try {
      if (editingIndex !== null) {
        const expenseId = expenses[editingIndex].id;
        await updateExpense(expenseId, form);
        setEditingIndex(null);
      } else {
        await createExpense(form);
      }
      setForm({ date: "", category: "", amount: "", description: "" });
      loadExpenses();
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const handleEdit = index => {
    setForm(expenses[index]);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Delete logic with API
  const handleDelete = async index => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const expenseId = expenses[index].id;
      await deleteExpense(expenseId);
      loadExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const exportCSV = () => {
    const headers = ["Date", "Category", "Amount (KSh)", "Description"];
    const rows = filteredExpenses.map(e => [
      e.date,
      e.category,
      Number(e.amount).toFixed(2),
      e.description || ""
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };



  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", padding: "24px" }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .input-field {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #ffffff;
          color: #1f2937;
        }
        .input-field:focus {
          outline: none;
          border-color: #2fa88a;
          box-shadow: 0 0 0 3px rgba(47, 168, 138, 0.1);
        }
        .btn-primary {
          background: #2fa88a;
          color: white;
          padding: 12px 24px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 15px;
        }
        .btn-primary:hover {
          background: #248a72;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(47, 168, 138, 0.3);
        }
        .btn-secondary {
          background: #ffffff;
          color: #1f2937;
          padding: 10px 20px;
          border-radius: 10px;
          border: 2px solid #e5e7eb;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        .btn-secondary:hover {
          border-color: #2fa88a;
          color: #2fa88a;
          background: #f0fdf9;
        }
        .btn-dark {
          background: #000000;
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        .btn-dark:hover {
          background: #1f2937;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .btn-icon {
          padding: 8px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-icon.edit {
          background: #f0fdf9;
          color: #2fa88a;
        }
        .btn-icon.edit:hover {
          background: #2fa88a;
          color: white;
        }
        .btn-icon.delete {
          background: #f9fafb;
          color: #1f2937;
        }
        .btn-icon.delete:hover {
          background: #000000;
          color: white;
        }
        .badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          background: #f0fdf9;
          color: #2fa88a;
          border: 1px solid #ccf3e8;
        }
        .stat-card {
          background: linear-gradient(135deg, #2fa88a 0%, #248a72 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(47, 168, 138, 0.2);
        }
        .stat-card-dark {
          background: linear-gradient(135deg, #000000 0%, #1f2937 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .stat-card::before,
        .stat-card-dark::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        thead {
          background: #f9fafb;
        }
        th {
          padding: 14px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
          border-bottom: 2px solid #e5e7eb;
        }
        td {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          color: #1f2937;
          font-size: 14px;
        }
        tbody tr {
          transition: all 0.2s ease;
        }
        tbody tr:hover {
          background: #f9fafb;
        }
        .pagination-btn {
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          color: #1f2937;
        }
        .pagination-btn:hover {
          border-color: #2fa88a;
          color: #2fa88a;
        }
        .pagination-btn.active {
          background: #2fa88a;
          border-color: #2fa88a;
          color: white;
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div className="fade-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#000", marginBottom: "4px" }}>
              Company Expenses
            </h1>
            <p style={{ color: "#6b7280", fontSize: "15px" }}>Track and manage your car dealership expenses</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={exportCSV} className="btn-secondary">
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "32px" }}>
          <div className="stat-card">
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ background: "rgba(255,255,255,0.2)", padding: "12px", borderRadius: "12px" }}>
                  <DollarSign size={24} />
                </div>
                <div>
                  <p style={{ fontSize: "13px", opacity: 0.9, fontWeight: "500" }}>Total Expenses</p>
                  <h3 style={{ fontSize: "32px", fontWeight: "700", margin: "4px 0 0 0" }}>
                    KSh {totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card-dark">
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px", borderRadius: "12px" }}>
                  <FileText size={24} />
                </div>
                <div>
                  <p style={{ fontSize: "13px", opacity: 0.9, fontWeight: "500" }}>Total Records</p>
                  <h3 style={{ fontSize: "32px", fontWeight: "700", margin: "4px 0 0 0" }}>
                    {filteredExpenses.length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: "#f0fdf9", padding: "12px", borderRadius: "12px" }}>
                <TrendingUp size={24} color="#2fa88a" />
              </div>
              <div>
                <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>Average Expense</p>
                <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#000", margin: "4px 0 0 0" }}>
                  KSh {filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="card fade-in" style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#000", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            {editingIndex !== null ? <><Pencil size={22} color="#2fa88a" /> Edit Expense</> : <><Plus size={22} color="#2fa88a" /> Add New Expense</>}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                <Calendar size={16} color="#2fa88a" /> Date
              </label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                <Tag size={16} color="#2fa88a" /> Category
              </label>
              <select
                className="input-field"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                <DollarSign size={16} color="#2fa88a" /> Amount (KSh)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="input-field"
                value={form.amount}
                step="0.01"
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                <FileText size={16} color="#2fa88a" /> Description
              </label>
              <input
                placeholder="Enter expense description"
                className="input-field"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <button onClick={handleSubmit} className="btn-primary">
            <Plus size={18} /> {editingIndex !== null ? "Update Expense" : "Save Expense"}
          </button>
        </div>

        {/* FILTERS */}
        <div className="card fade-in" style={{ marginBottom: "32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                <Search size={16} color="#2fa88a" /> Search
              </label>
              <input
                placeholder="Search expenses..."
                className="input-field"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                <Tag size={16} color="#2fa88a" /> Filter by Category
              </label>
              <select
                className="input-field"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="card fade-in" style={{ padding: 0, overflow: "hidden" }}>
          {currentExpenses.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
              <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No expenses found</p>
              <p style={{ fontSize: "14px" }}>Add your first expense to get started</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                      <th>Description</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExpenses.map((e, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: "600" }}>{e.date}</td>
                        <td>
                          <span className="badge">{e.category}</span>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "700", fontSize: "15px", color: "#000" }}>
                          KSh {Number(e.amount).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ color: "#6b7280" }}>{e.description || "—"}</td>
                        <td>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button onClick={() => handleEdit(start + i)} className="btn-icon edit">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(start + i)} className="btn-icon delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div style={{ padding: "20px", display: "flex", gap: "8px", justifyContent: "center", borderTop: "1px solid #f3f4f6" }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
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