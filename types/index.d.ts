/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string | undefined;
  name?: string | undefined;
  email?: string | undefined; 
  phone?: string | undefined;
  birthDate?: Date | undefined;
  number_of_rooms?: string | undefined;
  // coming_from: string | undefined;
  // going_to: string | undefined;
  gender?: Gender | undefined;
  address?: string | undefined;
  nationality?: string | undefined | "";
  vehicle_no?: string | "" | undefined;
  purpose?: string | "" | undefined;
  occupation?: string | undefined;
  emergencyContactName?: string | undefined;
  emergencyContactNumber?: string | undefined;
  customer_image?: formData | undefined;
  check_in?: Date | undefined;
  check_out?: Date | undefined;
  identificationType?: string | "" | undefined;
  identificationNumber?: string | "" | undefined;
  identificationDocument?: customerformData | undefined;
  privacyConsent?: boolean | undefined;
}

declare type CreateAppointmentParams = {
  // userId: string;
  purpose: string | "";
  schedule: Date;
  room_type: string;
  note: string | "";
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  appointment: Appointment;
  type: string;
};
