"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiX,
  FiCheckCircle,
  FiShield,
  FiSliders,
  FiImage,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const registerSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid work or production email address"),
    photoURL: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
    role: z.enum(["creator", "host"], { required_error: "Please select an account type" }),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to StudioSpace production policies" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterContent() {
  const router = useRouter();
  const { register: authRegister, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      role: "creator",
      password: "",
      confirmPassword: "",
      agreeTerms: true,
    },
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  // Live password validation indicators (Rule 4: min 6 chars, 1 uppercase, 1 lowercase)
  const passwordRules = useMemo(() => {
    return [
      {
        label: "At least 6 characters",
        valid: passwordValue.length >= 6,
      },
      {
        label: "One uppercase letter (A-Z)",
        valid: /[A-Z]/.test(passwordValue),
      },
      {
        label: "One lowercase letter (a-z)",
        valid: /[a-z]/.test(passwordValue),
      },
    ];
  }, [passwordValue]);

  const allRulesSatisfied = passwordRules.every((r) => r.valid);

  const onSubmit = async (data: RegisterFormData) => {
    if (!allRulesSatisfied) {
      toast.error("Password does not meet requirements", {
        description: "Please fulfill all 3 password criteria before continuing.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authRegister(data.name, data.email, data.password, data.photoURL || undefined);
      if (res.success) {
        toast.success("Account created successfully!", {
          description: `Welcome to StudioSpace, ${data.name}. Please sign in with your credentials.`,
        });
        router.push("/login");
      } else {
        toast.error("Registration failed", {
          description: res.error || "Please check your information and try again.",
        });
      }
    } catch {
      toast.error("An error occurred during account creation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle("/dashboard");
      }
    } catch (err: any) {
      toast.error("Google registration failed", {
        description: err.message || "Could not connect to Google",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* ─── LEFT: REGISTRATION FORM CARD ─── */}
          <div className="lg:col-span-6 bg-surface border border-border rounded-[28px] p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                JOIN THE PRODUCTION NETWORK
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Create your account
              </h1>
              <p className="text-sm text-muted mb-6 leading-relaxed">
                Connect directly with verified stage managers, soundstages, and daylight lofts.
              </p>

              {/* Social Login: Google Only */}
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-3 py-3 h-12 rounded-full mb-6 font-medium text-foreground bg-elevated hover:bg-surface border-border hover:border-border"
                onClick={handleGoogleRegister}
              >
                <FcGoogle className="w-5 h-5 shrink-0" />
                Sign up with Google
              </Button>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative px-3 bg-surface text-xs text-muted uppercase tracking-wider">
                  Or register with work email
                </div>
              </div>

              {/* Main Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Account Type Toggle */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-elevated border border-border">
                    <button
                      type="button"
                      onClick={() => setValue("role", "creator", { shouldValidate: true })}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                        watch("role") === "creator"
                          ? "bg-accent text-white shadow-md shadow-accent/20"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <FiSliders className="w-3.5 h-3.5" />
                      Creator / Crew
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("role", "host", { shouldValidate: true })}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                        watch("role") === "host"
                          ? "bg-accent text-white shadow-md shadow-accent/20"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <FiUser className="w-3.5 h-3.5" />
                      Studio Host
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Full Legal / Stage Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="e.g. Jordan Miller"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-danger mt-1.5">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Production Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="jordan@directorsguild.org"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-danger mt-1.5">{errors.email.message}</p>
                  )}
                </div>

                {/* Profile Photo URL (Optional) */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Profile Photo URL <span className="text-muted">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type="url"
                      {...register("photoURL")}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                  {errors.photoURL && (
                    <p className="text-xs text-danger mt-1.5">{errors.photoURL.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* LIVE PASSWORD REQUIREMENTS INDICATORS (Rule 4) */}
                  <div className="mt-3 p-3 rounded-xl bg-elevated/70 border border-border space-y-1.5">
                    <span className="text-[11px] font-semibold text-foreground/80 block mb-1">
                      Password Requirements:
                    </span>
                    {passwordRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            rule.valid
                              ? "bg-success/20 text-success"
                              : passwordValue.length > 0
                              ? "bg-danger/20 text-danger"
                              : "bg-surface text-muted"
                          }`}
                        >
                          {rule.valid ? (
                            <FiCheck className="w-2.5 h-2.5 stroke-[3]" />
                          ) : passwordValue.length > 0 ? (
                            <FiX className="w-2.5 h-2.5 stroke-[3]" />
                          ) : (
                            <span className="w-1 h-1 rounded-full bg-muted" />
                          )}
                        </span>
                        <span
                          className={`transition-colors ${
                            rule.valid
                              ? "text-success font-medium"
                              : passwordValue.length > 0
                              ? "text-danger"
                              : "text-muted"
                          }`}
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {errors.password && !allRulesSatisfied && (
                    <p className="text-xs text-danger mt-1.5">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Repeat your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-danger mt-1.5">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Terms agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("agreeTerms")}
                      className="w-4 h-4 mt-0.5 rounded border-border text-accent focus:ring-accent bg-elevated"
                    />
                    <span className="text-xs text-muted leading-relaxed">
                      I agree to StudioSpace production guidelines, escrow terms, and certified venue rules.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-xs text-danger mt-1.5">{errors.agreeTerms.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center mt-3"
                  disabled={isSubmitting || !allRulesSatisfied}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting Up Production Workspace...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Complete Registration
                      <FiArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted">
              Already have a StudioSpace account?{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* ─── RIGHT: VISUAL SHOWCASE CARD ─── */}
          <div className="lg:col-span-6 relative rounded-[28px] overflow-hidden bg-surface border border-border p-8 sm:p-12 flex flex-col justify-between hidden lg:flex">
            <Image
              src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80"
              alt="Film soundstage lighting"
              fill
              className="object-cover opacity-25 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-surface/80 to-transparent pointer-events-none" />

            {/* Top badges */}
            <div className="relative z-10 flex items-center justify-between">
              <Badge variant="accent" className="text-xs">
                Creator &amp; Host Collective
              </Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-elevated/90 backdrop-blur-sm border border-white/10 text-xs text-foreground font-medium">
                <FiCheckCircle className="w-3.5 h-3.5 text-success" />
                Over 12,000 Verified Shoots
              </div>
            </div>

            {/* Middle Feature Highlights */}
            <div className="relative z-10 my-auto py-10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground leading-tight">
                Everything you need to produce, crew, and stage world-class projects.
              </h3>

              <div className="space-y-4">
                {[
                  {
                    title: "Automated Certificate of Insurance",
                    desc: "Instant COI verification and \$2M liability coverage issued on booking lock.",
                  },
                  {
                    title: "Escrow-Protected Security Deposits",
                    desc: "Funds held neutrally until 24 hours after wrapped shoot time.",
                  },
                  {
                    title: "Union-Grade Equipment Catalogs",
                    desc: "Pre-book grip packages, 3-phase camlock power, and NC-25 soundstage sound isolations.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-elevated/80 border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-accent/15 text-accent flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                      <p className="text-[11px] text-muted leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Guarantee */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <FiShield className="w-4 h-4 text-accent" />
                Zero cancellation fees on 48h holds
              </span>
              <span className="text-foreground/80 font-medium">24/7 Crew Support</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}

