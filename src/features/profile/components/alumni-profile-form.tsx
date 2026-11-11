"use client";

import * as React from "react";
import {
  Loader2,
  Save,
  Briefcase,
  GraduationCap,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  FileText,
  Compass,
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  updateAlumniProfileAction,
  type AlumniProfileUpdateInput,
} from "../actions/update-profile-action";

type Props = {
  initialData: {
    presentAddress?: string | null;
    forumRole?: string | null;
    skills?: string[];
    cgpa?: string | null;
    jobPosition?: string | null;
    industry?: string | null;
    workLocation?: string | null;
    experienceYears?: number | null;
    personalDetails?: string | null;
    higherStudyUniversity?: string | null;
    higherStudyCountry?: string | null;
    higherStudyDegree?: string | null;
    scholarshipInfo?: string | null;
    researchThesisTitle?: string | null;
    higherEducationDetails?: string | null;
    mentorshipAvailable?: boolean | null;
    mentorshipDetails?: string | null;
  };
};

export function AlumniProfileForm({ initialData }: Props) {
  // 1. Academic & Personal Form State
  const [presentAddress, setPresentAddress] = React.useState(initialData.presentAddress || "");
  const [forumRole, setForumRole] = React.useState(initialData.forumRole || "");
  const [skills, setSkills] = React.useState((initialData.skills || []).join(", "));
  const [cgpa, setCgpa] = React.useState(initialData.cgpa || "");
  const [jobPosition, setJobPosition] = React.useState(initialData.jobPosition || "");
  const [industry, setIndustry] = React.useState(initialData.industry || "");
  const [workLocation, setWorkLocation] = React.useState(initialData.workLocation || "");
  const [experience, setExperience] = React.useState(
    initialData.experienceYears ? `${initialData.experienceYears} years` : ""
  );
  const [personalDetails, setPersonalDetails] = React.useState(initialData.personalDetails || "");

  // 2. Higher Education Form State
  const [higherStudyUniversity, setHigherStudyUniversity] = React.useState(
    initialData.higherStudyUniversity || ""
  );
  const [higherStudyCountry, setHigherStudyCountry] = React.useState(
    initialData.higherStudyCountry || ""
  );
  const [higherStudyDegree, setHigherStudyDegree] = React.useState(
    initialData.higherStudyDegree || ""
  );
  const [scholarshipInfo, setScholarshipInfo] = React.useState(initialData.scholarshipInfo || "");
  const [researchThesisTitle, setResearchThesisTitle] = React.useState(
    initialData.researchThesisTitle || ""
  );
  const [higherEducationDetails, setHigherEducationDetails] = React.useState(
    initialData.higherEducationDetails || ""
  );

  // 3. Mentorship Settings Form State
  const [mentorshipAvailable, setMentorshipAvailable] = React.useState(
    Boolean(initialData.mentorshipAvailable)
  );
  const [mentorshipDetails, setMentorshipDetails] = React.useState(
    initialData.mentorshipDetails || ""
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: AlumniProfileUpdateInput = {
        presentAddress,
        forumRole,
        skills,
        cgpa,
        jobPosition,
        industry,
        workLocation,
        experienceYears: experience,
        personalDetails,
        higherStudyUniversity,
        higherStudyCountry,
        higherStudyDegree,
        scholarshipInfo,
        researchThesisTitle,
        higherEducationDetails,
        mentorshipAvailable,
        mentorshipDetails,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECTION 1: Academic & Personal Information */}
      <Card className="border border-white/10 bg-[#07130f]/85 backdrop-blur-xl text-white shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-400" />
            <span>Academic &amp; Personal Information</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Update your present residence, forum contributions, professional employment, and career trajectory.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Present Address */}
          <div className="space-y-2">
            <Label htmlFor="presentAddress" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Present Address</span>
            </Label>
            <Input
              id="presentAddress"
              placeholder="e.g. Nasirabad, Chittagong / Dhanmondi, Dhaka / London, UK"
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Forum Role */}
            <div className="space-y-2">
              <Label htmlFor="forumRole" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>Forum Role</span>
              </Label>
              <Input
                id="forumRole"
                placeholder="e.g. Former President, Senior Advisor, General Member"
                value={forumRole}
                onChange={(e) => setForumRole(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>

            {/* Academic CGPA */}
            <div className="space-y-2">
              <Label htmlFor="cgpa" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Academic CGPA</span>
              </Label>
              <Input
                id="cgpa"
                placeholder="e.g. 3.82"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Skills</span>
            </Label>
            <Input
              id="skills"
              placeholder="e.g. Cloud Architecture, Machine Learning, Leadership, FinTech"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Position / Business */}
            <div className="space-y-2">
              <Label htmlFor="jobPosition" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                <span>Job Position / Business</span>
              </Label>
              <Input
                id="jobPosition"
                placeholder="e.g. Principal Software Engineer, Founder &amp; CEO"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Industry</span>
              </Label>
              <Input
                id="industry"
                placeholder="e.g. Information Technology, Banking, Telecommunications"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Work Location */}
            <div className="space-y-2">
              <Label htmlFor="workLocation" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Work Location</span>
              </Label>
              <Input
                id="workLocation"
                placeholder="e.g. Dhaka, Chittagong, Remote, Dubai"
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
                placeholder="e.g. 5 years, 8 years"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>
          </div>

          {/* Personal & Professional Details */}
          <div className="space-y-2">
            <Label htmlFor="personalDetails" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Personal &amp; Professional Details</span>
            </Label>
            <Textarea
              id="personalDetails"
              rows={3}
              placeholder="Share career milestones, areas of mentorship expertise, or advice for junior Rangunia students..."
              value={personalDetails}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPersonalDetails(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500 text-xs resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Higher Education Section */}
      <Card className="border border-white/10 bg-[#07130f]/85 backdrop-blur-xl text-white shadow-xl">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            <span>Higher Education</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Share postgraduate studies, overseas academic accomplishments, research publications, and scholarships.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current University */}
            <div className="space-y-2">
              <Label htmlFor="higherStudyUniversity" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>Current University</span>
              </Label>
              <Input
                id="higherStudyUniversity"
                placeholder="e.g. Sapienza University of Rome, Technical University of Munich"
                value={higherStudyUniversity}
                onChange={(e) => setHigherStudyUniversity(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="higherStudyCountry" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Country</span>
              </Label>
              <Input
                id="higherStudyCountry"
                placeholder="e.g. Italy, United States, Germany, Japan"
                value={higherStudyCountry}
                onChange={(e) => setHigherStudyCountry(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Degree */}
            <div className="space-y-2">
              <Label htmlFor="higherStudyDegree" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-teal-400" />
                <span>Degree</span>
              </Label>
              <Input
                id="higherStudyDegree"
                placeholder="e.g. MSc in Computer Science, PhD, MBA"
                value={higherStudyDegree}
                onChange={(e) => setHigherStudyDegree(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>

            {/* Scholarship */}
            <div className="space-y-2">
              <Label htmlFor="scholarshipInfo" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Scholarship</span>
              </Label>
              <Input
                id="scholarshipInfo"
                placeholder="e.g. Erasmus Mundus, Fulbright, DAAD, Government Grant"
                value={scholarshipInfo}
                onChange={(e) => setScholarshipInfo(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
              />
            </div>
          </div>

          {/* Research / Thesis Title */}
          <div className="space-y-2">
            <Label htmlFor="researchThesisTitle" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Research / Thesis Title</span>
            </Label>
            <Input
              id="researchThesisTitle"
              placeholder="e.g. Optimizing Distributed Machine Learning Pipelines in Heterogeneous Clouds"
              value={researchThesisTitle}
              onChange={(e) => setResearchThesisTitle(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500"
            />
          </div>

          {/* Higher Education Details */}
          <div className="space-y-2">
            <Label htmlFor="higherEducationDetails" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Higher Education Details</span>
            </Label>
            <Textarea
              id="higherEducationDetails"
              rows={3}
              placeholder="Describe your research focus, lab affiliation, supervisor, publications, or postgrad highlights..."
              value={higherEducationDetails}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHigherEducationDetails(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500 text-xs resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Mentorship Settings */}
      <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Mentorship Settings</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Offer career mentorship, academic advice, or industry guidance to current IIUC students.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4 text-xs">
          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="space-y-0.5">
              <Label htmlFor="mentorshipAvailable" className="text-xs font-semibold text-white cursor-pointer">
                Available for mentorship?
              </Label>
              <p className="text-[11px] text-zinc-400">
                When enabled, students can view your mentorship scope and send guidance requests.
              </p>
            </div>
            <Switch
              id="mentorshipAvailable"
              checked={mentorshipAvailable}
              onCheckedChange={setMentorshipAvailable}
            />
          </div>

          {/* Mentorship Details & Opportunities */}
          <div className="space-y-2">
            <Label htmlFor="mentorshipDetails" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Mentorship Details &amp; Opportunities</span>
            </Label>
            <Textarea
              id="mentorshipDetails"
              rows={3}
              placeholder="e.g. Open to mentoring students in Full-Stack Web Development, reviewing CVs for tech roles, or offering guidance for MSc admissions in Europe..."
              value={mentorshipDetails}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMentorshipDetails(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-teal-500 text-xs resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto min-w-[180px] bg-teal-600 hover:bg-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40"
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
  );
}
