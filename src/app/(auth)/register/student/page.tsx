"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  ArrowRight,
  Info,
  Upload,
  X,
  Droplet,
  BookOpen,
  Building,
  Calendar,
  Globe,
  ShieldAlert,
} from "lucide-react";
import {
  studentRegisterSchema,
  type StudentRegisterInput,
} from "@/features/students/schemas/student-registration.schema";
import { registerStudentAction } from "@/features/students/actions/register-student-action";
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
import { motion } from "motion/react";
import { toast } from "sonner";

export default function StudentRegisterPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [femalePrivacyNotice, setFemalePrivacyNotice] = React.useState(false);
  const [selectedGender, setSelectedGender] = React.useState<"Male" | "Female">("Male");
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = React.useState<string | null>(null);
  const [isFemaleAnimating, setIsFemaleAnimating] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegisterInput>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      gender: "Male",
      university: "International Islamic University Chittagong (IIUC)",
      department: "CSE",
      batch: "48th",
      session: "Autumn 2021",
      currentSemester: "6th",
      bloodGroup: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setServerError("Please select an image smaller than 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setValue("photoUrl", base64);
      setPhotoPreview(base64);
      setPhotoFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setValue("photoUrl", "");
    setPhotoPreview(null);
    setPhotoFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenderFemaleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsFemaleAnimating(true);
    setTimeout(() => setIsFemaleAnimating(false), 650);

    toast("🌸 We care about your privacy, please contact with female executives for further information.", {
      duration: 6000,
      style: {
        background: "rgba(12, 26, 20, 0.95)",
        border: "1px solid rgba(244, 63, 94, 0.4)",
        color: "#ffffff",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(244, 63, 94, 0.25)",
        backdropFilter: "blur(12px)",
      },
    });

    setFemalePrivacyNotice(true);
    setSelectedGender("Male");
    setValue("gender", "Male");
  };

  const onSubmit = async (data: StudentRegisterInput) => {
    setServerError(null);
    setSuccessMessage(null);

    const res = await registerStudentAction(data);

    if (!res.success) {
      setServerError(res.error || "Failed to submit student registration");
    } else {
      toast.success("Registration request submitted. Please wait for executive approval.");
      setSuccessMessage(res.message || "Registration request submitted. Please wait for executive approval.");
    }
  };

  return (
    <div className="min-h-screen bg-[#040907] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-2xl mx-auto">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-6 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Role Selection</span>
          </Link>
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-sans font-extrabold tracking-tight text-white sm:text-4xl">
            Student Member Registration
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-lg">
            Create your verified student profile in Rangunia Students Forum (IIUC Chapter).
          </p>
        </div>

        {/* Success Banner */}
        {successMessage ? (
          <Card className="border-emerald-500/40 bg-emerald-950/20 backdrop-blur-xl text-white">
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Registration Request Submitted!</h2>
              <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/login">
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                    <span>Return to Login</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto border-white/15 bg-white/5 text-zinc-200">
                    Return to Landing Page
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-2xl">
            <CardHeader className="border-b border-white/5 pb-6">
              <CardTitle className="text-xl text-white font-bold">
                Student Profile Information
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Please provide accurate academic details for identity and forum verification.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Server Error Alert */}
              {serverError && (
                <div className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-rose-300 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Female Privacy Alert Notification */}
              {femalePrivacyNotice && (
                <div className="mb-6 p-4 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-200 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-rose-300">
                      Privacy & Confidentiality Notice
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      &quot;🌸 We care about your privacy, please contact with female executives.&quot;
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Female student data and communications are strictly guarded through dedicated female executive liaisons.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* 1. Full Name & IIUC Student ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Full Name</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="e.g. Mohammad Abdullah"
                      {...register("fullName")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-rose-400">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>IIUC Student ID</span>
                    </Label>
                    <Input
                      id="studentId"
                      placeholder="e.g. C213045"
                      {...register("studentId")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.studentId && (
                      <p className="text-xs text-rose-400">{errors.studentId.message}</p>
                    )}
                  </div>
                </div>

                {/* 2. SPECIAL GENDER PRIVACY GATEKEEPER (TOP OF FORM) */}
                <div className="space-y-2 p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-zinc-300">
                      Gender Verification
                    </Label>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                      <Info className="w-3.5 h-3.5 text-emerald-400" />
                      Privacy Gatekeeper
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Option: Male (Selectable) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGender("Male");
                        setValue("gender", "Male");
                        setFemalePrivacyNotice(false);
                      }}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                        selectedGender === "Male"
                          ? "border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-md shadow-emerald-950"
                          : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          selectedGender === "Male"
                            ? "border-emerald-400 bg-emerald-400"
                            : "border-zinc-500"
                        }`}
                      >
                        {selectedGender === "Male" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </span>
                      <span>Male</span>
                    </button>

                    {/* Option: Female (Framer Motion Animation / Triggers Toast / Non-selectable) */}
                    <motion.button
                      type="button"
                      onClick={handleGenderFemaleClick}
                      animate={
                        isFemaleAnimating
                          ? {
                              scale: [1, 0.95, 1.05, 0.98, 1],
                              rotate: [0, -2, 2, -1, 0],
                              boxShadow: [
                                "0 0 0 rgba(244, 63, 94, 0)",
                                "0 0 25px rgba(244, 63, 94, 0.5)",
                                "0 0 12px rgba(244, 63, 94, 0.3)",
                                "0 0 0 rgba(244, 63, 94, 0)",
                              ],
                              borderColor: [
                                "rgba(255, 255, 255, 0.1)",
                                "rgba(244, 63, 94, 0.8)",
                                "rgba(251, 113, 133, 0.6)",
                                "rgba(255, 255, 255, 0.1)",
                              ],
                            }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.94 }}
                      className="relative flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:border-rose-500/40 hover:bg-rose-950/20 hover:text-rose-300 transition-colors cursor-pointer select-none overflow-hidden"
                      title="Click for privacy protocol"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-zinc-500" />
                      <span>Female</span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono flex items-center gap-1 border border-rose-500/20">
                        <span>🌸</span>
                        <span>Protected</span>
                      </span>
                    </motion.button>
                  </div>

                  {errors.gender && (
                    <p className="text-xs text-rose-400">{errors.gender.message}</p>
                  )}
                </div>

                {/* 3. Optional Profile Photo File Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="student-photo" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Profile Photo</span>
                    </Label>
                    <span className="text-[10px] text-zinc-400 font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    id="student-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />

                  {photoPreview ? (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-500/40 bg-zinc-900 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoPreview}
                          alt="Photo Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate">
                          {photoFileName || "Photo selected"}
                        </p>
                        <p className="text-[10px] text-emerald-400">Ready to upload</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePhoto}
                        className="h-8 px-2.5 text-xs text-rose-300 hover:text-white hover:bg-rose-950/50"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        <span>Remove</span>
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-between p-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                            Choose Photo from Device
                          </p>
                          <p className="text-[10px] text-zinc-500">PNG, JPG, WebP up to 3MB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-white/10 bg-white/5 text-zinc-300 pointer-events-none"
                      >
                        Browse
                      </Button>
                    </div>
                  )}
                  {errors.photoUrl && (
                    <p className="text-xs text-rose-400">{errors.photoUrl.message}</p>
                  )}
                </div>

                {/* 4. University & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-emerald-400" />
                      <span>University</span>
                    </Label>
                    <Input
                      id="university"
                      readOnly
                      defaultValue="International Islamic University Chittagong (IIUC)"
                      className="border-white/10 bg-white/5 text-zinc-300 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Department</span>
                    </Label>
                    <Input
                      id="department"
                      placeholder="e.g. CSE, EEE, BBA, Pharmacy"
                      {...register("department")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.department && (
                      <p className="text-xs text-rose-400">{errors.department.message}</p>
                    )}
                  </div>
                </div>

                {/* 5. Batch, Session, Current Semester */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch" className="text-xs font-semibold text-zinc-300">
                      Batch
                    </Label>
                    <Input
                      id="batch"
                      placeholder="e.g. 48th, 49th"
                      {...register("batch")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.batch && (
                      <p className="text-xs text-rose-400">{errors.batch.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span>Session</span>
                    </Label>
                    <Input
                      id="session"
                      placeholder="e.g. Autumn 2021"
                      {...register("session")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.session && (
                      <p className="text-xs text-rose-400">{errors.session.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentSemester" className="text-xs font-semibold text-zinc-300">
                      Current Semester
                    </Label>
                    <Input
                      id="currentSemester"
                      placeholder="e.g. 6th, 8th"
                      {...register("currentSemester")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.currentSemester && (
                      <p className="text-xs text-rose-400">{errors.currentSemester.message}</p>
                    )}
                  </div>
                </div>

                {/* 6. Email (Login Credential) & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Email (Used for Login)</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Password (Min 6 Characters)</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••••••"
                      {...register("password")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.password && (
                      <p className="text-xs text-rose-400">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                {/* 7. Phone & Blood Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Phone Number</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="e.g. +8801812345678"
                      {...register("phone")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-400">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-rose-400" />
                      <span>Blood Group</span>
                    </Label>
                    <select
                      id="bloodGroup"
                      {...register("bloodGroup")}
                      className="w-full h-9 rounded-md border border-white/10 bg-[#07130f] px-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">Select Blood Group (Optional)</option>
                      <option value="A_POSITIVE">A+ (A Positive)</option>
                      <option value="A_NEGATIVE">A- (A Negative)</option>
                      <option value="B_POSITIVE">B+ (B Positive)</option>
                      <option value="B_NEGATIVE">B- (B Negative)</option>
                      <option value="AB_POSITIVE">AB+ (AB Positive)</option>
                      <option value="AB_NEGATIVE">AB- (AB Negative)</option>
                      <option value="O_POSITIVE">O+ (O Positive)</option>
                      <option value="O_NEGATIVE">O- (O Negative)</option>
                    </select>
                    {errors.bloodGroup && (
                      <p className="text-xs text-rose-400">{errors.bloodGroup.message}</p>
                    )}
                  </div>
                </div>

                {/* 8. Address in Rangunia */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Permanent Address (Union / Village in Rangunia)</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g. Betagi, Rangunia, Chittagong"
                    {...register("address")}
                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                  />
                  {errors.address && (
                    <p className="text-xs text-rose-400">{errors.address.message}</p>
                  )}
                </div>

                {/* 9. Social Links (Facebook & LinkedIn) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Facebook Profile Link (Optional)</span>
                    </Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/username"
                      {...register("facebook")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>LinkedIn Profile Link (Optional)</span>
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      {...register("linkedin")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs"
                    />
                  </div>
                </div>

                {/* 10. Bio / About */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-xs font-semibold text-zinc-300">
                    Brief Bio / Forum Interests (Optional)
                  </Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    placeholder="Share a few words about yourself, your hobbies, academic goals, or volunteer aspirations in Rangunia..."
                    {...register("bio")}
                    className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs resize-none"
                  />
                  {errors.bio && (
                    <p className="text-xs text-rose-400">{errors.bio.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Registering Student Account...</span>
                      </span>
                    ) : (
                      <span>Complete Student Registration</span>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-zinc-400">
                Already registered with RSF?{" "}
                <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
                  Sign in to your Student Portal
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
