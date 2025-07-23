import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const CustomerFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number").optional(),
  room_no: z.string().optional(),
  number_of_rooms: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  check_in: z.coerce.date().default(new Date()).optional(),
  check_out: z.coerce.date().optional(),
  nationality: z.string().optional(),
  vehicle_no: z.string().optional(),
  purpose: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  customer_image: z.custom<File[]>().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  signature: z.string().url("Incorrect URL").optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters").optional(),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters").optional(),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters").optional(),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number",
    ).optional(),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters").optional(),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters").optional(),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }).optional(),
});

export const CreateBookingSchema = z.object({
  schedule: z.coerce.date(),
  room_type: z.string(),
  purpose: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
});

export const ScheduleBookingSchema = z.object({
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  Status: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelBookingSchema = z.object({
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getBookingSchema(type: string) {
  switch (type) {
    case "create":
      return CreateBookingSchema;
    case "cancel":
      return CancelBookingSchema;
    default:
      return ScheduleBookingSchema;
  }
}
