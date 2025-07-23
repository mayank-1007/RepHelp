import { Models } from "node-appwrite";
import { RoomNumber } from "../constants/index";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

export interface Appointment extends Models.Document {
  patient: Patient;
  schedule: Date;
  room_type: string;
  status: Status | '';
  primaryPhysician: string;
  reason: string;
  note: string | "";
  userId: string;
  cancellationReason: string | null;
}
