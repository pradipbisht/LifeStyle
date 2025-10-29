"use client";

import FAQSection from "./components/Accordian";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-linear-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Contact Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
