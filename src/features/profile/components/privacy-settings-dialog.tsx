"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Camera,
  Phone,
  Mail,
  Share2,
  MapPin,
  Lock,
  Eye,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  updatePrivacySettingsAction,
  type PrivacySettingsInput,
} from "../actions/update-privacy-settings-action";

interface PrivacySettingsDialogProps {
  initialSettings: PrivacySettingsInput;
}

export function PrivacySettingsDialog({ initialSettings }: PrivacySettingsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<PrivacySettingsInput>(initialSettings);
  const [activePendingKey, setActivePendingKey] = React.useState<keyof PrivacySettingsInput | null>(null);

  const handleToggle = async (key: keyof PrivacySettingsInput, newValue: boolean) => {
    const updated = { ...settings, [key]: newValue };
    setSettings(updated);
    setActivePendingKey(key);

    try {
      const res = await updatePrivacySettingsAction(updated);
      if (res.success) {
        toast.success(
          `${key.replace("is", "").replace("Visible", "")} visibility ${
            newValue ? "enabled (Visible in Directory)" : "disabled (Masked on Server)"
          }`
        );
      } else {
        // Revert on error
        setSettings(settings);
        toast.error(res.error || "Failed to update privacy settings");
      }
    } catch {
      setSettings(settings);
      toast.error("Network error while updating privacy settings");
    } finally {
      setActivePendingKey(null);
    }
  };

  const toggles: Array<{
    key: keyof PrivacySettingsInput;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      key: "isPhotoVisible",
      title: "Profile Photo",
      description: "Allow your avatar photo to appear on directory cards and profile views.",
      icon: Camera,
    },
    {
      key: "isPhoneVisible",
      title: "Phone Number",
      description: "Display your primary phone contact to verified community peers.",
      icon: Phone,
    },
    {
      key: "isEmailVisible",
      title: "Email Address",
      description: "Show your personal/university email on your public directory profile.",
      icon: Mail,
    },
    {
      key: "isSocialVisible",
      title: "Social Links",
      description: "Expose your LinkedIn, Facebook, and professional portfolio links.",
      icon: Share2,
    },
    {
      key: "isAddressVisible",
      title: "Address & Origin",
      description: "Display your Rangunia origin and campus residences publicly.",
      icon: MapPin,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-500/20 text-emerald-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shrink-0"
          />
        }
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Manage Privacy</span>
      </DialogTrigger>

      <DialogContent className="border border-white/10 bg-[#07130f] text-white shadow-2xl sm:max-w-lg p-6">
        <DialogHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <span>Public Privacy Controls</span>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[10px] font-mono"
                >
                  Server Shield Active
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-0.5">
                Toggle which fields are visible in the public directory. Changes apply instantly.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Toggle Items */}
        <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
          {toggles.map((item) => {
            const Icon = item.icon;
            const isVisible = settings[item.key];
            const isPending = activePendingKey === item.key;

            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                      <Badge
                        variant="outline"
                        className={
                          isVisible
                            ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[9px] py-0 px-1.5"
                            : "border-zinc-700 bg-zinc-900/60 text-zinc-400 text-[9px] py-0 px-1.5"
                        }
                      >
                        {isVisible ? (
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-2.5 h-2.5" /> Public
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Masked
                          </span>
                        )}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
                  <Switch
                    checked={isVisible}
                    onCheckedChange={(checked) => handleToggle(item.key, checked)}
                    disabled={isPending}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="border-t border-white/5 pt-4 flex flex-row items-center justify-between sm:justify-between">
          <p className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Privacy by default enforced</span>
          </p>
          <DialogClose
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/50"
              />
            }
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            <span>Done</span>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
