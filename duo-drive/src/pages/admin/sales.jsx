import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaTrash,
  FaSearch,
  FaDownload,
  FaPrint,
  FaCar,
  FaUser,
  FaMoneyBillWave,
  FaFileInvoice,
} from "react-icons/fa";
import { getSales, createSale, updateSale, deleteSale, getCars } from "../../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const COMPANY_NAME = "DUO DRIVE KENYA";
const COMPANY_ADDRESS = "Nairobi, Kenya";
const COMPANY_PHONE = "+254 700 000 000";
const COMPANY_EMAIL = "info@duodrivekenya.com";
const PRIMARY_COLOR = [47, 168, 138];
const DARK_COLOR = [0, 0, 0];
const LIGHT_COLOR = [240, 253, 249];
const LOGO_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbYAAAFGCAYAAAAGm7ppAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADkrSURBVHhe7d17fBTVoQfwX2LwJiA2qEAWhQQKSlARIshLoIDeKvFR4CICoq0JVsVKC9rbNkQtD59QrxZo1WArGLQoeEtNfAICKig10qpEHiZsEDciSBAwXAjM/YOdMHsyZ2bOZjbJnvy+n89+IGcmm9nHzG/OY84kGIZhgIiISBOJYgEREVE8Y7AREZFWGGxERKQVBhsREWmFwUZERFphsBERkVYYbEREpBUGGxERaYXBRkREWmGwERGRVhhsRESkFQYbERFphcFGRERaYbAREZFWGGxERKQVBhsREWmFwUZERFphsBERkVYYbEREpBUGGxERaYXBRkREWmGwERGRVhhsRESkFQYbERFphcFGRERaYbAREZFWGGxERKQVBhsREWmFwUZERFphsBERkVYYbEREpBUGGxERaYXBRkREWmGwERGRVhhsRESkFQYbERFphcFGRERaYbAREZFWGGxERKQVBhsREWmFwUZERFphsBERkVYYbEREpBUGGxERaYXBRkREWmGwERGRVhhsRESkFQYbERFphcFGRERaYbAREZFWGGxERKQVBhsREWmFwUZERFphsBERkVYYbEREpBUGGxERaYXBRkREWmGwERGRVhhsRESkFQYbERFphcFGRERaYbAREZFWGGxERKQVBhsREWmFwUZERFphsBERkVYYbEREpBUGGxERaYXBRkREWkkwDMMQC4koesFQUCxCeiBdLCKiGGGwkfasQbMz/H+zbGeoonZZRfj/5jomMajE5fWVIYSeNQStyzoFOoXLTv5rrpcRSGdwElkw2CjunAqlIIKhYG04VYQqbILL3xBq6swgTA+k1/5/SNblEWUMQdIdg42aDDOM1passw2rtSXrItaPFWstSVZ7Mpm1qGiYNUQrMYhjFdDmaxmaNQQIhx+Dj3TBYKMGYT1Ary1ZD1hC62Sty98Dt0mswcR7c55Ts+rJsoo6Taqq768s9MyfiZo6Bhv5xjyAms2DZnDFsqZlBtKQrMHhnzux5iEhNuGe/P+pzwkeasUZloAbknU5hmYN4ftMTQ6DjZSY4WXWutaF/3U7INaXeUDtFOhUG16s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"; 

// doc.addImage(LOGO_IMAGE, "PNG", 15, 10, 30, 30);


