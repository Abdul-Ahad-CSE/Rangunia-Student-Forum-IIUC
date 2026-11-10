"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  EyeOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  updatePrivacySettingsAction,
  type PrivacySettingsInput,
} from "@/features/profile/actions/update-privacy-settings-action";

interface PrivacySettingsCardProps {
  initialSettings: PrivacySettingsInput;
}

export function PrivacySettingsCard({ initialSettings }: PrivacySettingsCardProps) {
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
      description: "Allow your profile photo to appear on directory cards and member lists.",
      icon: Camera,
    },
    {
      key: "isPhoneVisible",
      title: "Phone Number",
      description: "Display your primary contact number for community members.",
      icon: Phone,
    },
    {
      key: "isEmailVisible",
      title: "Email Address",
      description: "Show your IIUC/personal email address on your public member card.",
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
      description: "Display your Rangunia origin/permanent address location.",
      icon: MapPin,
    },
  ];

  return (
    <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border border-emerald-500/30 bg-emerald-950/50 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Smart Privacy Controls</span>
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-[10px] font-mono">
                  Server Masked
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Choose exactly what information is shared with the public directory.
              </CardDescription>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-full">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Private by default</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="divide-y divide-white/5">
          {toggles.map((item) => {
            const Icon = item.icon;
            const isChecked = settings[item.key];
            const isPending = activePendingKey === item.key;

            return (
              <div
                key={item.key}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 transition-colors rounded-xl px-2 -mx-2 hover:bg-white/[0.02]"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      isChecked
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "border-white/10 bg-zinc-900/50 text-zinc-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={`privacy-${item.key}`}
                      className="text-sm font-semibold text-zinc-200 cursor-pointer flex items-center gap-2"
                    >
                      <span>{item.title}</span>
                      <span className="text-[10px] font-normal font-mono">
                        {isChecked ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5" /> Public
                          </span>
                        ) : (
                          <span className="text-zinc-500 flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5" /> Hidden
                          </span>
                        )}
                      </span>
                    </Label>
                    <p className="text-xs text-zinc-400 leading-normal max-w-md">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPending && <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />}
                  <Switch
                    id={`privacy-${item.key}`}
                    checked={isChecked}
                    onCheckedChange={(val) => handleToggle(item.key, val)}
                    disabled={isPending}
                    aria-label={`Toggle visibility of ${item.title}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Assurance Banner */}
        <div className="mt-4 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 text-xs flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] text-zinc-300">
            <strong className="text-emerald-300">Zero-Leak Server Architecture:</strong> When any item is toggled off, our server strips the data completely before returning it to public APIs and pages. Hidden data is never sent over the wire.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
