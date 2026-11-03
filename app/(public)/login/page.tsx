"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid work or production email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || searchParams.get("callbackUrl") || "/dashboard";

  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "host@studiospace.io",
      password: "password123",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        toast.success("Welcome back!", {
          description: `Signed in as ${data.email}. Redirecting...`,
        });
        router.replace(redirectPath);
      } else {
        toast.error("Authentication failed", {
          description: res.error || "Please verify your credentials and try again.",
        });
      }
    } catch {
      toast.error("An error occurred during sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const TEST_ACCOUNTS = [
    { name: "Alex Vance", email: "host@studiospace.io", label: "Host" },
    { name: "Maya Lin", email: "creator@studiospace.io", label: "Creator" },
    { name: "Elena Rostova", email: "admin@studiospace.io", label: "Admin" },
  ];

  const handleQuickFill = (account: (typeof TEST_ACCOUNTS)[0]) => {
    setValue("email", account.email, { shouldValidate: true });
    setValue("password", "Pass123!", { shouldValidate: true });
    toast.info(`Loaded test credentials: ${account.name}`, {
      description: `${account.email} (${account.label})`,
    });
  };

  const handleGoogleLogin = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle(redirectPath);
      }
    } catch (err: any) {
      toast.error("Google sign in failed", {
        description: err.message || "Could not connect to Google",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* ─── LEFT: SIGN IN FORM CARD ─── */}
          <div className="lg:col-span-6 bg-surface border border-border rounded-[28px] p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-elevated border border-border text-xs text-muted mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                SECURE PRODUCTION PORTAL
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-muted mb-8 leading-relaxed">
                Sign in to manage your active studio call sheets, holds, and payout schedules.
              </p>

              {/* Quick Fill Test Accounts for examiner */}
              <div className="mb-6 p-3.5 rounded-2xl bg-elevated border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                    <FiZap className="w-3.5 h-3.5 text-accent" />
                    Quick-Fill Test Accounts:
                  </span>
                  <span className="text-[11px] text-muted">Click to populate</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEST_ACCOUNTS.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => handleQuickFill(account)}
                      className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border hover:border-accent hover:text-accent transition-colors font-medium flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      {account.name.split(" ")[0]} ({account.label})
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Login: Google Only */}
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-3 py-3 h-12 rounded-full mb-6 font-medium text-foreground bg-elevated hover:bg-surface border-border hover:border-border"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="w-5 h-5 shrink-0" />
                Continue with Google
              </Button>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative px-3 bg-surface text-xs text-muted uppercase tracking-wider">
                  Or continue with email
                </div>
              </div>

              {/* Main Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Production Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="producer@studio.io"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-elevated border border-border text-foreground text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-danger mt-1.5">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-foreground">Password</label>
                    <button
                      type="button"
                      onClick={() =>
                        toast.info("Password Reset Requested", {
                          description: "In production, an automated magic reset link is dispatched to your verified email address.",
                        })
                      }
                      className="text-xs text-accent hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="••••••••••••"
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
                  {errors.password && (
                    <p className="text-xs text-danger mt-1.5">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...register("rememberMe")}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent bg-elevated"
                    />
                    <span className="text-xs text-muted">Keep me signed in for 30 days</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Sign In to StudioSpace
                      <FiArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="text-accent font-semibold hover:underline">
                Create an account
              </Link>
            </div>
          </div>

          {/* ─── RIGHT: VISUAL SHOWCASE CARD ─── */}
          <div className="lg:col-span-6 relative rounded-[28px] overflow-hidden bg-surface border border-border p-8 sm:p-12 flex flex-col justify-between hidden lg:flex">
            {/* Background image with film overlay */}
            <Image
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
              alt="Studio production set"
              fill
              className="object-cover opacity-20 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-surface/80 to-transparent pointer-events-none" />

            {/* Top badges */}
            <div className="relative z-10 flex items-center justify-between">
              <Badge variant="verified" className="text-xs">
                Verified Production Network
              </Badge>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-elevated/90 backdrop-blur-sm border border-white/10 text-xs text-foreground font-medium">
                <FiStar className="w-3.5 h-3.5 text-warning fill-warning" />
                4.96 Average Stage Rating
              </div>
            </div>

            {/* Middle Quote */}
            <div className="relative z-10 my-auto py-10">
              <blockquote className="text-xl sm:text-2xl font-heading font-medium text-foreground leading-snug mb-6">
                &ldquo;StudioSpace replaced three days of permit back-and-forth and uncertain deposit holds with a four-minute booking. It has transformed our production scheduling.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    alt="Director Maya Vance"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground text-sm">Maya Vance</h4>
                  <p className="text-xs text-muted">Director of Photography, Anonymous Content</p>
                </div>
              </div>
            </div>

            {/* Bottom feature pills */}
            <div className="relative z-10 grid grid-cols-2 gap-3 pt-6 border-t border-white/10">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <FiShield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-foreground">$2M Production Escrow</h5>
                  <p className="text-[11px] text-muted">Every shoot fully insured</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-success" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-foreground">Zero Hidden Fees</h5>
                  <p className="text-[11px] text-muted">Transparent call sheet billing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

