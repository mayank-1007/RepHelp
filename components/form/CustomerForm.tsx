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
import { TEST_CREDENTIALS } from "@/constants";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
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
        setUserId(user.$id);
        // If using demo credentials, skip OTP and go straight to register
        if (isTestCredentials(data)) {
          setIsLoading(false);
          return router.push(`/customer/${user.$id}/register`);
        }

        const otpResponse = await sendOtp(
          data.phone,
          user.$id,
          data.email,
          data.name
        );

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
