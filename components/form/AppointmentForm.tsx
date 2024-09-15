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
import { CreateBookingSchema } from "@/lib/validation"; // Import schema directly
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField from "../CustomFormField";
import { FormFieldType } from "./CustomerForm";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";

// export const AppointmentForm = ({
//   userId,
//   appointment,
//   setOpen,
// }: {
//   userId: string;
//   appointment?: Appointment;
//   setOpen?: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   // Use CreateBookingSchema directly
//   const form = useForm<z.infer<typeof CreateBookingSchema>>({
//     resolver: zodResolver(CreateBookingSchema),
//     defaultValues: {
//       room_type: appointment ? appointment.room_type   : "",
//       schedule: appointment
//         ? new Date(appointment.schedule!)
//         : new Date(Date.now()),
//       reason: appointment ? appointment.reason : "",
//       note: appointment?.note || "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof CreateBookingSchema>) => {
//     console.log("hello");
//     setIsLoading(true);

//     try {
//       if (userId) {
//         const appointment = {
//           userId,
//           room_type: values.room_type,
//           schedule: new Date(values.schedule),
//           reason: values.reason!,
//           note: values.note || "", // Ensure note is always a string
//         };

//         const newAppointment = await createAppointment(appointment);

//         if (newAppointment) {
//           form.reset();
//           router.push(
//             `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`,
//           );
//         }
//       } 
//     } catch (error) {
//       console.log(error);
//     }
//     setIsLoading(false);
//   };


//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
//           <section className="mb-12 space-y-4">
//             <h1 className="header">New Booking</h1>
//             <pre className="text-dark-700">Book your Room in seconds.</pre>
//           </section>

//           <>
//             <CustomFormField
//               fieldType={FormFieldType.SELECT}
//               control={form.control}
//               name="room_type"
//               label="Room Type"
//               placeholder="Select the room type"
//             >
//               {roomTypes.map((room_type, i) => (
//                 <SelectItem key={room_type + i} value={room_type}>
//                   <div className="flex cursor-pointer items-center gap-2">
//                     <p>{room_type}</p>
//                   </div>
//                 </SelectItem>
//               ))}
//             </CustomFormField>

//             <CustomFormField
//               fieldType={FormFieldType.DATE_PICKER}
//               control={form.control}
//               name="schedule"
//               label="Expected CheckOut date and time"
//               showTimeSelect
//               dateFormat="dd/MM/yyyy - h:mm aa"
//             />

//             <div
//               className={`flex flex-col gap-6  xl:flex-row`}
//             >
//               <CustomFormField
//                 fieldType={FormFieldType.SKELETON}
//                 control={form.control}
//                 name="purpose"
//                 label="Purpose"
//                 placeholder="official"
//                 renderSkeleton={(field) => (
//                   <FormControl>
//                     <RadioGroup
//                       className="flex h-11 gap-6 xl:justify-between"
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       {PurposeOptions.map((option) => (
//                         <div key={option} className="radio-group">
//                           <RadioGroupItem value={option} />
//                           <Label htmlFor={option} className="cursor-pointer">
//                             {option}
//                           </Label>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                   </FormControl>
//                 )}
//               />

//               <CustomFormField
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="note"
//                 label="Comments/notes"
//                 placeholder="Prefer AC rooms, if possible"
//               />
//             </div>
//           </>

//         <SubmitButton
//           isLoading={isLoading}
//         >
//           Submit
//         </SubmitButton>
//       </form>
//     </Form>
//   );
// };


export const AppointmentForm = ({
  userId
} : {
    userId: string;
  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateBookingSchema>>({
    resolver: zodResolver(CreateBookingSchema),
    defaultValues: {
      room_type: "",
      schedule: new Date(Date.now()),
      purpose: "",
      note: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    console.log("hello"); // Check if this is logged
    console.log(values);
    try {
        const appointment = {
          userId: userId,
          room_type: values.room_type,
          schedule: new Date(values.schedule),
          purpose: values.purpose || "",
          note: values.note || "", // Ensure note is always a string
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/customer/${userId}/new-booking/success?appointmentId=${newAppointment.$id}`,
          );
        }
    } catch (error) {
      console.log(error);
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
              label="Expected CheckOut date and time"
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
        <SubmitButton isLoading={isLoading} >Submit</SubmitButton>
      </form>
    </Form>
  );
};
