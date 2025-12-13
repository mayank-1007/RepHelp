"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RadioGroup } from "../ui/radio-group";
import { RadioGroupItem } from "../ui/radio-group";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { RoomNumber, roomTypes, PurposeOptions } from "@/constants";
import {
  createAppointment,
  updateAppointment,
  getAppointment,
} from "@/lib/actions/appointment.actions";
import { CreateBookingSchema } from "@/lib/validation";
import { toast } from "sonner";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField from "../CustomFormField";
import { FormFieldType } from "./CustomerForm";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";


export const AppointmentForm = ({
  userId,
  appointmentId,
  type,
  onSuccess,
} : {
    userId: string;
    appointmentId?: string;
    type?: "schedule" | "cancel";
    onSuccess?: () => void;
  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateBookingSchema>>({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      numberOfRooms: "",
      checkInDate: new Date(Date.now()),
      purpose: "",
      note: "",
    },
  });

  // Load existing appointment data for rescheduling
  useEffect(() => {
    if (appointmentId && type === "schedule") {
      setIsLoading(true);
      getAppointment(appointmentId).then((appointment) => {
        if (appointment) {
          form.reset({
            numberOfRooms: appointment.numberOfRooms || "",
            checkInDate: appointment.checkInDate ? new Date(appointment.checkInDate) : new Date(),
            checkOutDate: appointment.checkOutDate ? new Date(appointment.checkOutDate) : undefined,
            purpose: appointment.purpose,
            note: appointment.note || "",
          });
        }
        setIsLoading(false);
      });
    }
  }, [appointmentId, type]);

  const onSubmit = async (values: z.infer<typeof CreateBookingSchema>) => {
    setIsLoading(true);
    try {
        // If rescheduling (has appointmentId and type is schedule)
        if (appointmentId && type === "schedule") {
          await updateAppointment({
            appointmentId,
            appointment: {
              numberOfRooms: values.numberOfRooms,
              checkInDate: values.checkInDate.toISOString(),
              checkOutDate: values.checkOutDate?.toISOString(),
              purpose: values.purpose,
              note: values.note || "",
            },
          });
          toast.success("Appointment rescheduled successfully");
          onSuccess?.();
        } else {
          // Creating new appointment
          const appointment = {
            customerId: userId,
            numberOfRooms: values.numberOfRooms,
            checkInDate: values.checkInDate.toISOString(),
            checkOutDate: values.checkOutDate?.toISOString(),
            purpose: values.purpose,
            note: values.note || "",
          };

          const newAppointment = await createAppointment(appointment);

          if (newAppointment) {
            form.reset();
            router.push(
              `/customer/${userId}/new-booking/success?appointmentId=${newAppointment.id}`,
            );
          }
        }
    } catch (error) {
      console.log(error);
      toast.error(appointmentId ? "Failed to reschedule appointment" : "Failed to create appointment");
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <>
          <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="numberOfRooms"
              label="Number of Rooms"
              placeholder="Select number of rooms"
            >
              {["1", "2", "3", "4", "5+"].map((num, i) => (
                <SelectItem key={num + i} value={num}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{num}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="checkInDate"
              label="Check-in Date"
              showTimeSelect
              dateFormat="dd/MM/yyyy - h:mm aa"
            />

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="checkOutDate"
              label="Check-out Date (Optional)"
              showTimeSelect
              dateFormat="dd/MM/yyyy - h:mm aa"
            />
            <div className={`flex flex-col gap-6  xl:flex-row`}>
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
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer AC rooms, if possible"
              />
            </div>
        </>
        <SubmitButton isLoading={isLoading}>
          {appointmentId ? "Reschedule Appointment" : "Submit"}
        </SubmitButton>
      </form>
    </Form>
  );
};
