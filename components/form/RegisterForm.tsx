"use client";

import React, { useState, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import { UserFormValidation, CustomerFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerCustomer } from "@/lib/actions/customer.actions";
import { FormFieldType } from "./CustomerForm";
import { RadioGroup } from "../ui/radio-group";
import { CustomerFormDefaultValues, GenderOptions } from "@/constants";
import {
  RoomNumber,
  Identificationtypes,
  countries,
  PurposeOptions,
  NumberOfRooms,
} from "@/constants";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { FileUploader } from "../FileUploader";
import { RadioGroupItem } from "../ui/radio-group";
import CountrySelect from "../Nationality";
import NestedDropdown from "../StateDistrict";
import SignaturePad from "../SignaturePad";
import { cn } from "@/lib/utils";
import Dropdown from "react-dropdown";
import { Option } from "lucide-react";
import "react-dropdown/style.css";
import { Options } from "next/dist/server/base-server";
import { SelectItem } from "@radix-ui/react-select";
import CapturePopover from "../CustomerImage";
import { DocumentScanPopover } from "../DocumentImage";
import Link from "next/link";
import DocumentTypeSelector from "../DocumentImageScan";

const getCurrentDate = (): Date => {
  return new Date();
};

export default function RegisterForm({ user }: { user: User }) {
  const [selectedIdentificationType, setSelectedIdentificationType] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  
  const form = useForm<z.infer<typeof CustomerFormValidation>>({
    resolver: zodResolver(CustomerFormValidation),
    defaultValues: {
      ...CustomerFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });
  const handleScanComplete = (data: any) => {
    const currentValues = form.getValues();

    if (!currentValues.name) {
      form.setValue("name", data.name.toUpperCase());
    }
    if (!currentValues.identificationNumber) {
      form.setValue("identificationNumber", data.idNumber);
    }
    if (!currentValues.birthDate) {
      form.setValue("birthDate", data.dob);
    }
    if (!currentValues.address) {
      form.setValue("address", data.address);
    }

    console.log(data);
    // Add other fields as needed, checking if they are empty before setting the value
  };

  const handleSave = (dataURL: any) => {
    // This function will receive the signature dataURL
    console.log("Signature saved:", dataURL);
    setSelectedIdentificationType(dataURL);

    // You can perform additional actions here, such as sending the dataURL to a server or storing it in state
  };


  const [abc, setAbc] = useState("");


  const handleIdentificationTypeChange = (event: string) => {
    setSelectedIdentificationType(event);
  };



  const onSubmit = async (values: z.infer<typeof CustomerFormValidation>) => {
    console.log("Form submission started");
    setIsLoading(true);
  
    try {
      const customerData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate ? values.birthDate : getCurrentDate()),
      };
      
      // Debugging statements
      console.log("Customer Data:", customerData);
      
      const customer = await registerCustomer(customerData);
      
      console.log("Customer registered successfully:", customer);
      
      // Ensure router push is reached
      console.log("Navigating to the new booking route");
      router.push(`/customer/${user.$id}/new-booking`);
      
    } catch (error) {
      console.log("An error occurred during form submission:", error);
    } finally {
      // Ensure loading is disabled regardless of success or error
      setIsLoading(false);
    }
  };


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Let&apos;s Add some more of your details
          </p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Krishna"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
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
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="DOB"
            placeholder="dd/mm/yyyy"
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            placeholder="Male"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="address"
            label="Adress"
            placeholder="46th Street, Banglore"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact"
            placeholder="Gaurdian's name"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="80908088098"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Additional Information</h2>
          </div>
        </section>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="number_of_rooms"
            label="Number of Rooms"
            placeholder="Select the number of rooms"
            value="1"
          >
            {NumberOfRooms.map((room) => (
              <SelectItem key={room} value={room}>
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{room}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="room_no"
            label="Room Number"
            placeholder="Select Room Number"
            value=""
          >
            {RoomNumber.map((room) => (
              <SelectItem key={room.name} value={room.name + " " + room.type}>
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{`${room.name} (${room.type})`}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="check_in"
            label="Check In Date"
            placeholder="dd/mm/yyyy"
            value={getCurrentDate().toISOString()}
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="check_out"
            label="Expected Check out Date"
            placeholder="dd/mm/yyyy"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="nationality"
            label="Nationality"
            placeholder="Select your nationality"
            value=""
          >
            {countries.map((room) => (
              <SelectItem key={room.value} value={room.label}>
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{`${room.label}`}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="vehicle_no"
            label="Vehicle Number"
            placeholder="Vehicle Number"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="purpose"
            label="Purpose"
            placeholder="official"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {PurposeOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>
        <div className="flex-box">
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="coming_from"
            label="Coming From"
            renderSkeleton={(field) => (
              <FormControl>
                <NestedDropdown />
              </FormControl>
            )}
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="going_to"
            label="Going To"
            renderSkeleton={(field) => (
              <FormControl>
                <NestedDropdown />
              </FormControl>
            )}
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select identification type"
            onChange={handleIdentificationTypeChange}
            value=""
          >
            {Identificationtypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label={`${selectedIdentificationType} Number`}
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <DocumentScanPopover onScanComplete={handleScanComplete} />
              </FormControl>
            )}
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="customer_image"
            label="Customer Image"
            renderSkeleton={(field) => (
              <FormControl>
                <CapturePopover />
              </FormControl>
            )}
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="signature"
            label="Signature"
            renderSkeleton={(field) => (
              <FormControl>
                <SignaturePad onSave={handleSave} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive updates for the hotel managment team."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my information for government purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading} >Welcome</SubmitButton>
       
      </form>
    </Form>
  );
}

