import { useState, useEffect } from "react";
import Navbar from "../../components/buyernavbar";
import Footer from "../../components/footer";
import { Calculator, TrendingUp, ShieldCheck, Clock, DollarSign, Percent, Calendar, CreditCard, X, FileText, Building, User, FileSpreadsheet, Briefcase, Phone, ChevronRight } from "lucide-react";

const Financing = () => {
  const [price, setPrice] = useState(2000000);
  const [downPayment, setDownPayment] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [years, setYears] = useState(3);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [showRequirements, setShowRequirements] = useState(false);

  useEffect(() => {
    const calculatePayment = () => {
      const loanAmount = price - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const months = years * 12;
      
      if (loanAmount <= 0 || monthlyRate <= 0 || months <= 0) {
        return 0;
      }
      
      const payment = 
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
        (Math.pow(1 + monthlyRate, months) - 1);
      
      setMonthlyPayment(isNaN(payment) ? 0 : payment);
    };
    
    calculatePayment();
  }, [price, downPayment, interestRate, years]);

  const totalAmount = monthlyPayment * years * 12;
  const totalInterest = totalAmount - (price - downPayment);
  const downPaymentPercent = ((downPayment / price) * 100).toFixed(1);

  // Format currency input
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handle currency input changes
  const handleCurrencyChange = (setter, value) => {
    // Remove any non-numeric characters except decimal
    const numericValue = value.replace(/[^0-9.]/g, '');
    setter(numericValue === '' ? 0 : parseFloat(numericValue));
  };

  // Requirements for employed persons
  const requirements = [
    {
      id: 1,
      title: "3 Latest Payslips",
      description: "Your most recent 3 months' payslips showing consistent income. Ensure they are stamped and signed by your employer.",
      icon: FileSpreadsheet,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "6 Months Bank Statements",
      description: "Personal bank statements showing salary deposits and account activity. Must show your name, account number, and transaction history.",
      icon: FileText,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "National ID",
      description: "Original and clear copy of your National Identity Card (both sides). Must be valid and not expired.",
      icon: User,
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "KRA PIN Certificate",
      description: "Valid Kenya Revenue Authority Personal Identification Number certificate. Can be downloaded from iTax portal.",
      icon: FileText,
      color: "bg-red-500"
    },
    {
      id: 5,
      title: "Employer Introduction Letter",
      description: "Official letter from your employer on company letterhead confirming employment, position, and salary. Must be recent (within 30 days).",
      icon: Building,
      color: "bg-amber-500"
    },
    {
      id: 6,
      title: "Employment Contract",
      description: "Copy of your current employment contract showing terms of employment and duration. Must be signed by both parties.",
      icon: Briefcase,
      color: "bg-indigo-500"
    }
  ];

  const additionalRequirements = [
    "Recent passport-sized photographs (2)",
    "Proof of residence (utility bill, rental agreement)",
    "Completed loan application form",
    "Copy of driving license (if available)"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      

      {/* Requirements Modal */}
      {showRequirements && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRequirements(false)}
          />
          
          {/* Glassmorphic Modal */}
          <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/20 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Bank Financing Requirements</h2>
                  <p className="text-emerald-100/80 mt-1">For Employed Individuals</p>
                </div>
                <button
                  onClick={() => setShowRequirements(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Information Card */}
              <div className="mb-8 p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Need Help Gathering Documents?</h3>
                    <p className="text-emerald-100/80 text-sm mb-3">
                      Our financing specialists are ready to assist you with document preparation and submission.
                    </p>
                    <a
                      href="tel:+254706193959"
                      className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors text-sm font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      Call +254 706 193 959
                    </a>
                  </div>
                </div>
              </div>

              {/* Requirements Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Required Documents</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {requirements.map((req) => (
                    <div 
                      key={req.id}
                      className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`${req.color} p-3 rounded-xl`}>
                          <req.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-2">{req.title}</h3>
                          <p className="text-emerald-100/70 text-sm mb-3">{req.description}</p>
                          <div className="flex items-center gap-1 text-xs text-emerald-300/80">
                            <ChevronRight className="w-3 h-3" />
                            <span>Mandatory for all applicants</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Additional Requirements</h3>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                  <ul className="space-y-3">
                    {additionalRequirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                        <span className="text-emerald-100/80 text-sm flex-1">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Important Information */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Important Information</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-2 text-sm">Document Preparation Tips</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                        <span className="text-emerald-100/70 text-sm">Scan documents in color at 300 DPI for best quality</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                        <span className="text-emerald-100/70 text-sm">Ensure all documents are clearly legible and not blurry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                        <span className="text-emerald-100/70 text-sm">File size should not exceed 5MB per document</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-2 text-sm">Processing Timeline</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                        <span className="text-emerald-100/70 text-sm">Document verification: 24-48 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                        <span className="text-emerald-100/70 text-sm">Credit assessment: 1-2 business days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></div>
                        <span className="text-emerald-100/70 text-sm">Final approval: 3-5 business days</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="font-semibold text-white mb-3">Eligibility Criteria</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-emerald-300 text-xs font-semibold mb-1">MINIMUM SALARY</p>
                    <p className="text-white text-sm">KES 30,000/month</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-emerald-300 text-xs font-semibold mb-1">EMPLOYMENT DURATION</p>
                    <p className="text-white text-sm">Minimum 6 months</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-emerald-300 text-xs font-semibold mb-1">AGE LIMIT</p>
                    <p className="text-white text-sm">21 - 60 years</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-emerald-300 text-xs font-semibold mb-1">CREDIT SCORE</p>
                    <p className="text-white text-sm">Minimum 350</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed at bottom */}
            <div className="p-6 border-t border-white/20 bg-white/5 shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowRequirements(false)}
                  className="flex-1 px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Got It, Thanks!
                </button>
                <a
                  href="tel:+254706193959"
                  className="flex-1 px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call for Assistance
                </a>
              </div>
              <p className="text-xs text-emerald-200/60 text-center mt-4">
                *All information is kept confidential and secure
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative py-24 bg-gradient-to-r from-emerald-600 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Drive Your Dream Today
            </h1>
            <p className="text-xl mb-10 text-emerald-100">
              We partner with Kenya's leading financial institutions to offer you 
              <span className="font-semibold text-white"> competitive rates</span> and 
              <span className="font-semibold text-white"> flexible terms</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-emerald-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 hover:scale-105 transition-all duration-300 shadow-lg">
                Apply for Financing
              </a>
              <button 
                onClick={() => setShowRequirements(true)}
                className="bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                View Requirements
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Calculator className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Smart Financing Calculator
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter your details below to calculate your personalized monthly payment
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* CALCULATOR INPUTS */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Car Price */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <label className="font-semibold text-gray-800">Car Price</label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">KES</span>
                    </div>
                    <input
                      type="text"
                      value={formatCurrency(price)}
                      onChange={(e) => handleCurrencyChange(setPrice, e.target.value)}
                      className="w-full pl-16 pr-4 py-4 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-opacity-50 transition-all text-lg font-medium"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => setPrice(1000000)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      1M
                    </button>
                    <button 
                      onClick={() => setPrice(3000000)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      3M
                    </button>
                    <button 
                      onClick={() => setPrice(5000000)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      5M
                    </button>
                  </div>
                </div>

                {/* Down Payment */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <label className="font-semibold text-gray-800">Down Payment</label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">KES</span>
                    </div>
                    <input
                      type="text"
                      value={formatCurrency(downPayment)}
                      onChange={(e) => handleCurrencyChange(setDownPayment, e.target.value)}
                      className="w-full pl-16 pr-4 py-4 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-opacity-50 transition-all text-lg font-medium"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => setDownPayment(price * 0.1)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      10%
                    </button>
                    <button 
                      onClick={() => setDownPayment(price * 0.2)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      20%
                    </button>
                    <button 
                      onClick={() => setDownPayment(price * 0.3)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      30%
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-medium text-emerald-600">{downPaymentPercent}%</span> of car price
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-5 h-5 text-emerald-600" />
                    <label className="font-semibold text-gray-800">Annual Interest Rate</label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      max="30"
                      className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-opacity-50 transition-all text-lg font-medium"
                      placeholder="0.0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => setInterestRate(8)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      8%
                    </button>
                    <button 
                      onClick={() => setInterestRate(12)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      12%
                    </button>
                    <button 
                      onClick={() => setInterestRate(16)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      16%
                    </button>
                  </div>
                </div>

                {/* Loan Term */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <label className="font-semibold text-gray-800">Loan Term (Years)</label>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(parseFloat(e.target.value) || 0)}
                      step="0.5"
                      min="0.5"
                      max="10"
                      className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:ring-opacity-50 transition-all text-lg font-medium"
                      placeholder="0.0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">years</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => setYears(1)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      1 Year
                    </button>
                    <button 
                      onClick={() => setYears(2.5)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      2.5 Years
                    </button>
                    <button 
                      onClick={() => setYears(5)}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      5 Years
                    </button>
                  </div>
                </div>
              </div>

              {/* Loan Details Summary */}
              <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-4 text-lg">Loan Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      KES {(price - downPayment).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Period</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(years * 12).toFixed(0)} months
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS PANEL */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-8 text-center">Your Payment Plan</h3>
              
              {/* Monthly Payment */}
              <div className="mb-8 text-center">
                <p className="text-emerald-100 mb-2">Estimated Monthly Payment</p>
                <p className="text-5xl font-bold mb-2">
                  KES {monthlyPayment.toFixed(0).toLocaleString()}
                </p>
                <p className="text-emerald-200">
                  For {years} {years === 1 ? 'year' : 'years'} at {interestRate}% interest
                </p>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                <h4 className="font-bold mb-4 text-lg">Financial Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Car Price</span>
                    <span className="font-bold">{price.toLocaleString()} KES</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Down Payment</span>
                    <span className="font-bold">{downPayment.toLocaleString()} KES</span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between">
                      <span className="text-emerald-100">Loan Amount</span>
                      <span className="font-bold">{(price - downPayment).toLocaleString()} KES</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-100">Total Interest</span>
                    <span className="font-bold">{totalInterest.toFixed(0).toLocaleString()} KES</span>
                  </div>
                  <div className="border-t border-white/20 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Payment</span>
                      <span>{totalAmount.toFixed(0).toLocaleString()} KES</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-emerald-200/70 mt-6 text-center">
                *This is an estimate. Final terms are subject to credit approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Financing?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-full mb-4">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Terms</h3>
              <p className="text-gray-300">
                Choose any loan period from 6 months to 10 years, including decimal terms like 2.5 years
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-full mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Competitive Rates</h3>
              <p className="text-gray-300">
                Interest rates as low as 8% APR with precision to decimal points
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-full mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Approval</h3>
              <p className="text-gray-300">
                Get pre-approved in 24 hours with our simplified application process
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Drive Home Your Dream Car?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Get pre-approved in minutes without affecting your credit score
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
              Call Us: +254 706 193 959
            </button>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Financing;