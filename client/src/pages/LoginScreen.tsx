import { useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const LoginScreen = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<
        "login" | "forgot" | "verify" | "success" | "reset"
    >("login");

    const OTP_LENGTH = 5;
    const [otp, setOtp] = useState(
        Array.from({ length: OTP_LENGTH }, () => ""),
    );
    const otpValue = useMemo(() => otp.join(""), [otp]);
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    const setOtpDigit = (index: number, next: string) => {
        setOtp((prev) => {
            const copy = [...prev];
            copy[index] = next;
            return copy;
        });
    };

    const fillOtp = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
        if (!digits.length) return;

        setOtp((prev) => {
            const copy = [...prev];
            for (let i = 0; i < OTP_LENGTH; i++) {
                copy[i] = digits[i] ?? "";
            }
            return copy;
        });

        const nextIndex = Math.min(digits.length, OTP_LENGTH - 1);
        otpRefs.current[nextIndex]?.focus();
    };

    const stepContent = () => {
        if (step === "login") {
            return (
                <>
                    <h1 className="text-center text-[1.3rem] font-semibold text-[#222f36]">
                        Login Administration
                    </h1>

                    <div className="mt-8 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-medium text-[#222f36]">
                                Email
                            </Label>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="h-11 rounded-[10px] border-0 bg-[#f5f5f5] text-[#222f36] placeholder:text-[#8c8c8c] focus-visible:ring-2 focus-visible:ring-[#62a230]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-medium text-[#222f36]">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    className="h-11 rounded-[10px] border-0 bg-[#f5f5f5] pr-12 text-[#222f36] placeholder:text-[#8c8c8c] focus-visible:ring-2 focus-visible:ring-[#62a230]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#222f36]"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-2">
                                <Checkbox id="remember" />
                                <Label
                                    htmlFor="remember"
                                    className="text-[11px] font-normal text-[#8c8c8c]"
                                >
                                    Remember Me
                                </Label>
                            </div>
                            <button
                                type="button"
                                className="text-[11px] font-medium text-[#62a230] hover:underline"
                                onClick={() => setStep("forgot")}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            className="h-11 w-full rounded-[10px] bg-[#62a230] font-semibold text-white hover:bg-[#559026]"
                            onClick={() => {
                                localStorage.setItem("auth", "true");
                                setLocation("/");
                            }}
                        >
                            Sign In
                        </Button>
                    </div>
                </>
            );
        }

        if (step === "forgot") {
            return (
                <>
                    <h1 className="text-left text-[28px] leading-[34px] font-semibold text-[#222f36]">
                        Forget Password
                    </h1>
                    <p className="mt-2 text-[12px] leading-4 text-[#8c8c8c]">
                        Please enter your registered mobile number or email id
                        to reset your password
                    </p>

                    <div className="mt-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-medium text-[#222f36]">
                                Email / Phone Number
                            </Label>
                            <Input
                                placeholder="Enter your email / Mobile Number"
                                className="h-11 rounded-[10px] border-0 bg-[#f5f5f5] text-[#222f36] placeholder:text-[#8c8c8c] focus-visible:ring-2 focus-visible:ring-[#62a230]"
                            />
                        </div>

                        <Button
                            className="h-11 w-full rounded-[10px] bg-[#62a230] font-semibold text-white hover:bg-[#559026]"
                            onClick={() => setStep("verify")}
                        >
                            Submit
                        </Button>

                        <button
                            type="button"
                            className="w-full text-center text-[11px] text-[#8c8c8c] hover:underline"
                            onClick={() => setStep("login")}
                        >
                            Back To Sign In
                        </button>
                    </div>
                </>
            );
        }

        if (step === "verify") {
            return (
                <>
                    <h1 className="text-left text-[28px] leading-[34px] font-semibold text-[#222f36]">
                        Verification
                    </h1>
                    <p className="mt-3 text-[12px] leading-[18px] text-[#8c8c8c]">
                        Please enter the OTP sent to you registered mobile
                        number or email id as John*****@gmail.com or +91
                        09****654
                    </p>

                    <div className="mt-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-medium text-[#222f36]">
                                OTP
                            </Label>
                            <div
                                className="flex items-center gap-3"
                                onPaste={(e) => {
                                    const text =
                                        e.clipboardData.getData("text");
                                    if (text) {
                                        e.preventDefault();
                                        fillOtp(text);
                                    }
                                }}
                            >
                                {otp.map((v, idx) => {
                                    const isActive = v.length > 0;
                                    return (
                                        <input
                                            key={idx}
                                            ref={(el) => {
                                                otpRefs.current[idx] = el;
                                            }}
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            pattern="[0-9]*"
                                            maxLength={1}
                                            value={v}
                                            onChange={(e) => {
                                                const raw = e.target.value;
                                                if (raw.length > 1) {
                                                    fillOtp(raw);
                                                    return;
                                                }

                                                const next = raw
                                                    .replace(/\D/g, "")
                                                    .slice(0, 1);
                                                setOtpDigit(idx, next);
                                                if (
                                                    next &&
                                                    idx < OTP_LENGTH - 1
                                                ) {
                                                    otpRefs.current[
                                                        idx + 1
                                                    ]?.focus();
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace") {
                                                    if (otp[idx]) {
                                                        setOtpDigit(idx, "");
                                                        return;
                                                    }

                                                    if (idx > 0) {
                                                        otpRefs.current[
                                                            idx - 1
                                                        ]?.focus();
                                                    }
                                                }
                                            }}
                                            className={
                                                "h-[64px] w-[64px] rounded-[12px] text-center text-[16px] font-medium outline-none transition-colors " +
                                                (isActive
                                                    ? "bg-[#f0f5ec] ring-1 ring-[#62a230]"
                                                    : "bg-[#e9e9e9]") +
                                                " focus:ring-2 focus:ring-[#62a230]"
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <Button
                            className="h-11 w-full rounded-[10px] bg-[#62a230] font-semibold text-white hover:bg-[#559026]"
                            disabled={
                                otpValue.replace(/\D/g, "").length !==
                                OTP_LENGTH
                            }
                            onClick={() => setStep("success")}
                        >
                            Submit
                        </Button>

                        <button
                            type="button"
                            className="w-full text-center text-[11px] text-[#8c8c8c] hover:underline"
                            onClick={() => setStep("forgot")}
                        >
                            Back
                        </button>
                    </div>
                </>
            );
        }

        if (step === "success") {
            return (
                <>
                    <div className="mt-2 flex flex-col items-center justify-center">
                        <img
                            src="/figmaAssets/successimg.png"
                            alt="IJustPaid"
                            className="max-h-[168px] w-full object-contain"
                        />
                        <div className="mt-6 text-center">
                            <div className="text-center text-[28px] leading-[34px] font-semibold text-[#222f36]">
                                Successful
                            </div>
                            <div className="mt-2 text-[12px] text-[#8c8c8c]">
                                You have successfully verified
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button
                            className="h-11 w-full rounded-[10px] bg-[#62a230] font-semibold text-white hover:bg-[#559026]"
                            onClick={() => setStep("reset")}
                        >
                            Continue
                        </Button>
                    </div>
                </>
            );
        }

        return (
            <>
                <h1 className="text-left text-[28px] leading-[34px] font-semibold text-[#222f36]">
                    Reset Password
                </h1>
                <p className="mt-2 text-[12px] leading-4 text-[#8c8c8c]">
                    Create a new password with at least 8 characters to secure
                    your account
                </p>

                <div className="mt-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-medium text-[#222f36]">
                            New Password
                        </Label>
                        <Input
                            type="password"
                            placeholder="New Password"
                            className="h-11 rounded-[10px] border-0 bg-[#f5f5f5] text-[#222f36] placeholder:text-[#8c8c8c] focus-visible:ring-2 focus-visible:ring-[#62a230]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-medium text-[#222f36]">
                            Confirm Password
                        </Label>
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            className="h-11 rounded-[10px] border-0 bg-[#f5f5f5] text-[#222f36] placeholder:text-[#8c8c8c] focus-visible:ring-2 focus-visible:ring-[#62a230]"
                        />
                    </div>

                    <Button
                        className="h-11 w-full rounded-[10px] bg-[#62a230] font-semibold text-white hover:bg-[#559026]"
                        onClick={() => {
                            setStep("login");
                            setOtp(
                                Array.from({ length: OTP_LENGTH }, () => ""),
                            );
                            setLocation("/login");
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </>
        );
    };

    return (
        <div
            className="min-h-screen w-full bg-[#0f2a20] bg-cover bg-center flex items-center justify-center px-4"
            style={{
                backgroundImage: "url('/figmaAssets/Signupbg.png')",
            }}
        >
            <div className="w-full max-w-[440px]">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                >
                    <Card className="relative rounded-[26px] border-0 bg-white px-8 pb-8 pt-16 shadow-[0px_24px_60px_rgba(0,0,0,0.35)]">
                        <div className="absolute -top-[78px] left-1/2 h-[128px] w-[330px] -translate-x-1/2 flex items-center justify-center">
                            <img
                                src="/figmaAssets/signuplogo.png"
                                alt="IJustPaid"
                                className="max-h-[198px] w-full object-cover"
                            />
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                            >
                                {stepContent()}
                            </motion.div>
                        </AnimatePresence>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};
