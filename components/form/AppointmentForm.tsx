"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RadioGroup } from "../ui/radio-group";
import { RadioGroupItem } from "../ui/radio-group";
import { Dispatch, SetStateAction, useState } from "react";
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
} from "@/lib/actions/appointment.actions";
import { CreateBookingSchema, ScheduleBookingSchema, CancelBookingSchema } from "@/lib/validation"; 
import { Appointment } from "@/types/appwrite.types"; // Removed Status

// Define Status type inline if not exported from appwrite.types
type Status = "pending" | "scheduled" | "cancelled";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField from "../CustomFormField";
import { FormFieldType } from "./CustomerForm";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

export const AppointmentForm = ({
  userId,
  appointment,
  type,
  setOpen,
}: {
  userId: string;
  appointment?: Appointment;
  type: "create" | "schedule" | "cancel"; 
  setOpen?: Dispatch<SetStateAction<boolean>>; 
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentValidationSchema =
    type === "cancel"
      ? CancelBookingSchema
      : type === "schedule"
        ? ScheduleBookingSchema
        : CreateBookingSchema;

  const form = useForm<z.infer<typeof AppointmentValidationSchema>>({
    resolver: zodResolver(AppointmentValidationSchema),
    defaultValues: {
      room_type: appointment?.room_type || "",
      schedule: appointment
        ? new Date(appointment.schedule!)
        : new Date(Date.now()),
      purpose: appointment?.purpose || "", 
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
      primaryPhysician: appointment?.primaryPhysician || "", // Added for schedule/cancel
    } as z.infer<typeof AppointmentValidationSchema>, // Added type assertion
  });

  const onSubmit = async (values: z.infer<typeof AppointmentValidationSchema>) => {
    setIsLoading(true);
    let success = false;

    try {
      if (type === "create") {
        // Explicitly cast values to the expected type for createAppointment
        const createValues = values as z.infer<typeof CreateBookingSchema>;
        const appointmentData = {
          userId,
          room_type: createValues.room_type,
          schedule: new Date(createValues.schedule),
          purpose: createValues.purpose!, 
          note: createValues.note || "",
          status: "pending" as Status, 
        };
        const newAppointment = await createAppointment(appointmentData);
        if (newAppointment) {
          router.push(
            `/customer/${userId}/new-booking/success?appointmentId=${newAppointment.$id}`
          );
          success = true;
        }
      } else if (type === "schedule" && appointment) {
         // Explicitly cast values to the expected type for updateAppointment (schedule)
        const scheduleValues = values as z.infer<typeof ScheduleBookingSchema>;
        const appointmentToUpdate = {
          ...appointment,
          schedule: new Date(scheduleValues.schedule),
          status: "scheduled" as Status,
          primaryPhysician: scheduleValues.primaryPhysician, 
        };
        const updatedAppointment = await updateAppointment({
          appointmentId: appointment.$id,
          userId,
          appointment: appointmentToUpdate,
          type: "schedule",
        });
        if (updatedAppointment) {
          success = true;
        }
      } else if (type === "cancel" && appointment) {
        // Explicitly cast values to the expected type for updateAppointment (cancel)
        const cancelValues = values as z.infer<typeof CancelBookingSchema>;
        const appointmentToUpdate = {
          ...appointment,
          status: "cancelled" as Status,
          cancellationReason: cancelValues.cancellationReason,
        };
        const updatedAppointment = await updateAppointment({
          appointmentId: appointment.$id,
          userId,
          appointment: appointmentToUpdate,
          type: "cancel",
        });
        if (updatedAppointment) {
          success = true;
        }
      }

      if (success && setOpen) {
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  let buttonLabel = "Submit";
  if (type === "create") {
    buttonLabel = "Create Booking";
  } else if (type === "schedule") {
    buttonLabel = "Schedule Booking";
  } else if (type === "cancel") {
    buttonLabel = "Cancel Booking";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type !== "cancel" && ( 
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="room_type"
              label="Room Type"
              placeholder="Select the room type"
            >
              {roomTypes.map((room_type, i) => (
                <SelectItem key={room_type + i} value={room_type}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{room_type}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label={type === "create" ? "Expected Check-in date and time" : "Booking Date and Time"}
              showTimeSelect
              dateFormat="dd/MM/yyyy - h:mm aa"
            />
            {/* Display Primary Physician field only when scheduling */}
            {type === 'schedule' && (
                <CustomFormField
                    fieldType={FormFieldType.INPUT} // Assuming primaryPhysician is a text input; adjust if it's a select, etc.
                    control={form.control}
                    name="primaryPhysician" // Make sure this name matches your Zod schema
                    label="Primary Physician"
                    placeholder="Enter physician's name"
                />
            )}
            <div className={`flex flex-col gap-6 xl:flex-row`}>
              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="purpose" 
                label="Purpose of Visit"
                placeholder="e.g., Official, Tourism"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-6 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {PurposeOptions.map((option) => (
                        <div key={option} className="radio-group">
                          <RadioGroupItem value={option} id={option} />
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
                label="Comments/Notes"
                placeholder="e.g., Prefer AC room, if possible"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason" // This name should match CancelBookingSchema
            label="Reason for Cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : ""} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};
