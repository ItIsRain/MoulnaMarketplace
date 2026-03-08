"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload, Download, FileSpreadsheet, CheckCircle,
  HelpCircle, Package, Clock, Plus
} from "lucide-react";

const UPLOAD_STEPS = [
  { step: 1, title: "Download Template", description: "Get the Excel template" },
  { step: 2, title: "Fill Data", description: "Add your listing information" },
  { step: 3, title: "Upload File", description: "Import your listings" },
  { step: 4, title: "Review & Publish", description: "Verify and go live" },
];

export default function BulkProductsPage() {
  const [currentStep] = React.useState(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bulk Listing Upload</h1>
          <p className="text-muted-foreground">
            Import multiple listings at once using Excel or CSV
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="/templates/bulk-upload-template.csv" download>
            <Download className="w-4 h-4 me-2" />
            Download Template
          </a>
        </Button>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        {UPLOAD_STEPS.map((step, index) => (
          <React.Fragment key={step.step}>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                  currentStep >= step.step
                    ? "bg-moulna-gold text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.step ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.step
                )}
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < UPLOAD_STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4",
                  currentStep > step.step ? "bg-moulna-gold" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Coming Soon Upload Area */}
      <Card className="p-8">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-moulna-gold/10 mb-6">
            <Clock className="w-8 h-8 text-moulna-gold" />
          </div>
          <h3 className="font-semibold text-lg mb-2">
            Bulk Upload is Coming Soon
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We are working on a powerful bulk import tool. For now, please add your products one by one using the product creation page.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="gold" asChild>
              <Link href="/seller/products/new">
                <Plus className="w-4 h-4 me-2" />
                Add Single Product
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="/templates/bulk-upload-template.csv" download>
                <Download className="w-4 h-4 me-2" />
                Download Template
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            You can download the template now and prepare your data for when bulk upload launches.
          </p>
        </div>
      </Card>

      {/* Help Section */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <HelpCircle className="w-6 h-6 text-moulna-gold flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-2">Template Guide</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Make sure your spreadsheet includes these required columns:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Name *</Badge>
              <Badge variant="secondary">Description *</Badge>
              <Badge variant="secondary">Price (AED) *</Badge>
              <Badge variant="secondary">Category *</Badge>
              <Badge variant="secondary">Condition</Badge>
              <Badge variant="secondary">SKU</Badge>
              <Badge variant="secondary">Image URLs</Badge>
              <Badge variant="secondary">Weight (g)</Badge>
              <Badge variant="secondary">Tags</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
