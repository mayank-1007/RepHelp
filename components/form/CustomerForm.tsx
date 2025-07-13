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
import { useState } from "react";
import { useRouter } from "next/navigation"; // Updated import for Next.js App Router
import { createUser, sendOtp, verifyOtp } from "@/lib/actions/customer.actions";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [isTestUserOpen, setIsTestUserOpen] = useState(false);

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
                    <span className="text-gray-800 select-all bg-gray-50 px-2 py-1 rounded ">Test User</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="text-gray-800 select-all bg-gray-50 px-2 py-1 rounded text-xs">test@test.com</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-gray-600">Phone:</span>
                    <span className="text-gray-800 select-all bg-gray-50 px-2 py-1 rounded text-xs">+918888888888</span>
                  </div>
                </div>
                
                {/* Helper Text */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Click anywhere outside to close</p>
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

      <Dialog open={otpSent} onOpenChange={setOtpSent}>
  <DialogTrigger asChild>
    <Button variant="ghost" className="hidden">
      Open
    </Button>
  </DialogTrigger>
  <DialogContent className="bg-green-600"> {/* Add your background color class here */}
    <DialogTitle>Enter OTP</DialogTitle>
    <DialogDescription>
      Please enter the OTP sent to your phone.
    </DialogDescription>
    <Input
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="Enter OTP"
      className="mb-4"
    />
    <DialogFooter>
      <Button onClick={handleOtpSubmit}>Verify OTP</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </Form>
  );
}
