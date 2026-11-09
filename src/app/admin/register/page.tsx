"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Image as ImageIcon,
  ArrowRight,
  Info,
  Upload,
  X,
} from "lucide-react";
import {
  adminRegisterSchema,
  type AdminRegisterInput,
} from "@/features/admin/schemas/admin-register.schema";
import { registerAdminAction } from "@/features/admin/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AdminRegisterPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [femalePrivacyNotice, setFemalePrivacyNotice] = React.useState(false);
  const [selectedGender, setSelectedGender] = React.useState<"Male" | "Female">("Male");
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminRegisterInput>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      gender: "Male",
      department: "CSE",
      enrollment: "Spring 24",
      position: "General Executive",
    },
  });

  const onSubmit = async (data: AdminRegisterInput) => {
    setServerError(null);
    setSuccessMessage(null);

    const res = await registerAdminAction(data);

    if (!res.success) {
      setServerError(res.error || "Failed to submit registration");
    } else {
      setSuccessMessage(res.message || "Registration submitted successfully!");
    }
  };

  const handleGenderFemaleClick = () => {
    // 1. Immediately trigger the privacy notification
    setFemalePrivacyNotice(true);
    // 2. Female must NOT be selectable: enforce "Male" remains selected
    setSelectedGender("Male");
    setValue("gender", "Male");
  };

  return (
    <div className="min-h-screen bg-[#040907] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-2xl mx-auto">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-6 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Lock className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-sans font-extrabold tracking-tight text-white sm:text-4xl">
            Executive Admin Registration
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-lg">
            Apply for forum executive administration access. All registrations are subject to strict Super Admin verification.
          </p>
        </div>

        {/* Success Banner */}
        {successMessage ? (
          <Card className="border-emerald-500/40 bg-emerald-950/20 backdrop-blur-xl text-white">
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Application Submitted!
              </h2>
              <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 text-xs text-zinc-400 max-w-md mx-auto text-left space-y-1.5">
                <p className="font-semibold text-emerald-300">What happens next?</p>
                <p>1. The Super Admin reviews your IIUC student credentials and executive role.</p>
                <p>2. Once verified, your status transitions to <span className="text-emerald-400 font-mono">APPROVED</span>.</p>
                <p>3. You can then sign in directly to the Administration Console.</p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/login">
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                    <span>Go to Admin Login</span>
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
                Executive Profile Details
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Fill in your accurate academic and forum credentials.
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
                      &quot;We care about your privacy, please contact with female executives.&quot;
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Female executive appointments and registrations are coordinated via our secure offline channel to safeguard member privacy.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name & Student ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Full Name</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Mohammad Abdullah"
                      {...register("name")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-400">{errors.name.message}</p>
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

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Official Email Address</span>
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
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Password (Min 8 Characters)</span>
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

                {/* Department, Section, Enrollment */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs font-semibold text-zinc-300">
                      Department
                    </Label>
                    <Input
                      id="department"
                      placeholder="e.g. CSE, EEE, BBA"
                      {...register("department")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.department && (
                      <p className="text-xs text-rose-400">{errors.department.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="section" className="text-xs font-semibold text-zinc-300">
                      Section / Semester
                    </Label>
                    <Input
                      id="section"
                      placeholder="e.g. 5A or 6th"
                      {...register("section")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.section && (
                      <p className="text-xs text-rose-400">{errors.section.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enrollment" className="text-xs font-semibold text-zinc-300">
                      Enrollment Session
                    </Label>
                    <Input
                      id="enrollment"
                      placeholder="e.g. Spring 24"
                      {...register("enrollment")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.enrollment && (
                      <p className="text-xs text-rose-400">{errors.enrollment.message}</p>
                    )}
                  </div>
                </div>

                {/* Position in Forum & Photo URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-xs font-semibold text-zinc-300">
                      Position in Forum
                    </Label>
                    <Input
                      id="position"
                      placeholder="e.g. General Executive, Treasurer"
                      {...register("position")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.position && (
                      <p className="text-xs text-rose-400">{errors.position.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="photo-file" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Executive Profile Photo</span>
                      </Label>
                      <span className="text-[10px] text-zinc-400 font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      id="photo-file"
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
                </div>

                {/* Current & Permanent Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAddress" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Current Address (Campus/Chittagong)</span>
                    </Label>
                    <Input
                      id="currentAddress"
                      placeholder="e.g. Kumira, Sitakunda / Halishahar"
                      {...register("currentAddress")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.currentAddress && (
                      <p className="text-xs text-rose-400">{errors.currentAddress.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permanentAddress" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Permanent Address (Rangunia)</span>
                    </Label>
                    <Input
                      id="permanentAddress"
                      placeholder="e.g. Betagi, Rangunia, Chittagong"
                      {...register("permanentAddress")}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
                    />
                    {errors.permanentAddress && (
                      <p className="text-xs text-rose-400">{errors.permanentAddress.message}</p>
                    )}
                  </div>
                </div>

                {/* SPECIAL GENDER FEATURE */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-zinc-300">
                      Gender Verification
                    </Label>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Info className="w-3 h-3 text-emerald-400" />
                      Privacy Shield Protected
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
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedGender === "Male" ? "border-emerald-400 bg-emerald-400" : "border-zinc-500"
                      }`}>
                        {selectedGender === "Male" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-black" />
                        )}
                      </span>
                      <span>Male</span>
                    </button>

                    {/* Option: Female (Triggers Toast / Non-selectable) */}
                    <button
                      type="button"
                      onClick={handleGenderFemaleClick}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:border-rose-500/40 hover:bg-rose-950/20 hover:text-rose-300 transition-all cursor-pointer"
                      title="Click for privacy protocol"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-zinc-500" />
                      <span>Female</span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">
                        Protected
                      </span>
                    </button>
                  </div>

                  {errors.gender && (
                    <p className="text-xs text-rose-400">{errors.gender.message}</p>
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
                        <span>Submitting Application...</span>
                      </span>
                    ) : (
                      <span>Submit Admin Application</span>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-zinc-400">
                Already approved as an Admin?{" "}
                <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
