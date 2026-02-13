"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Shield, Lock, Smartphone, Key, Eye, EyeOff,
  CheckCircle, AlertTriangle, LogOut, Monitor,
  MapPin, Clock, Trash2
} from "lucide-react";

const SESSIONS = [
  {
    id: "1",
    device: "Chrome on Windows",
    location: "Dubai, UAE",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "Dubai, UAE",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "3",
    device: "Chrome on MacBook",
    location: "Abu Dhabi, UAE",
    lastActive: "3 days ago",
    isCurrent: false,
  },
];

export default function SecuritySettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-moulna-gold" />
            Security Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account security and login settings
          </p>
        </div>

        {/* Security Status */}
        <Card className={cn(
          "p-4",
          is2FAEnabled ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
        )}>
          <div className="flex items-center gap-3">
            {is2FAEnabled ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            )}
            <div className="flex-1">
              <p className={cn(
                "font-medium",
                is2FAEnabled ? "text-green-800" : "text-yellow-800"
              )}>
                {is2FAEnabled
                  ? "Your account is protected"
                  : "Enable two-factor authentication"
                }
              </p>
              <p className={cn(
                "text-sm",
                is2FAEnabled ? "text-green-700" : "text-yellow-700"
              )}>
                {is2FAEnabled
                  ? "Two-factor authentication is active on your account."
                  : "Add an extra layer of security to your account."
                }
              </p>
            </div>
            {!is2FAEnabled && (
              <Button size="sm" onClick={() => setIs2FAEnabled(true)}>
                Enable 2FA
              </Button>
            )}
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Change Password</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative mt-1">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 8 characters with uppercase, lowercase, and number
              </p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="mt-1"
              />
            </div>
            <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
              Update Password
            </Button>
          </div>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-moulna-gold" />
            <h2 className="font-semibold">Two-Factor Authentication</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">
                  Use Google Authenticator or similar app
                </p>
              </div>
              <Switch
                checked={is2FAEnabled}
                onCheckedChange={setIs2FAEnabled}
              />
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">SMS Verification</p>
                <p className="text-sm text-muted-foreground">
                  Receive codes via SMS to +971 50 *** ***7
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Recovery Codes</p>
                <p className="text-sm text-muted-foreground">
                  Generate backup codes for account recovery
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Key className="w-4 h-4 me-1" />
                Generate
              </Button>
            </div>
          </div>
        </Card>

        {/* Active Sessions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-moulna-gold" />
              <h2 className="font-semibold">Active Sessions</h2>
            </div>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
              <LogOut className="w-4 h-4 me-1" />
              Sign Out All
            </Button>
          </div>
          <div className="space-y-3">
            {SESSIONS.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  session.isCurrent ? "bg-moulna-gold/10" : "bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Monitor className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.isCurrent && (
                        <Badge className="bg-green-500">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {session.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-red-600">Danger Zone</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Deactivate Account</p>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Deactivate
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-red-600">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 me-1" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
    </div>
  );
}
