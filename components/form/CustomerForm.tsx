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
// import { UserFormValidation } from "@/lib/validation";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // Updated import for Next.js App Router
import { createUser, sendOtp, verifyOtp } from "@/lib/actions/customer.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { decryptKey, encryptKey } from "@/lib/utils";
import Image from "next/image";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  DROPDOWN = "dropdown",
  SELECT = "select",
  SKELETON = "skeleton",
}

const UserFormValidation = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
});

export default function CustomerForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();
  const [otpSent, setOtpSent] = useState(false);
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [isTestUserOpen, setIsTestUserOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Copy to clipboard function with toast
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(`${label} copied!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000); // Hide toast after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Auto-hide toast effect
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  
  
    const closeModal = () => {
      setOpen(false);
      router.push("/");
    };
  

  const form = useForm({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(data: any) {
    setIsLoading(true);
    try {
      console.log("Form Data:", data);
      if(data.phone == "+918888888888" && data.email == "test@test.com" && data.name === "Test User") {
        console.log("Test user detected, redirecting to registration page");
        router.push(`/customer/${data.phone+"testuser"}/register`);
        return;
      }
      const user = await createUser(data);

      if (user) {
        setUserId(user.$id);

        const otpResponse = await sendOtp(data.phone, user.$id, data.email,data.name);

        if (otpResponse.success) {
          setOtpSent(true);
        } else {
          console.error("Failed to send OTP");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  async function handleOtpSubmit() {
    setIsLoading(true);
    try {
      const verifyResponse = await verifyOtp(userId, otp);
      if (verifyResponse.success) {
        router.push(`/customer/${userId}/register`);
      } else {
        console.error("Failed to verify OTP", verifyResponse.error);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {toastMessage}
          </div>
        </div>
      )}

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {/* Test User Button and Details Section */}
        <div className="absolute top-4 left-4 z-50">
          {/* Test User Button */}
          <button
            type="button"
            onClick={() => setIsTestUserOpen(!isTestUserOpen)}
            className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:bg-white/90 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Test User</span>
          </button>

          {/* Test User Details Popup */}
          {isTestUserOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/10 backdrop-blur-sm"
                onClick={() => setIsTestUserOpen(false)}
              ></div>
              
              {/* Details Card */}
              <div className="absolute top-12 left-0 bg-white/95 backdrop-blur-md border border-blue-200 rounded-xl p-4 shadow-xl min-w-[280px] animate-in slide-in-from-top-2 duration-200">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsTestUserOpen(false)}
                  className="absolute top-2 right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-gray-500 text-sm">×</span>
                </button>
                
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-700">Test User Credentials</span>
                </div>
                
                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-gray-600">Name:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("Test User", "Credential")}
                      className="text-gray-800 select-all bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200"
                      title="Click to copy"
                    >
                      Test User
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-gray-600">Email:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("test@test.com", "Credential")}
                      className="text-gray-800 select-all bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded text-xs cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200"
                      title="Click to copy"
                    >
                      test@test.com
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-gray-600">Phone:</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("8888888888", "Credential")}
                      className="text-gray-800 select-all bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded text-xs cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-200"
                      title="Click to copy"
                    >
                      +918888888888
                    </button>
                  </div>
                </div>
                
                {/* Helper Text */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Click credentials to copy • Click outside to close</p>
                </div>
              </div>
            </>
          )}
        </div>

        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Let&apos;s Book Your Room</p>
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

      


<AlertDialog open={otpSent}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Customer Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the registration page, please enter the otp recieved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(value: any) => setOtp(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleOtpSubmit}
            disabled={isLoading}
            className="shad-primary-btn w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              "Enter OTP"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    </Form>
    </>
  );
}