const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [carSearchQuery, setCarSearchQuery] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    customer: "",
    customerEmail: "",
    customerPhone: "",
    carId: "",
    car: "",
    amount: "",
    status: "sold",
    date: new Date().toISOString().split('T')[0],
    paymentMethod: "cash",
    downPayment: "",
    notes: "",
  });

  const itemsPerPage = 10;

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    fetchSales();
    fetchAvailableCars();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getSales();
      const salesData = Array.isArray(response.data) ? response.data : [];
      setSales(salesData);
      setFilteredSales(salesData);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSales([]);
      setFilteredSales([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCars = async () => {
    try {
      const response = await getCars();
      const carsData = Array.isArray(response.data) ? response.data : [];
      // Filter only available cars
      const available = carsData.filter(car => 
        car.status && car.status.toLowerCase() === 'available'
      );
      setAvailableCars(available);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setAvailableCars([]);
    }
  };

  useEffect(() => {
    filterSalesByPeriod(filterPeriod);
  }, [filterPeriod, sales]);

  useEffect(() => {
    applySearchFilter();
  }, [searchQuery, sales, filterPeriod]);

  const applySearchFilter = () => {
    let filtered = filterSalesByPeriodHelper(filterPeriod);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sale) =>
          sale.customer.toLowerCase().includes(query) ||
          sale.car.toLowerCase().includes(query),
      );
    }

    setFilteredSales(filtered);
    setCurrentPage(1);
  };

  const filterSalesByPeriodHelper = (period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filtered = Array.isArray(sales) ? [...sales] : [];

    if (period === "today") {
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= today;
      });
    } else if (period === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((sale) => new Date(sale.date) >= weekAgo);
    } else if (period === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((sale) => new Date(sale.date) >= monthAgo);
    } else if (period === "year") {
      const yearAgo = new Date(today);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      filtered = filtered.filter((sale) => new Date(sale.date) >= yearAgo);
    }

    return filtered;
  };

  const filterSalesByPeriod = (period) => {
    setFilterPeriod(period);
  };

  const calculateStats = () => {
    const salesArray = Array.isArray(filteredSales) ? filteredSales : [];
    const totalSales = salesArray.reduce(
      (sum, sale) => sum + parseFloat(sale.amount || 0),
      0,
    );
    const soldSales = salesArray.filter((s) => s.status === "sold").length;
    const availableSales = salesArray.filter(
      (s) => s.status === "available",
    ).length;
    const reservedSales = salesArray.filter(
      (s) => s.status === "reserved",
    ).length;

    return {
      total: totalSales,
      count: salesArray.length,
      sold: soldSales,
      available: availableSales,
      reserved: reservedSales,
    };
  };

  const stats = calculateStats();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const salesArray = Array.isArray(filteredSales) ? filteredSales : [];
  const currentSales = salesArray.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(salesArray.length / itemsPerPage);

  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setFormData({
      customer: sale.customer,
      customerEmail: sale.customerEmail || "",
      customerPhone: sale.customerPhone || "",
      carId: sale.carId || "",
      car: sale.car,
      amount: sale.amount,
      status: sale.status,
      date: sale.date,
      paymentMethod: sale.paymentMethod || "cash",
      downPayment: sale.downPayment || "",
      notes: sale.notes || "",
    });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      await updateSale(selectedSale.id, formData);
      fetchSales();
      setShowEditModal(false);
      setSelectedSale(null);
      showToast("Sale updated successfully!", "success");
    } catch (error) {
      console.error("Error updating sale:", error);
      showToast("Failed to update sale", "error");
    }
  };

  const addSale = async () => {
    try {
      // Validate required fields
      if (!formData.customer || !formData.car || !formData.amount) {
        showToast("Please fill in all required fields", "error");
        return;
      }

      const response = await createSale(formData);
      
      // Store the created sale for invoice generation
      const createdSale = response.data;
      
      fetchSales();
      fetchAvailableCars(); // Refresh available cars list
      setShowAddModal(false);
      
      // Reset form
      setFormData({
        customer: "",
        customerEmail: "",
        customerPhone: "",
        carId: "",
        car: "",
        amount: "",
        status: "sold",
        date: new Date().toISOString().split('T')[0],
        paymentMethod: "cash",
        downPayment: "",
        notes: "",
      });
      
      showToast("Sale added successfully!", "success");
      
      // Ask if user wants to generate invoice
      setSelectedSale(createdSale);
      setTimeout(() => {
        if (window.confirm("Would you like to generate an invoice for this sale?")) {
          setShowInvoiceModal(true);
        }
      }, 500);
      
    } catch (error) {
      console.error("Error creating sale:", error);
      showToast("Failed to add sale", "error");
    }
  };

  const removeSale = async (id) => {
    setShowDeleteModal(false);
    try {
      await deleteSale(id);
      fetchSales();
      showToast("Sale deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting sale:", error);
      showToast("Failed to delete sale", "error");
    }
  };

  const handleDeleteClick = (sale) => {
    setSelectedSale(sale);
    setShowDeleteModal(true);
  };

  const handleCarSelect = (car) => {
    setFormData({
      ...formData,
      carId: car.id,
      car: `${car.make} ${car.model} ${car.year}`,
      amount: car.price || "",
    });
    setCarSearchQuery("");
  };

  const filteredAvailableCars = availableCars.filter(car => {
    const searchTerm = carSearchQuery.toLowerCase();
    const carName = `${car.make} ${car.model} ${car.year}`.toLowerCase();
    return carName.includes(searchTerm);
  });

  const generateInvoice = (sale, download = true) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // === HEADER ===
  // Logo + Company Name
  doc.addImage(LOGO_IMAGE, 'PNG', 15, 10, 30, 30); 
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...PRIMARY_COLOR);
  doc.text(COMPANY_NAME, 50, 20);
  doc.setFontSize(10);
  doc.setFont(undefined, 'italic');
  doc.text('Find it, Drive it, Love it', 50, 28);

  // Contact Info
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(COMPANY_ADDRESS, pageWidth - 15, 15, { align: 'right' });
  doc.text(`${COMPANY_PHONE} | ${COMPANY_EMAIL}`, pageWidth - 15, 22, { align: 'right' });

  // Divider
  doc.setDrawColor(...PRIMARY_COLOR);
  doc.setLineWidth(1);
  doc.line(15, 40, pageWidth - 15, 40);

  // === INVOICE TITLE ===
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...DARK_COLOR);
  doc.text('SALES INVOICE', pageWidth / 2, 55, { align: 'center' });

  // === INVOICE DETAILS ===
  let y = 65;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Invoice #:', 15, y);
  doc.text('Date:', 15, y + 7);
  doc.text('Payment Method:', 15, y + 14);

  doc.setFont(undefined, 'normal');
  doc.text(`INV-${String(sale.id).padStart(6, '0')}`, 60, y);
  doc.text(new Date(sale.date).toLocaleDateString(), 60, y + 7);
  doc.text((sale.paymentMethod || 'Cash').toUpperCase(), 60, y + 14);

  // Right column
  doc.setFont(undefined, 'bold');
  doc.text('Status:', pageWidth - 70, y);
  doc.text('Sale Type:', pageWidth - 70, y + 7);
  doc.setFont(undefined, 'normal');
  doc.text((sale.status || 'Completed').toUpperCase(), pageWidth - 35, y);
  doc.text(sale.downPayment ? 'INSTALLMENT' : 'FULL PAYMENT', pageWidth - 35, y + 7);

  // === CUSTOMER INFO ===
  y += 25;
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('CUSTOMER INFORMATION', 20, y + 6);

  y += 15;
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Name:', 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(sale.customer || 'N/A', 65, y);

  if (sale.customerPhone) {
    y += 7;
    doc.setFont(undefined, 'bold');
    doc.text('Phone:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(sale.customerPhone, 65, y);
  }

  if (sale.customerEmail) {
    y += 7;
    doc.setFont(undefined, 'bold');
    doc.text('Email:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(sale.customerEmail, 65, y);
  }

  // === VEHICLE DETAILS ===
  y += 15;
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('VEHICLE DETAILS', 20, y + 6);

  y += 15;
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Vehicle:', 20, y);
  doc.setFont(undefined, 'normal');
  doc.text(sale.car || 'N/A', 65, y);

  if (sale.vin) {
    y += 7;
    doc.setFont(undefined, 'bold');
    doc.text('VIN:', 20, y);
    doc.setFont(undefined, 'normal');
    doc.text(sale.vin, 65, y);
  }

  // === PAYMENT BREAKDOWN TABLE ===
  y += 15;
  const tableData = [];
  tableData.push(['Vehicle Sale Price', `KSh ${Number(sale.amount).toLocaleString()}`]);
  if (sale.downPayment) {
    tableData.push(['Down Payment', `KSh ${Number(sale.downPayment).toLocaleString()}`]);
    const balance = Number(sale.amount) - Number(sale.downPayment);
    tableData.push(['Balance Due', `KSh ${balance.toLocaleString()}`]);
  }

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: PRIMARY_COLOR, textColor: [255, 255, 255] },
    bodyStyles: { textColor: DARK_COLOR },
    margin: { left: 15, right: 15 },
  });

  // === TOTAL AMOUNT ===
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFillColor(...PRIMARY_COLOR);
  doc.roundedRect(pageWidth - 90, finalY, 75, 20, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL', pageWidth - 87, finalY + 7);
  doc.setFontSize(16);
  doc.text(`KSh ${Number(sale.amount).toLocaleString()}`, pageWidth - 87, finalY + 16);

  // === SIGNATURE SECTION ===
  const sigY = finalY + 40;
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.text('Authorized Signature:', 20, sigY);
  doc.line(70, sigY, 150, sigY);
  doc.text('Customer Signature:', 20, sigY + 15);
  doc.line(70, sigY + 15, 150, sigY + 15);

  // === TERMS & FOOTER ===
  const termsY = pageHeight - 50;
  doc.setFillColor(245, 245, 245);
  doc.rect(15, termsY, pageWidth - 30, 30, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('Terms & Conditions:', 20, termsY + 6);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.text('• All sales are final unless otherwise specified', 20, termsY + 12);
  doc.text('• Vehicle warranty as per manufacturer specifications', 20, termsY + 16);
  doc.text('• Buyer responsible for registration and transfer fees', 20, termsY + 20);
  doc.text('• Payment must be completed as per agreed terms', 20, termsY + 24);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 10, { align: 'center' });

  if (download) {
    doc.save(`Invoice_${sale.id}.pdf`);
  }

  return doc;
};

 const printInvoice = (sale) => {
    const doc = generateInvoice(sale, false);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
    showToast("Opening print dialog...", "success");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header background
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont(undefined, 'bold');
    doc.text(COMPANY_NAME, pageWidth / 2, 20, { align: 'center' });

    // Subtitle
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Car Sellers | Sales Report', pageWidth / 2, 32, { align: 'center' });

    // Date
    doc.setFontSize(10);
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Generated: ${reportDate} | Period: ${filterPeriod}`, pageWidth / 2, 42, { align: 'center' });

    // Summary Section
    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Summary', 15, 72);

    // Summary cards
    const cardY = 80;
    const cardHeight = 24;
    const cardWidth = (pageWidth - 40) / 4;

    const summaryData = [
      { label: 'Total Revenue', value: `KSh ${stats.total.toLocaleString('en-KE', { maximumFractionDigits: 0 })}` },
      { label: 'Total Sales', value: `${stats.count}` },
      { label: 'Sold', value: `${stats.sold}` },
      { label: 'Available', value: `${stats.available}` },
    ];

    summaryData.forEach((item, idx) => {
      const cardX = 15 + (idx * (cardWidth + 3));
      doc.setFillColor(...LIGHT_COLOR);
      doc.rect(cardX, cardY, cardWidth - 1, cardHeight);
      doc.setFillColor(...PRIMARY_COLOR);
      doc.rect(cardX, cardY, cardWidth - 1, 5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text(item.label, cardX + 2, cardY + 3.5);
      doc.setTextColor(...DARK_COLOR);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text(item.value, cardX + 2, cardY + 15);
    });

    // Table data
    const tableData = filteredSales.map(s => [
      s.customer,
      s.car,
      `KSh ${Number(s.amount).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`,
      s.date,
      s.status.charAt(0).toUpperCase() + s.status.slice(1)
    ]);

    autoTable(doc, {
      head: [['Customer', 'Car Model', 'Amount', 'Date', 'Status']],
      body: tableData,
      startY: 110,
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
        0: { cellWidth: 35 },
        1: { cellWidth: 40 },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 28 },
        4: { cellWidth: 25 }
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

    doc.save(`${COMPANY_NAME.replace(' ', '_')}_Sales_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    showToast("PDF exported successfully!", "success");
  };

  const exportCSV = () => {
    const headers = ["Customer", "Car Model", "Amount", "Date", "Status"];
    const rows = filteredSales.map(s => [
      s.customer,
      s.car,
      Number(s.amount).toFixed(2),
      s.date,
      s.status
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${COMPANY_NAME.replace(' ', '_')}_Sales_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
    showToast("CSV exported successfully!", "success");
  };

  const filterButtons = [
    { label: "Today", value: "today", icon: FaCalendarDay },
    { label: "Week", value: "week", icon: FaCalendarWeek },
    { label: "Month", value: "month", icon: FaCalendarAlt },
    { label: "Year", value: "year", icon: FaCalendar },
    { label: "All Time", value: "all", icon: FaCalendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-slideIn">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md ${
              toast.type === "success"
                ? "bg-white/90 border-l-4"
                : "bg-red-50/90 border-l-4 border-red-500"
            }`}
            style={toast.type === "success" ? { borderColor: "#2fa88a" } : {}}
          >
            {toast.type === "success" ? (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "#2fa88a" }}
              >
                <FaCheck size={16} />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                <FaTimes size={16} />
              </div>
            )}
            <span className="font-medium text-gray-800">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Sales & Transactions
            </h1>
            <p className="text-gray-600">
              Manage and track your sales performance
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: "#2fa88a" }}
            >
              <FaDownload size={16} /> Export PDF
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: "#000" }}
            >
              <FaDownload size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filterButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.value}
                onClick={() => setFilterPeriod(btn.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                  filterPeriod === btn.value
                    ? "text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                }`}
                style={
                  filterPeriod === btn.value
                    ? { backgroundColor: "#2fa88a" }
                    : {}
                }
              >
                <Icon className="text-sm" />
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{ focusRingColor: "#2fa88a" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-white rounded-xl shadow-lg p-6 border-l-4"
            style={{ borderColor: "#2fa88a" }}
          >
            <p className="text-gray-600 text-sm font-medium mb-1">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KES",
                minimumFractionDigits: 0,
              }).format(stats.total)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-1">
              Total Sales
            </p>
            <p className="text-3xl font-bold text-gray-800">{stats.count}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Sold</p>
            <p className="text-3xl font-bold text-gray-800">{stats.sold}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Available</p>
            <p className="text-3xl font-bold text-gray-800">
              {stats.available}
            </p>
          </div>
        </div>

        {/* Add Sale Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setFormData({
                customer: "",
                customerEmail: "",
                customerPhone: "",
                carId: "",
                car: "",
                amount: "",
                status: "sold",
                date: new Date().toISOString().split('T')[0],
                paymentMethod: "cash",
                downPayment: "",
                notes: "",
              });
              setShowAddModal(true);
            }}
            className="px-6 py-3 rounded-lg font-medium shadow-lg transition-all text-white hover:opacity-90"
            style={{ backgroundColor: "#2fa88a" }}
          >
            + Add Sale
          </button>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: "#2fa88a" }}
              ></div>
            </div>
          ) : currentSales.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? `No sales found matching "${searchQuery}"`
                  : "No sales found for this period"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-6 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#2fa88a" }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead
                    className="bg-gray-50 border-b-2"
                    style={{ borderColor: "#2fa88a" }}
                  >
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Car
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {sale.car}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {new Intl.NumberFormat("en-KE", {
                            style: "currency",
                            currency: "KES",
                            minimumFractionDigits: 0,
                          }).format(sale.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {sale.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sale.status === "sold"
                                ? "bg-green-100 text-green-800"
                                : sale.status === "available"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {sale.status.charAt(0).toUpperCase() +
                              sale.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                          <button
                            onClick={() => {
                              setSelectedSale(sale);
                              setShowInvoiceModal(true);
                            }}
                            className="font-medium hover:opacity-70 transition-opacity"
                            style={{ color: "#2fa88a" }}
                          >
                            Invoice
                          </button>
                          <button
                            onClick={() => handleEdit(sale)}
                            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(sale)}
                            className="font-medium text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstItem + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, salesArray.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{salesArray.length}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaChevronLeft className="h-4 w-4" />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? "text-white border-transparent"
                                : "text-gray-700 border-gray-300 bg-white hover:bg-gray-50"
                            }`}
                            style={
                              currentPage === i + 1
                                ? { backgroundColor: "#2fa88a" }
                                : {}
                            }
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaChevronRight className="h-4 w-4" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Invoice Preview/Action Modal */}
        {showInvoiceModal && selectedSale && (
          <GlassModal
            onClose={() => setShowInvoiceModal(false)}
            title="Invoice Actions"
            size="large"
          >
            <div className="text-center mb-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#2fa88a" }}
              >
                <FaFileInvoice className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Generate Invoice
              </h3>
              <p className="text-gray-600">
                Invoice for: <span className="font-semibold">{selectedSale.customer}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {selectedSale.car}
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-3">
                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                  minimumFractionDigits: 0,
                }).format(selectedSale.amount)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  generateInvoice(selectedSale);
                  setShowInvoiceModal(false);
                }}
                className="flex items-center justify-center gap-2 py-4 rounded-lg font-medium text-white transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: "#2fa88a" }}
              >
                <FaDownload size={18} />
                Download PDF
              </button>
              <button
                onClick={() => {
                  printInvoice(selectedSale);
                  setShowInvoiceModal(false);
                }}
                className="flex items-center justify-center gap-2 py-4 rounded-lg font-medium bg-gray-800 text-white transition-all hover:bg-gray-700 shadow-lg"
              >
                <FaPrint size={18} />
                Print Invoice
              </button>
            </div>
            
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="w-full mt-4 py-3 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </GlassModal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedSale && (
          <GlassModal
            onClose={() => setShowDeleteModal(false)}
            title="Delete Sale"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="text-red-600 text-2xl" />
              </div>
              <p className="text-gray-700 text-lg mb-2">
                Are you sure you want to delete this sale?
              </p>
              <p className="text-gray-500 text-sm">
                <span className="font-semibold">{selectedSale.customer}</span> -{" "}
                {selectedSale.car}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => removeSale(selectedSale.id)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </GlassModal>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <GlassModal onClose={() => setShowEditModal(false)} title="Edit Sale">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="text"
              placeholder="Car Model"
              value={formData.car}
              onChange={(e) =>
                setFormData({ ...formData, car: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <input
              type="text"
              placeholder="Amount (KES)"
              value={
                formData.amount
                  ? new Intl.NumberFormat("en-KE", {
                      style: "currency",
                      currency: "KES",
                      minimumFractionDigits: 0,
                    }).format(formData.amount)
                  : ""
              }
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, amount: numericValue });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={saveEdit}
                className="flex-1 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: "#2fa88a" }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </GlassModal>
        )}

        {/* Enhanced Add Sale Modal */}
        {showAddModal && (
          <GlassModal
            onClose={() => setShowAddModal(false)}
            title="Add New Sale"
            size="large"
          >
            <div className="space-y-4">
              {/* Customer Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaUser className="text-gray-600" />
                  <h3 className="font-semibold text-gray-700">Customer Information</h3>
                </div>
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData({ ...formData, customer: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                />
              </div>

              {/* Vehicle Selection Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaCar className="text-gray-600" />
                  <h3 className="font-semibold text-gray-700">Vehicle Selection</h3>
                </div>
                
                {/* Car Search and Display */}
                {!formData.carId ? (
                  <>
                    <div className="relative mb-3">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search available cars..."
                        value={carSearchQuery}
                        onChange={(e) => setCarSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                      />
                    </div>
                    
                    {/* Available Cars List */}
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {filteredAvailableCars.length > 0 ? (
                        filteredAvailableCars.map((car) => (
                          <div
                            key={car.id}
                            onClick={() => handleCarSelect(car)}
                            className="p-3 hover:bg-white cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {car.make} {car.model} {car.year}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {car.color} • {car.mileage} km
                                </p>
                              </div>
                              <p className="font-bold text-gray-800">
                                {new Intl.NumberFormat("en-KE", {
                                  style: "currency",
                                  currency: "KES",
                                  minimumFractionDigits: 0,
                                }).format(car.price)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          {carSearchQuery ? (
                            <p>No cars found matching "{carSearchQuery}"</p>
                          ) : (
                            <p>No available cars in inventory</p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-white p-4 rounded-lg border-2 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">
                          {formData.car}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Selected Vehicle
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setFormData({ ...formData, carId: "", car: "", amount: "" })
                        }
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FaMoneyBillWave className="text-gray-600" />
                  <h3 className="font-semibold text-gray-700">Payment Information</h3>
                </div>
                
                <input
                  type="text"
                  placeholder="Sale Amount (KES) *"
                  value={
                    formData.amount
                      ? new Intl.NumberFormat("en-KE", {
                          style: "currency",
                          currency: "KES",
                          minimumFractionDigits: 0,
                        }).format(formData.amount)
                      : ""
                  }
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    setFormData({ ...formData, amount: numericValue });
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                />

                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_money">Mobile Money (M-Pesa)</option>
                  <option value="cheque">Cheque</option>
                  <option value="card">Card Payment</option>
                  <option value="installment">Installment Plan</option>
                </select>

                {formData.paymentMethod === 'installment' && (
                  <input
                    type="text"
                    placeholder="Down Payment Amount (KES)"
                    value={
                      formData.downPayment
                        ? new Intl.NumberFormat("en-KE", {
                            style: "currency",
                            currency: "KES",
                            minimumFractionDigits: 0,
                          }).format(formData.downPayment)
                        : ""
                    }
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, downPayment: numericValue });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                  />
                )}

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                />

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
                >
                  <option value="sold">Sold</option>
                  <option value="reserved">Reserved</option>
                  <option value="available">Available</option>
                </select>
              </div>

              {/* Additional Notes */}
              <textarea
                placeholder="Additional Notes (optional)"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2fa88a] focus:ring-opacity-50"
              />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addSale}
                  disabled={!formData.customer || !formData.car || !formData.amount}
                  className="flex-1 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#2fa88a" }}
                >
                  Complete Sale
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </GlassModal>
        )}
      </div>
    </div>
  );
};

// Enhanced Glassmorphism Modal Component
const GlassModal = ({ onClose, title, children, size = "medium" }) => {
  const widthClass = size === "large" ? "max-w-2xl" : "max-w-md";
  
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${widthClass} rounded-2xl shadow-2xl p-6 border border-white/20 max-h-[90vh] overflow-y-auto`}
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Sales;