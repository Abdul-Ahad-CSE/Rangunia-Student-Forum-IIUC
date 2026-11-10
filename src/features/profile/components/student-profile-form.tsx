"use client";

import * as React from "react";
import {
  Loader2,
  Save,
  Sparkles,
  Award,
  Compass,
  FileText,
  MapPin,
  FileUp,
  FileCheck,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  updateStudentProfileAction,
  type StudentProfileUpdateInput,
} from "../actions/update-profile-action";

type Props = {
  userId?: string;
  initialData: {
    presentAddress?: string | null;
    cgpa?: string | null;
    skills?: string[];
    interestedSector?: string | null;
    clubRole?: string | null;
    details?: string | null;
    cvUrl?: string | null;
  };
};

export function StudentProfileForm({ userId, initialData }: Props) {
  const [presentAddress, setPresentAddress] = React.useState(initialData.presentAddress || "");
  const [cgpa, setCgpa] = React.useState(initialData.cgpa || "");
  const [skills, setSkills] = React.useState((initialData.skills || []).join(", "));
  const [interestedSector, setInterestedSector] = React.useState(initialData.interestedSector || "");
  const [clubRole, setClubRole] = React.useState(initialData.clubRole || "");
  const [details, setDetails] = React.useState(initialData.details || "");
  const [cvUrl, setCvUrl] = React.useState<string | null>(initialData.cvUrl || null);
  const [localPreviewUrl, setLocalPreviewUrl] = React.useState<string | null>(null);
  const [cvFileName, setCvFileName] = React.useState<string | null>(
    initialData.cvUrl ? "Current_CV.pdf" : null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const pdfInputRef = React.useRef<HTMLInputElement>(null);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Invalid file format. Please upload a PDF document (.pdf only).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("PDF size exceeds 5MB limit. Please upload a compressed document.");
      return;
    }

    // Create client blob URL for safe preview (bypasses browser data URI navigation block)
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    const blobUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(blobUrl);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCvUrl(base64);
      setCvFileName(file.name);
      toast.success(`Selected "${file.name}" for upload.`);
    };

    reader.onerror = () => {
      toast.error("Failed to read the selected PDF file.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveCv = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    setCvUrl(null);
    setCvFileName(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
    toast.info("CV document removed. Click Save to apply changes.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: StudentProfileUpdateInput = {
        presentAddress,
        cgpa,
        skills,
        interestedSector,
        clubRole,
        details,
        cvUrl,
      };

      const res = await updateStudentProfileAction(payload);
      if (res.success) {
        toast.success(res.message || "Profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while saving profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-white/10 bg-[#07130f]/85 backdrop-blur-xl text-white shadow-xl">
      <CardHeader className="border-b border-white/5 pb-4">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Academic & Personal Information</span>
        </CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          Directly edit your academic trajectory, present campus address, career interests, and uploaded CV document.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Present Address */}
          <div className="space-y-2">
            <Label htmlFor="presentAddress" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Present Address (Campus / Hall / Mess)</span>
            </Label>
            <Input
              id="presentAddress"
              placeholder="e.g. Kumira Campus Area, Halishahar, Chittagong"
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
            />
            <p className="text-[11px] text-zinc-500">
              Your active stay during academic semesters. Privacy can be controlled in Privacy Settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2. CGPA */}
            <div className="space-y-2">
              <Label htmlFor="cgpa" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Academic CGPA</span>
              </Label>
              <Input
                id="cgpa"
                placeholder="e.g. 3.82 (Optional)"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
              />
            </div>

            {/* 3. Club/Forum Role */}
            <div className="space-y-2">
              <Label htmlFor="clubRole" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Club / Forum Role</span>
              </Label>
              <Input
                id="clubRole"
                placeholder="e.g. Moderator, Volunteer, General Member"
                value={clubRole}
                onChange={(e) => setClubRole(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
              />
            </div>
          </div>

          {/* 4. Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Skills (Comma-separated)</span>
            </Label>
            <Input
              id="skills"
              placeholder="e.g. Python, Machine Learning, Next.js, Public Speaking"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
            />
            <p className="text-[11px] text-zinc-500">
              Separate each skill with a comma to help peers discover collaborators.
            </p>
          </div>

          {/* 5. Interested Career Sector */}
          <div className="space-y-2">
            <Label htmlFor="interestedSector" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interested Career Sector</span>
            </Label>
            <Input
              id="interestedSector"
              placeholder="e.g. Web Development, AI/ML, Civil Engineering, Telecommunications"
              value={interestedSector}
              onChange={(e) => setInterestedSector(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
            />
          </div>

          {/* 6. CV Document Upload (PDF only) */}
          <div className="space-y-2.5 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <Label htmlFor="cvUpload" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Curriculum Vitae / Resume (PDF Only)</span>
            </Label>

            <input
              ref={pdfInputRef}
              id="cvUpload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
            />

            {cvUrl ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-emerald-200 truncate">
                      {cvFileName || "Student_CV.pdf"}
                    </p>
                    <p className="text-[10px] text-emerald-400/70 font-mono">
                      PDF Document Attached
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={localPreviewUrl || (userId ? `/api/students/${userId}/cv` : cvUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 h-8 px-3 rounded-md text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View CV</span>
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => pdfInputRef.current?.click()}
                    className="h-8 text-xs border-white/10 bg-white/5 text-zinc-200 hover:text-white"
                  >
                    Replace
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCv}
                    className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                    title="Remove CV"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => pdfInputRef.current?.click()}
                className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <FileUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                      Upload PDF Resume / CV
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      Standard PDF documents up to 5MB
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-white/10 bg-white/5 text-zinc-300 pointer-events-none group-hover:border-emerald-500/40"
                >
                  Browse PDF
                </Button>
              </div>
            )}
          </div>

          {/* 7. Details / Bio */}
          <div className="space-y-2">
            <Label htmlFor="details" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Personal Details & Academic Interests</span>
            </Label>
            <Textarea
              id="details"
              rows={4}
              placeholder="Tell other Rangunia students about your semester journey, project ideas, or campus activities..."
              value={details}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDetails(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs resize-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[180px] bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Academic Info</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
