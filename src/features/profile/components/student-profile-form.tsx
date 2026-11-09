"use client";

import * as React from "react";
import { Loader2, Save, Droplet, Sparkles, Award, Compass, FileText } from "lucide-react";
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
  initialData: {
    bloodGroup?: string | null;
    cgpa?: string | null;
    skills?: string[];
    interestedSector?: string | null;
    clubRole?: string | null;
    details?: string | null;
  };
};

export function StudentProfileForm({ initialData }: Props) {
  const [bloodGroup, setBloodGroup] = React.useState(initialData.bloodGroup || "");
  const [cgpa, setCgpa] = React.useState(initialData.cgpa || "");
  const [skills, setSkills] = React.useState((initialData.skills || []).join(", "));
  const [interestedSector, setInterestedSector] = React.useState(initialData.interestedSector || "");
  const [clubRole, setClubRole] = React.useState(initialData.clubRole || "");
  const [details, setDetails] = React.useState(initialData.details || "");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: StudentProfileUpdateInput = {
        bloodGroup,
        cgpa,
        skills,
        interestedSector,
        clubRole,
        details,
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
    <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-xl">
      <CardHeader className="border-b border-white/5 pb-4">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Academic & Personal Information</span>
        </CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          Update your student achievements, technical competencies, and forum engagement.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blood Group */}
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-rose-400" />
                <span>Blood Group</span>
              </Label>
              <select
                id="bloodGroup"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="" className="bg-[#07130f]">Select Blood Group</option>
                <option value="A_POSITIVE" className="bg-[#07130f]">A+ (A Positive)</option>
                <option value="A_NEGATIVE" className="bg-[#07130f]">A- (A Negative)</option>
                <option value="B_POSITIVE" className="bg-[#07130f]">B+ (B Positive)</option>
                <option value="B_NEGATIVE" className="bg-[#07130f]">B- (B Negative)</option>
                <option value="AB_POSITIVE" className="bg-[#07130f]">AB+ (AB Positive)</option>
                <option value="AB_NEGATIVE" className="bg-[#07130f]">AB- (AB Negative)</option>
                <option value="O_POSITIVE" className="bg-[#07130f]">O+ (O Positive)</option>
                <option value="O_NEGATIVE" className="bg-[#07130f]">O- (O Negative)</option>
              </select>
            </div>

            {/* CGPA */}
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
          </div>

          {/* Skills */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Interested Sector */}
            <div className="space-y-2">
              <Label htmlFor="interestedSector" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interested Career Sector</span>
              </Label>
              <Input
                id="interestedSector"
                placeholder="e.g. Web Development, AI/ML, Civil, Telecom"
                value={interestedSector}
                onChange={(e) => setInterestedSector(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
              />
            </div>

            {/* Club/Forum Role */}
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

          {/* Details / Bio */}
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
              className="w-full sm:w-auto min-w-[160px] bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Student Profile</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
