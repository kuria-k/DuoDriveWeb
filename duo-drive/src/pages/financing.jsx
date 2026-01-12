import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Financing = () => {
  const [price, setPrice] = useState(20000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(12);
  const [years, setYears] = useState(3);

  const loanAmount = price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const months = years * 12;
  const monthlyPayment =
    (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="py-20 bg-[#2fa88a] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Flexible Financing</h1>
          <p className="mb-8 text-lg">
            We partner with leading Kenyan banks to offer flexible car financing
            solutions tailored to your needs.
          </p>
          <button className="bg-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
            Apply for Financing
          </button>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="flex-grow py-16">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Financing Calculator
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2">Car Price (KES)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Down Payment (KES)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Loan Term (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center items-center bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Estimated Monthly Payment</h3>
              <p className="text-4xl font-bold text-emerald-600">
                KES {monthlyPayment.toFixed(0).toLocaleString()}
              </p>
              <p className="mt-2 text-gray-600">
                Based on {years} years at {interestRate}% interest
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Financing;
