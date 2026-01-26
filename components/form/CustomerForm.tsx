// pages/CustomerForm.tsx

"use client"; // Mark this file as a Client Component

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
// import { UserFormValidation } from "@/lib/validation";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js App Router
import { createUser, sendOtp, verifyOtp } from "@/lib/actions/customer.actions";
import { TEST_CREDENTIALS } from "@/constants";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import test from "node:test";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

// Define the validation schema
const UserFormValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
});

export default function CustomerForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [testHover, setTestHover] = useState(false);

  const form = useForm({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  function isTestCredentials(data: any) {
    return (
      data?.email?.toLowerCase() === TEST_CREDENTIALS.email.toLowerCase() &&
      data?.phone?.replace(/\s+/g, "") === TEST_CREDENTIALS.phone &&
      data?.name?.trim().toLowerCase() === TEST_CREDENTIALS.name.toLowerCase()
    );
  }

  async function onSubmit(data: any) {
    setIsLoading(true);
    try {
      const user = await createUser(data);

      if (user) {
        setUserId(user.id);
        toast.info("Sending verification code...");

        const otpResponse = await sendOtp(data.phone, user.id, data.email, data.name);

        if (otpResponse.success) {
          setOtpSent(true);
          toast.success("Verification code sent to your phone!");
        } else {
          toast.error("Failed to send verification code. Please try again.");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  }

  async function handleOtpSubmit() {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const verifyResponse = await verifyOtp(userId, otp);
      if (verifyResponse.success) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);

        // Wait 1 second before redirecting so user sees success message
        setTimeout(() => {
          router.push(`/customer/${userId}/register`);
        }, 1000);
      } else {
        toast.error("Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify OTP");
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Let&apos;s Book Your Room</p>
          <div onMouseEnter={() => setTestHover(true)} onMouseLeave={() => setTestHover(false)} className="mt-4 rounded-md border border-dark-500 bg-dark-400 p-4 text-sm">
            <p className="mb-2 font-medium">Quick demo login (no OTP):</p>
            <ul className="list-disc pl-5">
              <li>Name: <span className="font-mono">{TEST_CREDENTIALS.name}</span></li>
              <li>Email: <span className="font-mono">{TEST_CREDENTIALS.email}</span></li>
              <li>Phone: <span className="font-mono">{TEST_CREDENTIALS.phone}</span></li>
            </ul>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  form.setValue("name", TEST_CREDENTIALS.name);
                  form.setValue("email", TEST_CREDENTIALS.email);
                  form.setValue("phone", TEST_CREDENTIALS.phone);
                }}
              >
                Autofill demo details
              </Button>
            </div>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Krishna"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="krishna2005@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone No."
          placeholder="(+91) 8595673410"
          iconSrc="/assets/icons/phoneInput.svg"
          iconAlt="phoneInput"
        />
        <SubmitButton isLoading={isLoading}>Welcome</SubmitButton>
      </form>

      <Dialog open={otpSent} onOpenChange={setOtpSent}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hidden">
            Open
          </Button>
        </DialogTrigger>
        <DialogContent
          className="shad-dialog sm:max-w-md"
          onEscapeKeyDown={(e: any) => e.preventDefault()}
          onPointerDownOutside={(e: any) => e.preventDefault()}
        >
          <DialogHeader className="mb-4 space-y-3">
            <DialogTitle className="text-center text-2xl font-bold">Verify Your Identity</DialogTitle>
            <DialogDescription className="text-center">
              We&apos;ve sent a 6-digit verification code to your phone.
            </DialogDescription>
          </DialogHeader>

          {otpVerified ? (
            <div className="flex flex-col items-center space-y-4 py-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-green-200">Verified Successfully!</p>
              <p className="text-sm text-gray-500">Redirecting you to registration...</p>
            </div>
          ) : (
            <>
              <div className="">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup className="shad-otp">
                    <InputOTPSlot className="shad-otp-slot" index={0} />
                    <InputOTPSlot className="shad-otp-slot" index={1} />
                    <InputOTPSlot className="shad-otp-slot" index={2} />
                    <InputOTPSlot className="shad-otp-slot" index={3} />
                    <InputOTPSlot className="shad-otp-slot" index={4} />
                    <InputOTPSlot className="shad-otp-slot" index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <DialogFooter className="flex flex-col gap-3">
                <Button
                  onClick={handleOtpSubmit}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full shad-primary-btn"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </Form>
  );
}
