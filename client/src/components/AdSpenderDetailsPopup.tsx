import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export type AdSpenderRow = {
    vendor: string;
    spend: number;
    impressions: string;
    ctr: number;
    performance: string;
    performancePct: number;
};

type AdSpenderDetailsPopupProps = {
    open: boolean;
    vendor: AdSpenderRow | null;
    onClose: () => void;
    onSubmit: (payload: {
        vendor: string;
        reason: string;
        content: string;
        adCategory: string;
        audience: string;
        notes: string;
    }) => void;
};

export function AdSpenderDetailsPopup({
    open,
    vendor,
    onClose,
    onSubmit,
}: AdSpenderDetailsPopupProps) {
    const [reason, setReason] = useState("Inappropriate Content");
    const [content, setContent] = useState("Inappropriate Content");
    const [adCategory, setAdCategory] = useState("Inappropriate Content");
    const [audience, setAudience] = useState("Custom Reasons");
    const [notes, setNotes] = useState("");

    const title = useMemo(() => {
        if (!vendor) return "Why Are You Closing This ad ?";
        return "Why Are You Closing This ad ?";
    }, [vendor]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        setNotes("");
        setReason("Inappropriate Content");
        setContent("Inappropriate Content");
        setAdCategory("Inappropriate Content");
        setAudience("Custom Reasons");
    }, [open]);

    return (
        <AnimatePresence>
            {open && vendor ? (
                <motion.div
                    className="fixed inset-0 z-[140]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed inset-0 flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.98, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 8 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 24,
                        }}
                        onClick={onClose}
                    >
                        <div
                            className="relative w-[520px] max-w-[calc(100vw-32px)] rounded-[16px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                aria-label="Close"
                                className="absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-[#f6f8fa] flex items-center justify-center"
                                onClick={onClose}
                            >
                                <X className="h-4 w-4 text-[#7b848f]" />
                            </button>

                            <div className="px-8 pt-7 pb-2">
                                <div className="text-[18px] font-semibold text-[#222f36] [font-family:'Poppins',Helvetica]">
                                    {title}
                                </div>
                            </div>

                            <div className="px-8 pb-7">
                                <div className="space-y-4 mt-5">
                                    <div>
                                        <div className="text-[11px] font-medium text-[#7b848f] mb-2 [font-family:'Poppins',Helvetica]">
                                            Inappropriate Content
                                        </div>
                                        <Select
                                            value={reason}
                                            onValueChange={setReason}
                                        >
                                            <SelectTrigger className="h-[44px] rounded-[10px] bg-white border border-[#edf1f3] text-[13px] shadow-[0px_1px_2px_#00000008] [font-family:'Poppins',Helvetica]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Inappropriate Content">
                                                    Inappropriate Content
                                                </SelectItem>
                                                <SelectItem value="Spam Content">
                                                    Spam Content
                                                </SelectItem>
                                                <SelectItem value="Misleading Ad">
                                                    Misleading Ad
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <div className="text-[11px] font-medium text-[#7b848f] mb-2 [font-family:'Poppins',Helvetica]">
                                            Spam Content
                                        </div>
                                        <Select
                                            value={content}
                                            onValueChange={setContent}
                                        >
                                            <SelectTrigger className="h-[44px] rounded-[10px] bg-white border border-[#edf1f3] text-[13px] shadow-[0px_1px_2px_#00000008] [font-family:'Poppins',Helvetica]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Inappropriate Content">
                                                    Inappropriate Content
                                                </SelectItem>
                                                <SelectItem value="Policy Violation">
                                                    Policy Violation
                                                </SelectItem>
                                                <SelectItem value="Low Quality">
                                                    Low Quality
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <div className="text-[11px] font-medium text-[#7b848f] mb-2 [font-family:'Poppins',Helvetica]">
                                            Inappropriate Content
                                        </div>
                                        <Select
                                            value={adCategory}
                                            onValueChange={setAdCategory}
                                        >
                                            <SelectTrigger className="h-[44px] rounded-[10px] bg-white border border-[#edf1f3] text-[13px] shadow-[0px_1px_2px_#00000008] [font-family:'Poppins',Helvetica]">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Inappropriate Content">
                                                    Inappropriate Content
                                                </SelectItem>
                                                <SelectItem value="Restricted Category">
                                                    Restricted Category
                                                </SelectItem>
                                                <SelectItem value="Adult Content">
                                                    Adult Content
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <div className="text-[11px] font-medium text-[#7b848f] mb-2 [font-family:'Poppins',Helvetica]">
                                            Custom Reasons
                                        </div>
                                        <Input
                                            value={audience}
                                            onChange={(e) =>
                                                setAudience(e.target.value)
                                            }
                                            placeholder="Custom Reasons"
                                            className="h-[44px] rounded-[10px] bg-white border border-[#edf1f3] text-[13px] shadow-[0px_1px_2px_#00000008] [font-family:'Poppins',Helvetica]"
                                        />
                                    </div>

                                    <div>
                                        <div className="text-[11px] font-medium text-[#7b848f] mb-2 [font-family:'Poppins',Helvetica]">
                                            Reasoning
                                        </div>
                                        <Input
                                            value={notes}
                                            onChange={(e) =>
                                                setNotes(e.target.value)
                                            }
                                            placeholder="Reasoning"
                                            className="h-[44px] rounded-[10px] bg-white border border-[#edf1f3] text-[13px] shadow-[0px_1px_2px_#00000008] [font-family:'Poppins',Helvetica]"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    className="mt-6 h-[44px] w-full rounded-[10px] bg-[#62a230] text-white hover:bg-[#4e8b22] [font-family:'Poppins',Helvetica]"
                                    onClick={() => {
                                        onSubmit({
                                            vendor: vendor.vendor,
                                            reason,
                                            content,
                                            adCategory,
                                            audience,
                                            notes,
                                        });
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
