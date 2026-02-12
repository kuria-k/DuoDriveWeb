import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    id: 0,
    title: "Preparation",
    subtitle: "Know your needs & budget",
  },
  {
    id: 1,
    title: "Vehicle Inspection",
    subtitle: "Avoid hidden problems",
  },
  {
    id: 2,
    title: "Legal Verification",
    subtitle: "Kenya-specific checks 🇰🇪",
  },
  {
    id: 3,
    title: "Insurance & Financing",
    subtitle: "Protect your money",
  },
  {
    id: 4,
    title: "Ownership & Care",
    subtitle: "After purchase essentials",
  },
];

const SmartCarBuyerGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const saved = sessionStorage.getItem("buyerGuideProgress");
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("buyerGuideProgress", JSON.stringify(checked));
  }, [checked]);

  const toggle = (key) =>
    setChecked({ ...checked, [key]: !checked[key] });

  const progress =
    (Object.values(checked).filter(Boolean).length / 10) * 100;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

      {/* ================= LEFT STEPPER ================= */}
      <aside className="space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Car Buyer Guide
        </h1>
        <p className="text-gray-500 text-sm">
          Follow each step at your own pace.
        </p>

        {/* Progress */}
        <div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {Math.round(progress)}% completed
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 pt-6">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full text-left p-3 rounded-xl transition ${
                currentStep === step.id
                  ? "bg-emerald-50 border border-emerald-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <p className="font-semibold text-gray-800">
                {step.title}
              </p>
              <p className="text-xs text-gray-500">
                {step.subtitle}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <section className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 space-y-8">

        {/* STEP CONTENT */}
        {currentStep === 0 && (
          <Step
            title="Prepare Before You Shop"
            description="Buying a car starts before seeing the car."
          >
            <CheckItem
              checked={checked.budget}
              onClick={() => toggle("budget")}
              title="Set a total budget"
              desc="Include insurance, fuel, maintenance & registration."
            />
            <CheckItem
              checked={checked.needs}
              onClick={() => toggle("needs")}
              title="Define your car needs"
              desc="Daily commute, passengers, fuel type, road conditions."
            />
          </Step>
        )}

        {currentStep === 1 && (
          <Step
            title="Inspect the Vehicle"
            description="Looks can be deceiving. Always verify."
          >
            <CheckItem
              checked={checked.mechanic}
              onClick={() => toggle("mechanic")}
              title="Mechanic inspection"
              desc="Engine, transmission, suspension, brakes."
            />
            <CheckItem
              checked={checked.testdrive}
              onClick={() => toggle("testdrive")}
              title="Test drive completed"
              desc="Listen for noises, feel braking & steering."
            />
          </Step>
        )}

        {currentStep === 2 && (
          <Step
            title="Legal Checks (Kenya 🇰🇪)"
            description="Protect yourself from fraud."
          >
            <CheckItem
              checked={checked.logbook}
              onClick={() => toggle("logbook")}
              title="Original logbook verified"
              desc="Seller name must match ID."
            />
            <CheckItem
              checked={checked.ntsa}
              onClick={() => toggle("ntsa")}
              title="NTSA TIMS check"
              desc="Confirm ownership, theft status & loans."
            />
            <Note text="Never release payment before transfer is initiated." />
          </Step>
        )}

        {currentStep === 3 && (
          <Step
            title="Insurance & Financing"
            description="Protect your investment."
          >
            <CheckItem
              checked={checked.insurance}
              onClick={() => toggle("insurance")}
              title="Insurance selected"
              desc="Comprehensive is best for newer or financed cars."
            />
            <CheckItem
              checked={checked.payment}
              onClick={() => toggle("payment")}
              title="Safe payment method"
              desc="Avoid cash. Use bank or escrow."
            />
          </Step>
        )}

        {currentStep === 4 && (
          <Step
            title="After Purchase"
            description="Ownership done right."
          >
            <CheckItem
              checked={checked.transfer}
              onClick={() => toggle("transfer")}
              title="Ownership transfer confirmed"
              desc="Verify via NTSA SMS or TIMS."
            />
            <CheckItem
              checked={checked.service}
              onClick={() => toggle("service")}
              title="First service scheduled"
              desc="Oil, filters, fluids, safety check."
            />
          </Step>
        )}

        {/* NAV */}
        <div className="flex justify-between pt-6 border-t">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => s - 1)}
            className="text-gray-400 disabled:opacity-40"
          >
            ← Back
          </button>

          <button
            disabled={currentStep === steps.length - 1}
            onClick={() => setCurrentStep((s) => s + 1)}
            className="text-emerald-700 font-semibold"
          >
            Next →
          </button>
        </div>
      </section>
    </div>
  );
};

/* ================= UI PARTS ================= */

const Step = ({ title, description, children }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const CheckItem = ({ checked, onClick, title, desc }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-start gap-4 p-5 rounded-2xl border transition ${
      checked
        ? "bg-emerald-50 border-emerald-300"
        : "hover:bg-gray-50 border-gray-200"
    }`}
  >
    <CheckCircle
      className={`mt-1 ${
        checked ? "text-emerald-600" : "text-gray-300"
      }`}
    />
    <div className="text-left">
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  </button>
);

const Note = ({ text }) => (
  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-sm">
    ⚠ {text}
  </div>
);

export default SmartCarBuyerGuide;
