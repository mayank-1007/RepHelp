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
  id: string;
}

declare interface RegisterUserParams {
  customerId: string;
  // Prisma CustomerDetail fields
  dateOfBirth?: Date;
  birthDate?: Date; // Alias for dateOfBirth
  gender?: Gender;
  address?: string;
  state?: string;
  district?: string;
  nationality?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationDocUrl?: string;
  customerImageUrl?: string;
  signatureUrl?: string;
  treatmentConsent?: boolean;
  disclosureConsent?: boolean;
  privacyConsent?: boolean;
  
  // Additional form fields (not stored in CustomerDetail, ignored by registerCustomer)
  name?: string;
  email?: string;
  phone?: string;
  room_no?: string;
  number_of_rooms?: string;
  check_in?: Date;
  check_out?: Date;
  vehicle_no?: string;
  purpose?: string;
  occupation?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  customer_image?: File[];
  identificationDocument?: File[];
  signature?: string;
}

declare type CreateAppointmentParams = {
  customerId: string;
  purpose: string;
  numberOfRooms?: string;
  checkInDate?: string;
  checkOutDate?: string;
  note?: string;
  status?: string;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  appointment: {
    status?: string;
    checkInDate?: string;
    checkOutDate?: string;
    note?: string;
    cancellationReason?: string;
    numberOfRooms?: string;
    purpose?: string;
  };
};
