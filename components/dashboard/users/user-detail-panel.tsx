"use client";

import { useState } from "react";
import type { UserWithProfile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { banUser, unbanUser } from "@/lib/actions/admin-users";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-muted-foreground text-sm shrink-0">{label}</span>
      <span className="text-sm text-right">{value || "—"}</span>
    </div>
  );
}

export function UserDetailPanel({
  user,
  onClose,
}: {
  user: UserWithProfile;
  onClose: () => void;
}) {
  const [showBanForm, setShowBanForm] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBan = async () => {
    if (!banReason.trim()) return;
    setLoading(true);
    try {
      await banUser(user.id, banReason);
      setShowBanForm(false);
      setBanReason("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async () => {
    setLoading(true);
    try {
      await unbanUser(user.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const kycStatus = user.profile?.kycStatus ?? "unverified";

  return (
    <SheetContent className="overflow-y-auto sm:max-w-md">
      <SheetHeader>
        <SheetTitle>{user.name}</SheetTitle>
        <SheetDescription>{user.email}</SheetDescription>
      </SheetHeader>

      <div className="px-4 pb-4 space-y-6">
        {/* Status badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
            {user.role}
          </Badge>
          <Badge
            variant={kycStatus === "verified" ? "default" : "outline"}
            className={
              kycStatus === "verified"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-transparent"
            }
          >
            KYC: {kycStatus}
          </Badge>
          {user.banned && <Badge variant="destructive">Banned</Badge>}
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-medium mb-2">Personal Information</h3>
          <Separator className="mb-3" />
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Phone" value={user.profile?.phone} />
          <InfoRow label="Address" value={user.profile?.address} />
          <InfoRow
            label="Date of Birth"
            value={
              user.profile?.dateOfBirth
                ? new Date(user.profile.dateOfBirth).toLocaleDateString()
                : null
            }
          />
        </div>

        {/* Identity Verification */}
        <div>
          <h3 className="text-sm font-medium mb-2">Identity Verification</h3>
          <Separator className="mb-3" />
          <InfoRow
            label="NIN"
            value={
              user.profile?.nin
                ? `***${user.profile.nin.slice(-4)}`
                : "Not provided"
            }
          />
          <InfoRow
            label="NIN Verified"
            value={user.profile?.ninVerified ? "Yes" : "No"}
          />
          <InfoRow
            label="TIN Verified"
            value={user.profile?.tinVerified ? "Yes" : "No"}
          />
        </div>

        {/* Financial Information */}
        <div>
          <h3 className="text-sm font-medium mb-2">Financial Information</h3>
          <Separator className="mb-3" />
          <InfoRow label="Citizenship" value={user.profile?.citizenship} />
          <InfoRow label="Tax ID" value={user.profile?.taxId} />
          <InfoRow
            label="Employment Status"
            value={user.profile?.employmentStatus}
          />
          <InfoRow label="Occupation" value={user.profile?.occupation} />
          <InfoRow label="Employer" value={user.profile?.employerName} />
          <InfoRow label="Source of Funds" value={user.profile?.sourceOfFunds} />
        </div>

        {/* Ban/Unban Actions */}
        <div>
          <h3 className="text-sm font-medium mb-2">Actions</h3>
          <Separator className="mb-3" />
          {user.banned ? (
            <div className="space-y-2">
              {user.banReason && (
                <p className="text-sm text-muted-foreground">
                  Ban reason: {user.banReason}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnban}
                disabled={loading}
              >
                {loading ? "Unbanning..." : "Unban User"}
              </Button>
            </div>
          ) : showBanForm ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Ban Reason</Label>
                <Textarea
                  placeholder="Enter reason for banning..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBan}
                  disabled={loading || !banReason.trim()}
                >
                  {loading ? "Banning..." : "Confirm Ban"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBanForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBanForm(true)}
            >
              Ban User
            </Button>
          )}
        </div>
      </div>
    </SheetContent>
  );
}
