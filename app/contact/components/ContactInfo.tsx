"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: Mail,
      title: "Email",
      value: "support@lifestyle.com",
      link: "mailto:support@lifestyle.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      description: "Mon–Fri from 9am to 6pm",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "San Francisco, CA 94102",
      link: "https://maps.google.com/?q=San+Francisco+CA+94102",
      description: "United States",
    },
    {
      icon: Clock,
      title: "Business Hours",
      value: "Mon–Fri: 9AM – 6PM",
      description: "Weekend: Closed",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Contact Information
        </h2>
        <p className="text-slate-600">
          Reach us through any of these channels — we’ll be happy to assist.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {contactDetails.map((detail, index) => {
          const Icon = detail.icon;
          return (
            <Card
              key={index}
              className="border border-slate-200 hover:shadow-md transition-all">
              <CardContent className="p-5 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {detail.title}
                  </h3>
                  {detail.link ? (
                    <a
                      href={detail.link}
                      className="text-blue-600 hover:underline font-medium block">
                      {detail.value}
                    </a>
                  ) : (
                    <p className="font-medium text-slate-800">{detail.value}</p>
                  )}
                  <p className="text-sm text-slate-500">{detail.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-linear-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <CardTitle className="text-blue-900">Quick Response Time</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          We typically respond to all inquiries within 24 hours during business
          days. For urgent matters, please call us directly.
        </CardContent>
      </Card>
    </div>
  );
}
