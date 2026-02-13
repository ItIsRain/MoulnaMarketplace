"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiceBearAvatar } from "@/components/avatar/DiceBearAvatar";
import {
  Package, Truck, CheckCircle, Clock, ArrowLeft,
  MapPin, Phone, Mail, MessageSquare, Printer,
  Copy, AlertCircle, Box, FileText
} from "lucide-react";

// Mock order data
const ORDER = {
  id: "MOU-2401-1234",
  status: "processing",
  createdAt: "2024-01-15T10:30:00",
  customer: {
    name: "Fatima Al Zahra",
    email: "fatima@email.com",
    phone: "+971 50 123 4567",
    avatar: "fatima-customer",
  },
  shipping: {
    address: "Villa 25, Al Wasl Road",
    city: "Dubai",
    emirate: "Dubai",
    country: "UAE",
    method: "Standard Delivery",
    cost: 15,
  },
  items: [
    {
      id: "1",
      name: "Royal Oud Collection",
      variant: "50ml",
      quantity: 2,
      price: 450,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100",
    },
    {
      id: "2",
      name: "Bakhoor Premium",
      variant: "100g",
      quantity: 1,
      price: 120,
      image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=100",
    },
  ],
  subtotal: 1020,
  discount: 0,
  total: 1035,
  payment: {
    method: "Credit Card",
    status: "paid",
    last4: "4242",
  },
  notes: "Please gift wrap the items. This is a birthday present.",
  timeline: [
    { status: "placed", date: "2024-01-15T10:30:00", note: "Order placed" },
    { status: "confirmed", date: "2024-01-15T10:35:00", note: "Payment confirmed" },
    { status: "processing", date: "2024-01-15T11:00:00", note: "Order is being prepared" },
  ],
};

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed", icon: FileText },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function SellerOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const order = ORDER; // In real app, fetch based on orderId
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  const [trackingNumber, setTrackingNumber] = React.useState("");
  const [internalNote, setInternalNote] = React.useState("");

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/seller/orders">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <Badge className={cn(
                  order.status === "processing" && "bg-blue-500",
                  order.status === "shipped" && "bg-purple-500",
                  order.status === "delivered" && "bg-green-500"
                )}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="w-4 h-4 me-2" />
              Print
            </Button>
            <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
              <Truck className="w-4 h-4 me-2" />
              Mark as Shipped
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                      isCompleted
                        ? "bg-moulna-gold text-white"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-moulna-gold"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={cn(
                      "flex-1 h-1 mx-2",
                      index < currentStepIndex ? "bg-moulna-gold" : "bg-muted"
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-semibold">AED {item.price}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: AED {item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>AED {order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>AED {order.shipping.cost}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-AED {order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>AED {order.total}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Details */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Shipping Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Delivery Address</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p>{order.shipping.address}</p>
                      <p>{order.shipping.city}, {order.shipping.emirate}</p>
                      <p>{order.shipping.country}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Method</h3>
                  <p>{order.shipping.method}</p>
                  <p className="text-sm text-muted-foreground">Estimated: 2-3 business days</p>
                </div>
              </div>

              {/* Tracking */}
              <div className="mt-4 pt-4 border-t">
                <Label>Tracking Number</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="flex-1"
                  />
                  <Button>Add Tracking</Button>
                </div>
              </div>
            </Card>

            {/* Customer Notes */}
            {order.notes && (
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Customer Note</h3>
                    <p className="text-yellow-700">{order.notes}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Customer</h2>
              <div className="flex items-center gap-3 mb-4">
                <DiceBearAvatar seed={order.customer.avatar} size="md" />
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <MessageSquare className="w-4 h-4 me-2" />
                Contact Customer
              </Button>
            </Card>

            {/* Payment */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Payment</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span>{order.payment.method} •••• {order.payment.last4}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-green-500">{order.payment.status}</Badge>
                </div>
              </div>
            </Card>

            {/* Internal Notes */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Internal Notes</h2>
              <Textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add a note about this order..."
                rows={3}
              />
              <Button variant="outline" size="sm" className="mt-2">
                Save Note
              </Button>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-moulna-gold" />
                    <div>
                      <p className="font-medium">{event.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
}
