"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle,
  XCircle, RefreshCw, HelpCircle, Package, Trash2, Eye
} from "lucide-react";

const UPLOAD_STEPS = [
  { step: 1, title: "Download Template", description: "Get the Excel template" },
  { step: 2, title: "Fill Data", description: "Add your product information" },
  { step: 3, title: "Upload File", description: "Import your products" },
  { step: 4, title: "Review & Publish", description: "Verify and go live" },
];

const RECENT_IMPORTS = [
  {
    id: "1",
    filename: "products_march_2024.xlsx",
    date: "Mar 10, 2024",
    status: "completed",
    productsAdded: 45,
    errors: 0,
  },
  {
    id: "2",
    filename: "oud_collection.xlsx",
    date: "Mar 5, 2024",
    status: "completed",
    productsAdded: 12,
    errors: 2,
  },
  {
    id: "3",
    filename: "perfumes_bulk.xlsx",
    date: "Feb 28, 2024",
    status: "failed",
    productsAdded: 0,
    errors: 15,
  },
];

const VALIDATION_RESULTS = [
  { row: 2, field: "price", message: "Price must be a positive number", status: "error" },
  { row: 5, field: "category", message: "Category 'Fragrance' not found, using 'Perfumes'", status: "warning" },
  { row: 8, field: "stock", message: "Stock quantity missing, defaulting to 0", status: "warning" },
  { row: 12, field: "image", message: "Image URL is invalid or inaccessible", status: "error" },
];

export default function BulkProductsPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [showValidation, setShowValidation] = React.useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setCurrentStep(3);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setShowValidation(true);
        setCurrentStep(4);
      }
    }, 300);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bulk Product Upload</h1>
          <p className="text-muted-foreground">
            Import multiple products at once using Excel or CSV
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="#" download>
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

      {/* Upload Area */}
      <Card className="p-8">
        {!isUploading && !showValidation ? (
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-moulna-gold/50 transition-colors cursor-pointer"
            onClick={handleUpload}
          >
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Drag and drop your file here
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse from your computer
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline">
                <FileSpreadsheet className="w-4 h-4 me-1" />
                .xlsx
              </Badge>
              <Badge variant="outline">
                <FileSpreadsheet className="w-4 h-4 me-1" />
                .csv
              </Badge>
            </div>
          </div>
        ) : isUploading ? (
          <div className="py-12 text-center">
            <RefreshCw className="w-12 h-12 mx-auto text-moulna-gold mb-4 animate-spin" />
            <h3 className="font-semibold text-lg mb-2">Uploading & Processing...</h3>
            <p className="text-muted-foreground mb-6">
              Please wait while we validate your products
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={uploadProgress} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium">products_new_collection.xlsx</p>
                  <p className="text-sm text-muted-foreground">24 products found</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="w-4 h-4 me-1" />
                Validated
              </Badge>
            </div>

            {/* Validation Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Ready to Import</span>
                </div>
                <p className="text-2xl font-bold text-green-700">20</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-700 mb-1">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Warnings</span>
                </div>
                <p className="text-2xl font-bold text-yellow-700">2</p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 text-red-700 mb-1">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Errors</span>
                </div>
                <p className="text-2xl font-bold text-red-700">2</p>
              </div>
            </div>

            {/* Validation Details */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 font-medium text-sm">
                Issues to Review
              </div>
              <div className="divide-y">
                {VALIDATION_RESULTS.map((result, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-4 py-3 flex items-center gap-4",
                      result.status === "error" ? "bg-red-50/50" : "bg-yellow-50/50"
                    )}
                  >
                    {result.status === "error" ? (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Row {result.row}</span> - {result.field}
                      </p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Fix
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowValidation(false);
                  setCurrentStep(1);
                }}
              >
                <Trash2 className="w-4 h-4 me-2" />
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Eye className="w-4 h-4 me-2" />
                  Preview Products
                </Button>
                <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
                  <Package className="w-4 h-4 me-2" />
                  Import 20 Products
                </Button>
              </div>
            </div>
          </div>
        )}
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
              <Badge variant="secondary">Stock Quantity</Badge>
              <Badge variant="secondary">SKU</Badge>
              <Badge variant="secondary">Image URLs</Badge>
              <Badge variant="secondary">Weight (g)</Badge>
              <Badge variant="secondary">Tags</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Imports */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Imports</h2>
        <Card>
          <div className="divide-y">
            {RECENT_IMPORTS.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.filename}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <p className="font-medium">{item.productsAdded} products</p>
                    {item.errors > 0 && (
                      <p className="text-sm text-red-500">{item.errors} errors</p>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      item.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {item.status === "completed" ? (
                      <CheckCircle className="w-3 h-3 me-1" />
                    ) : (
                      <XCircle className="w-3 h-3 me-1" />
                    )}
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
