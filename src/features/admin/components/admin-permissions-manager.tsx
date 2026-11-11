"use client";

import * as React from "react";
import Image from "next/image";
import {
  Search,
  UserCheck,
  FileText,
  Calendar,
  Activity,
  Users,
  Info,
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
  canManageEvents: boolean;
  canManageNotices: boolean;
  canManageActivities: boolean;
  canManageCommittee: boolean;
  canManageAbout: boolean;
  createdAt: string;
}

export type AdminPermissionField =
  | "canManageProfiles"
  | "canManageEvents"
  | "canManageNotices"
  | "canManageActivities"
  | "canManageCommittee"
  | "canManageAbout";

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
        admin.canManageEvents ||
        admin.canManageNotices ||
        admin.canManageActivities ||
        admin.canManageCommittee ||
        admin.canManageAbout;

      if (!matchesSearch) return false;
      if (filterType === "WITH_PERMS") return hasAnyPerm;
      if (filterType === "NO_PERMS") return !hasAnyPerm;
      return true;
    });
  }, [admins, searchQuery, filterType]);

  const handleToggle = async (
    adminId: string,
    field: AdminPermissionField,
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
      canManageEvents: field === "canManageEvents" ? newValue : admin.canManageEvents,
      canManageNotices: field === "canManageNotices" ? newValue : admin.canManageNotices,
      canManageActivities: field === "canManageActivities" ? newValue : admin.canManageActivities,
      canManageCommittee: field === "canManageCommittee" ? newValue : admin.canManageCommittee,
      canManageAbout: field === "canManageAbout" ? newValue : admin.canManageAbout,
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
              canManageEvents: grantAll,
              canManageNotices: grantAll,
              canManageActivities: grantAll,
              canManageCommittee: grantAll,
              canManageAbout: grantAll,
            }
          : a
      )
    );
    setUpdatingAdminId(adminId);

    const res = await updateAdminPermissionsAction({
      adminId,
      canManageProfiles: grantAll,
      canManageEvents: grantAll,
      canManageNotices: grantAll,
      canManageActivities: grantAll,
      canManageCommittee: grantAll,
      canManageAbout: grantAll,
    });

    setUpdatingAdminId(null);

    if (res.success) {
      toast.success(
        grantAll
          ? `All 6 capabilities granted to ${admin.name}.`
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
            Authorized ({admins.filter((a) => a.canManageProfiles || a.canManageEvents || a.canManageNotices || a.canManageActivities || a.canManageCommittee || a.canManageAbout).length})
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
            No Access ({admins.filter((a) => !a.canManageProfiles && !a.canManageEvents && !a.canManageNotices && !a.canManageActivities && !a.canManageCommittee && !a.canManageAbout).length})
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
              admin.canManageEvents &&
              admin.canManageNotices &&
              admin.canManageActivities &&
              admin.canManageCommittee &&
              admin.canManageAbout;

            const hasNoPerms =
              !admin.canManageProfiles &&
              !admin.canManageEvents &&
              !admin.canManageNotices &&
              !admin.canManageActivities &&
              !admin.canManageCommittee &&
              !admin.canManageAbout;

            const isUpdating = updatingAdminId === admin.id;

            return (
              <div
                key={admin.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl transition-all space-y-4"
              >
                {/* Admin Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3.5">
                    {/* Admin Avatar */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/30 bg-zinc-900 shrink-0 flex items-center justify-center text-emerald-400 font-bold font-mono text-base">
                      {admin.photoUrl ? (
                        <Image
                          src={admin.photoUrl}
                          alt={admin.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>

                    {/* Admin Meta */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-white text-base leading-tight">
                          {admin.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-950/30 text-emerald-300 text-[10px]"
                        >
                          {admin.position}
                        </Badge>
                        {hasAllPerms && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono">
                            <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-400" />
                            Full Authority
                          </Badge>
                        )}
                        {hasNoPerms && (
                          <Badge className="bg-zinc-800 text-zinc-400 border-white/10 text-[10px] font-mono">
                            No Permissions
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
                        <span className="font-mono text-zinc-300">{admin.studentId}</span>
                        <span>•</span>
                        <span>{admin.department}</span>
                        <span>•</span>
                        <span>Sec: {admin.section}</span>
                        <span>•</span>
                        <span className="text-zinc-500">{admin.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isUpdating && (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono pr-2">
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
                      className="border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 text-xs h-7.5 px-2.5"
                    >
                      <span>Grant All 6</span>
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

                {/* 6 Granular Capability Toggles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                  {/* Flag 1: Member Profiles */}
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
                        Verify student &amp; alumni profiles and moderate directory records.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageProfiles}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageProfiles", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle profile management for ${admin.name}`}
                    />
                  </div>

                  {/* Flag 2: Events */}
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
                        <span>Event Management</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Organize forums, seminars, iftar gatherings, and sports meetups.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageEvents}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageEvents", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle event management for ${admin.name}`}
                    />
                  </div>

                  {/* Flag 3: Notices */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      admin.canManageNotices
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <FileText className={`w-3.5 h-3.5 ${admin.canManageNotices ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span>Notice Management</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Publish and broadcast official forum announcements and notices.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageNotices}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageNotices", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle notice management for ${admin.name}`}
                    />
                  </div>

                  {/* Flag 4: Activities */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      admin.canManageActivities
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Activity className={`w-3.5 h-3.5 ${admin.canManageActivities ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span>Activity Management</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Coordinate ongoing projects, skill workshops, and community initiatives.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageActivities}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageActivities", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle activity management for ${admin.name}`}
                    />
                  </div>

                  {/* Flag 5: Committee */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      admin.canManageCommittee
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Users className={`w-3.5 h-3.5 ${admin.canManageCommittee ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span>Committee Management</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Manage executive committee, advisory panels, and leadership portfolios.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageCommittee}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageCommittee", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle committee management for ${admin.name}`}
                    />
                  </div>

                  {/* Flag 6: About */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      admin.canManageAbout
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Info className={`w-3.5 h-3.5 ${admin.canManageAbout ? "text-emerald-400" : "text-zinc-500"}`} />
                        <span>About Management</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">
                        Update forum history, constitution, mission statement, and about pages.
                      </p>
                    </div>

                    <Switch
                      checked={admin.canManageAbout}
                      onCheckedChange={(val) => handleToggle(admin.id, "canManageAbout", val)}
                      disabled={isUpdating}
                      aria-label={`Toggle about management for ${admin.name}`}
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
