"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from '@/components/SubmitButton';
import { UserFormValidation } from "@/lib/validation"
import { useState } from "react"
import { useRouter } from "next/navigation"


export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT= 'phoneInput',
    CHECKBOX='checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}
 

 
export default function CustomerForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try {
      // const userData = {
      //   name,
      //   email,
      //   phone,
      // }
      
      // const user = await createUser(userData);
      // if(user) router.push(`/customer/${user.$id}/register`)
    }
    catch(error) {
      console.log(error);
    }
  }
    return(
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1  className="header">Hi there 👋</h1>
            <p  className="text-dark-700">Let&apos;s  Book  Your  Room</p>
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
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />
        <SubmitButton isLoading={isLoading}>Welcome</SubmitButton>
      </form>
    </Form>
    )
}