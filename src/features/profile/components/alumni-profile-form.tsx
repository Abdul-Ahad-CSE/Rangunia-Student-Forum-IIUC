"use client";

import * as React from "react";
import { Loader2, Save, Droplet, Briefcase, Building2, MapPin, Clock, FileText } from "lucide-react";
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
  updateAlumniProfileAction,
  type AlumniProfileUpdateInput,
} from "../actions/update-profile-action";

type Props = {
  initialData: {
    bloodGroup?: string | null;
    jobPosition?: string | null;
    industry?: string | null;
    workLocation?: string | null;
    experienceYears?: number | null;
    details?: string | null;
  };
};

export function AlumniProfileForm({ initialData }: Props) {
  const [bloodGroup, setBloodGroup] = React.useState(initialData.bloodGroup || "");
  const [jobPosition, setJobPosition] = React.useState(initialData.jobPosition || "");
  const [industry, setIndustry] = React.useState(initialData.industry || "");
  const [workLocation, setWorkLocation] = React.useState(initialData.workLocation || "");
  const [experience, setExperience] = React.useState(
    initialData.experienceYears ? `${initialData.experienceYears} years` : ""
  );
  const [details, setDetails] = React.useState(initialData.details || "");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: AlumniProfileUpdateInput = {
        bloodGroup,
        jobPosition,
        industry,
        workLocation,
        experienceYears: experience,
        details,
      };

      const res = await updateAlumniProfileAction(payload);
      if (res.success) {
        toast.success(res.message || "Alumni profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to update alumni profile.");
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
          <Briefcase className="w-5 h-5 text-teal-400" />
          <span>Professional Background & Alumni Credentials</span>
        </CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          Update your employment, career progression, and availability to support current students.
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
                className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
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

            {/* Job Position / Business */}
            <div className="space-y-2">
              <Label htmlFor="jobPosition" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                <span>Job Position / Business</span>
              </Label>
              <Input
                id="jobPosition"
                placeholder="e.g. Senior Software Engineer / Founder"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Industry</span>
              </Label>
              <Input
                id="industry"
                placeholder="e.g. Fintech, Healthcare, Telecom"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>

            {/* Work Location */}
            <div className="space-y-2">
              <Label htmlFor="workLocation" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Work Location</span>
              </Label>
              <Input
                id="workLocation"
                placeholder="e.g. Dhaka, Chittagong, Remote, Abroad"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Experience</span>
              </Label>
              <Input
                id="experience"
                placeholder="e.g. 3 years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>
          </div>

          {/* Details / Summary */}
          <div className="space-y-2">
            <Label htmlFor="details" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Professional Details & Mentorship Focus</span>
            </Label>
            <Textarea
              id="details"
              rows={4}
              placeholder="Tell Rangunia juniors about your career trajectory, industry insights, or how you can assist..."
              value={details}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDetails(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500 text-xs resize-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[160px] bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Alumni Profile</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
