import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

const faqs = [
  {
    question: "Are your vehicles new or used?",
    answer:
      "We primarily deal in high-quality used and certified vehicles. Some new units may be available depending on the model and availability.",
  },
  {
    question: "Are your cars locally used or imported?",
    answer:
      "We offer both locally used and imported vehicles from trusted markets such as Japan, UK, and UAE.",
  },
  {
    question: "Can I inspect the car before purchasing?",
    answer:
      "Yes. You’re welcome to visit our showroom or schedule a private inspection before making a purchase.",
  },
  {
    question: "Do you allow test drives?",
    answer:
      "Yes. Test drives are available by appointment to ensure the best experience.",
  },
  {
    question: "Are your vehicles inspected before sale?",
    answer:
      "Every vehicle undergoes a thorough inspection covering the engine, transmission, suspension, electronics, and overall condition.",
  },
  {
    question: "Are the mileages genuine?",
    answer:
      "Yes. We verify mileage using auction sheets, inspection reports, and official vehicle records.",
  },
  {
    question: "Do you offer financing or hire purchase?",
    answer:
      "Yes. We work with partner financial institutions to offer flexible financing and hire purchase options, subject to approval.",
  },
  {
    question: "Do you offer car importation services?",
    answer:
      "Yes. We can import a vehicle on your behalf based on your budget and specifications.",
  },
  {
    question: "How long does importation take?",
    answer:
      "Importation typically takes between 4–8 weeks, depending on the source country and shipping schedules.",
  },
  {
    question: "Do your vehicles come with a warranty?",
    answer:
      "Some vehicles come with a limited warranty, especially certified units. Warranty details are provided before purchase.",
  },
  {
    question: "Will the car be transferred to my name?",
    answer:
      "Yes. We ensure proper ownership transfer and provide all necessary documentation.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-3">
            Everything you need to know before buying your next car
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left px-6 py-5 focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a
            href="https://wa.me/254712345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[var(--jungle)] text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition"
          >
            Chat with us on WhatsApp
          </a>
        </div> */}
      </div>
       
    </section>
     <Footer/>
    </>
  );
};

export default FAQ;
