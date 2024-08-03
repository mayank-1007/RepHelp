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
      const user = await createUser(data);
      if (user) {
        setUserId(user.$id);
        console.log(data.phone);
        const otpResponse = await sendOtp(data.phone);
        // if (otpResponse.success) {
          setOtpSent(true);
        // } else {
          // Handle OTP sending error
          // console.error("Failed to send OTP", otpResponse.error);
        // }
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
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
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
        <DialogContent>
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
