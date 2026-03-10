"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Cookie, ChevronRight, Download, Mail, Calendar,
  Shield, Settings, BarChart, Target
} from "lucide-react";

const COOKIE_TYPES = [
  {
    id: "essential",
    name: "Essential Cookies",
    icon: Shield,
    required: true,
    description: "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as setting your privacy preferences, logging in, or filling in forms.",
    examples: ["Session cookies", "Authentication cookies", "Security cookies", "Load balancing"],
  },
  {
    id: "functional",
    name: "Functional Cookies",
    icon: Settings,
    required: false,
    description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use.",
    examples: ["Language preferences", "Region settings", "Recently viewed items", "Wishlist"],
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    icon: BarChart,
    required: false,
    description: "These cookies help us understand how visitors interact with our website. They collect information about page visits, traffic sources, and user behavior.",
    examples: ["Google Analytics", "Page view tracking", "Click tracking", "Performance monitoring"],
  },
  {
    id: "marketing",
    name: "Marketing Cookies",
    icon: Target,
    required: false,
    description: "These cookies are used to track visitors across websites. They are used to display ads that are relevant and engaging for individual users.",
    examples: ["Facebook Pixel", "Google Ads", "Retargeting cookies", "Social media cookies"],
  },
];

export default function CookiePolicyPage() {
  const [preferences, setPreferences] = React.useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false,
  });

  const handleToggle = (id: string) => {
    if (id === "essential") return; // Can't disable essential
    setPreferences(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  const handleSavePreferences = () => {
    // Save to localStorage
    try {
      localStorage.setItem("moulna-cookie-preferences", JSON.stringify(preferences));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <section className="py-12 bg-moulna-charcoal text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/legal" className="hover:text-white">Legal</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Cookie Policy</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-moulna-gold/20 flex items-center justify-center">
              <Cookie className="w-8 h-8 text-moulna-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cookie Policy</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last updated: January 1, 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">What Are Cookies?</h2>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are placed on your device when you visit a website.
              They are widely used to make websites work more efficiently and to provide information
              to website owners.
            </p>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your experience on Moulna,
              understand how our platform is used, and deliver personalized content and advertisements.
            </p>
          </Card>

          {/* Cookie Preferences */}
          <Card className="p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Cookie Preferences</h2>
              <Button onClick={handleSavePreferences} className="bg-moulna-gold hover:bg-moulna-gold-dark">
                Save Preferences
              </Button>
            </div>

            <div className="space-y-6">
              {COOKIE_TYPES.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-moulna-gold/10 flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-moulna-gold" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{type.name}</h3>
                          {type.required && (
                            <Badge variant="secondary">Required</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={preferences[type.id as keyof typeof preferences]}
                      onCheckedChange={() => handleToggle(type.id)}
                      disabled={type.required}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example) => (
                      <Badge key={example} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Additional Info */}
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">How We Use Cookies</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Session vs. Persistent Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Session cookies</strong> are temporary and are deleted when you close your browser.
                  <strong> Persistent cookies</strong> remain on your device for a set period or until you delete them.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">First-Party vs. Third-Party Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>First-party cookies</strong> are set by Moulna directly.
                  <strong> Third-party cookies</strong> are set by our partners and service providers for
                  analytics, advertising, and other purposes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Managing Cookies in Your Browser</h3>
                <p className="text-sm text-muted-foreground">
                  Most web browsers allow you to control cookies through their settings. You can usually
                  find these settings in the "Options" or "Preferences" menu of your browser. Note that
                  blocking all cookies may affect the functionality of our website.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Updates to This Policy</h3>
                <p className="text-sm text-muted-foreground">
                  We may update this Cookie Policy from time to time. Any changes will be posted on
                  this page with an updated revision date. We encourage you to review this policy
                  periodically.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-8 bg-moulna-gold/10 border-moulna-gold/20">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 text-moulna-gold flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Questions About Cookies?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about our use of cookies or this policy,
                  please contact our privacy team.
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:privacy@moulna.ae">
                    Contact Privacy Team
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
