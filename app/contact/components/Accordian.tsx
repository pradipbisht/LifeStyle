"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      q: "How quickly will I receive a response?",
      a: "We typically respond within 24 hours during business days (Monday–Friday). For urgent issues, please call us directly.",
    },
    {
      q: "Can I schedule a call or meeting?",
      a: "Absolutely! Mention your preferred date and time in the message, and we’ll coordinate via email or phone.",
    },
    {
      q: "Do you offer product support?",
      a: "Yes, our technical support team is available for any product-related inquiries or troubleshooting.",
    },
  ];

  return (
    <section className="py-20 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="space-y-6 text-left">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
              <AccordionTrigger className="text-lg md:text-xl font-semibold text-slate-900 px-8 py-5 hover:text-blue-600">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 px-8 pb-6 text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
