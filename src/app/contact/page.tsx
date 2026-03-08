"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Mail, Phone, MapPin, Clock, MessageCircle, Send,
  Building2, Users, Headphones, ChevronRight, Loader2
} from "lucide-react";

const CONTACT_OPTIONS = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    action: "Start Chat",
    available: "Available Now",
    isOnline: true,
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us a detailed message",
    action: "support@moulna.ae",
    available: "Response within 24h",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak with a team member",
    action: "+971 4 555 1234",
    available: "9am - 9pm",
  },
];

const OFFICE_INFO = {
  address: "Moulna HQ, Business Bay, Churchill Towers, Tower B, Office 1205",
  city: "Dubai, United Arab Emirates",
  phone: "+971 4 555 1234",
  email: "hello@moulna.ae",
  hours: "Sunday - Thursday: 9:00 AM - 6:00 PM",
};

const DEPARTMENTS = [
  { name: "General Inquiries", email: "hello@moulna.ae" },
  { name: "Customer Support", email: "support@moulna.ae" },
  { name: "Seller Support", email: "sellers@moulna.ae" },
  { name: "Press & Media", email: "press@moulna.ae" },
  { name: "Partnerships", email: "partners@moulna.ae" },
  { name: "Careers", email: "careers@moulna.ae" },
];

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    department: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send message");
        return;
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        department: "general",
        message: "",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-moulna-gold/10 to-transparent py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="font-display text-4xl font-bold mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground">
                Have a question, feedback, or just want to say hello?
                We&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Contact Options */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {CONTACT_OPTIONS.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 rounded-full bg-moulna-gold/10 flex items-center justify-center">
                      <option.icon className="w-8 h-8 text-moulna-gold" />
                    </div>
                    {option.isOnline && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {option.description}
                  </p>
                  <Badge variant="outline" className="mb-4">
                    {option.available}
                  </Badge>
                  <Button variant="gold" className="w-full">
                    {option.action}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="font-semibold text-xl mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Your Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Subject *
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Department
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                        disabled={isSubmitting}
                      >
                        <option value="general">General Inquiries</option>
                        <option value="support">Customer Support</option>
                        <option value="sellers">Seller Support</option>
                        <option value="press">Press & Media</option>
                        <option value="partnerships">Partnerships</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Message *
                    </label>
                    <textarea
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-moulna-gold"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button type="submit" variant="gold" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 me-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 me-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Office Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-moulna-gold" />
                  Our Office
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{OFFICE_INFO.address}</p>
                      <p className="text-sm text-muted-foreground">{OFFICE_INFO.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <a href={`tel:${OFFICE_INFO.phone}`} className="text-sm hover:text-moulna-gold">
                      {OFFICE_INFO.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <a href={`mailto:${OFFICE_INFO.email}`} className="text-sm hover:text-moulna-gold">
                      {OFFICE_INFO.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <p className="text-sm">{OFFICE_INFO.hours}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-moulna-gold" />
                  Departments
                </h3>
                <div className="space-y-3">
                  {DEPARTMENTS.map((dept) => (
                    <div key={dept.email} className="flex items-center justify-between">
                      <span className="text-sm">{dept.name}</span>
                      <a
                        href={`mailto:${dept.email}`}
                        className="text-sm text-moulna-gold hover:underline"
                      >
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-transparent">
                <Headphones className="w-8 h-8 text-moulna-gold mb-3" />
                <h3 className="font-semibold mb-2">Need Help Now?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available to help you with any urgent issues.
                </p>
                <Button variant="gold" className="w-full" asChild>
                  <Link href="/help">
                    Visit Help Center
                    <ChevronRight className="w-4 h-4 ms-1" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="container mx-auto px-4 py-12">
          <Card className="overflow-hidden">
            <div className="aspect-[21/9] bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Interactive map would go here</p>
                <Button variant="outline" className="mt-4" asChild>
                  <a
                    href="https://maps.google.com/?q=Business+Bay+Dubai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
