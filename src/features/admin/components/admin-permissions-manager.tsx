"use client";

import * as React from "react";
import Image from "next/image";
import {
  Search,
  UserCheck,
  FileText,
  Calendar,
  Droplet,
  Loader2,
  ShieldAlert,
  Sparkles,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateAdminPermissionsAction } from "@/features/admin/actions/permission-actions";

export interface SerializedAdminPermissionUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  studentId: string;
  department: string;
  section: string;
  position: string;
  enrollment: string;
  canManageProfiles: boolean;
  canPostNotices: boolean;
  canManageEvents: boolean;
  canManageEmergency: boolean;
  createdAt: string;
}

interface AdminPermissionsManagerProps {
  initialAdmins: SerializedAdminPermissionUser[];
}

export function AdminPermissionsManager({ initialAdmins }: AdminPermissionsManagerProps) {
  const [admins, setAdmins] = React.useState<SerializedAdminPermissionUser[]>(initialAdmins);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<"ALL" | "WITH_PERMS" | "NO_PERMS">("ALL");
  const [updatingAdminId, setUpdatingAdminId] = React.useState<string | null>(null);

  // Filter admins based on search query and permission filter
  const filteredAdmins = React.useMemo(() => {
    return admins.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase());

      const hasAnyPerm =
        admin.canManageProfiles ||
        admin.canPostNotices ||
        admin.canManageEvents ||
        admin.canManageEmergency;

      if (!matchesSearch) return false;
      if (filterType === "WITH_PERMS") return hasAnyPerm;
      if (filterType === "NO_PERMS") return !hasAnyPerm;
      return true;
    });
  }, [admins, searchQuery, filterType]);

  const handleToggle = async (
    adminId: string,
    field: "canManageProfiles" | "canPostNotices" | "canManageEvents" | "canManageEmergency",
    newValue: boolean
  ) => {
    const admin = admins.find((a) => a.id === adminId);
    if (!admin) return;

    const previousAdminState = { ...admin };

    // Optimistically update local state
    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, [field]: newValue } : a))
    );
    setUpdatingAdminId(adminId);

    const updatedPermissions = {
      canManageProfiles: field === "canManageProfiles" ? newValue : admin.canManageProfiles,
      canPostNotices: field === "canPostNotices" ? newValue : admin.canPostNotices,
      canManageEvents: field === "canManageEvents" ? newValue : admin.canManageEvents,
      canManageEmergency: field === "canManageEmergency" ? newValue : admin.canManageEmergency,
    };

    const res = await updateAdminPermissionsAction({
      adminId,
      ...updatedPermissions,
    });

    setUpdatingAdminId(null);

    if (res.success) {
      toast.success(res.message || "Permission updated successfully.");
    } else {
      // Revert on error
      setAdmins((prev) =>
        prev.map((a) => (a.id === adminId ? previousAdminState : a))
      );
      toast.error(res.error || "Failed to update permission.");
    }
  };

  const handleSetAll = async (adminId: string, grantAll: boolean) => {
    const admin = admins.find((a) => a.id === adminId);
    if (!admin) return;

    const previousAdminState = { ...admin };

    setAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId
          ? {
              ...a,
              canManageProfiles: grantAll,
              canPostNotices: grantAll,
              canManageEvents: grantAll,
              canManageEmergency: grantAll,
            }
          : a
      )
    );
    setUpdatingAdminId(adminId);

    const res = await updateAdminPermissionsAction({
      adminId,
      canManageProfiles: grantAll,
      canPostNotices: grantAll,
      canManageEvents: grantAll,
      canManageEmergency: grantAll,
    });

    setUpdatingAdminId(null);

    if (res.success) {
      toast.success(
        grantAll
          ? `All capabilities granted to ${admin.name}.`
          : `All capabilities revoked from ${admin.name}.`
      );
    } else {
      setAdmins((prev) =>
        prev.map((a) => (a.id === adminId ? previousAdminState : a))
      );
      toast.error(res.error || "Failed to update permissions.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Control & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, student ID, department..."
            className="pl-9.5 border-white/10 bg-black/40 text-white placeholder:text-zinc-500 focus-visible:border-emerald-500 text-xs sm:text-sm h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFilterType("ALL")}
            className={`text-xs h-8 ${
              filterType === "ALL"
                ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            All Admins ({admins.length})
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFilterType("WITH_PERMS")}
            className={`text-xs h-8 ${
              filterType === "WITH_PERMS"
                ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            Authorized ({admins.filter((a) => a.canManageProfiles || a.canPostNotices || a.canManageEvents || a.canManageEmergency).length})
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFilterType("NO_PERMS")}
            className={`text-xs h-8 ${
              filterType === "NO_PERMS"
                ? "border-amber-500/50 bg-amber-950/40 text-amber-300"
                : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            No Access ({admins.filter((a) => !a.canManageProfiles && !a.canPostNotices && !a.canManageEvents && !a.canManageEmergency).length})
          </Button>
        </div>
      </div>

      {/* Main Administrator List */}
      {filteredAdmins.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
          <ShieldAlert className="w-10 h-10 text-zinc-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-white">No administrators match your filter</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or switching filters to view active executive accounts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredAdmins.map((admin) => {
            const hasAllPerms =
              admin.canManageProfiles &&
              admin.canPostNotices &&
              admin.canManageEvents &&
              admin.canManageEmergency;
            const hasNoPerms =
              !admin.canManageProfiles &&
              !admin.canPostNotices &&
              !admin.canManageEvents &&
              !admin.canManageEmergency;
            const isUpdating = updatingAdminId === admin.id;

            return (
              <div
                key={admin.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#07130f]/80 backdrop-blur-xl shadow-xl transition-all hover:border-emerald-500/30"
              >
                {/* Header Row: Admin Info + Quick Batch Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/15 bg-zinc-900 shrink-0 flex items-center justify-center">
                      {admin.photoUrl ? (
                        <Image
                          src={admin.photoUrl}
                          alt={admin.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white leading-tight">
                          {admin.name}
                        </h3>
                        <Badge
                          className={
                            hasAllPerms
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]"
                              : hasNoPerms
                              ? "bg-zinc-800 text-zinc-400 border-white/10 text-[10px]"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/40 text-[10px]"
                          }
                        >
                          {hasAllPerms
                            ? "Full Authority"
                            : hasNoPerms
                            ? "Restricted / View Only"
                            : "Partial Authority"}
                        </Badge>
                      </div>

                      <p className="text-xs text-zinc-400 mt-0.5">
                        <strong className="text-emerald-400 font-medium">{admin.position}</strong>
                        {" • "}
                        <span className="font-mono text-zinc-300">{admin.studentId}</span>
                        {" • "}
                        <span>{admin.department}</span>
                        {" • "}
                        <span className="text-zinc-500">{admin.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isUpdating && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 mr-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </span>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetAll(admin.id, true)}
                      disabled={isUpdating || hasAllPerms}
                      className="border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-emerald-950/40 text-xs h-7.5 px-2.5"
                    >
                      <Sparkles className="w-3 h-3 mr-1 text-emerald-400" />
                      <span>Grant All</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetAll(admin.id, false)}
                      disabled={isUpdating || hasNoPerms}
                      className="border-white/10 bg-white/5 text-zinc-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs h-7.5 px-2.5"
                    >
                      <span>Revoke All</span>
                    </Button>
                  </div>
                </div>

                {/* 4 Granular Capability Toggles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
                  {/* Flag 1: Profiles */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      admin.canManageProfiles
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <UserCheck className={`w-3.5 h-3.5 ${admin.canManageProfiles ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span>Member Profiles</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Verify student & alumni profiles and approve update requests.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageProfiles}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageProfiles", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle profile management for ${admin.name}`}
                    />
                  </div>

                  {/* Flag 2: Notices */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      admin.canPostNotices
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <FileText className={`w-3.5 h-3.5 ${admin.canPostNotices ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span>Publish Notices</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Draft, edit, and broadcast official announcements to the forum.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canPostNotices}
                      onCheckedChange={(val) => handleToggle(admin.id, "canPostNotices", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle notice posting for ${admin.name}`}
                    />
                  </div>

                  {/* Flag 3: Events */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      admin.canManageEvents
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Calendar className={`w-3.5 h-3.5 ${admin.canManageEvents ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span>Event Programs</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Organize annual iftar, orientation, seminars, and sports meetups.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageEvents}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageEvents", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle event management for ${admin.name}`}
                    />
                  </div>

                  {/* Flag 4: Emergency */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      admin.canManageEmergency
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Droplet className={`w-3.5 h-3.5 ${admin.canManageEmergency ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span>Emergency Network</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Coordinate emergency blood donor requests and volunteer responses.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageEmergency}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageEmergency", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle emergency management for ${admin.name}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
