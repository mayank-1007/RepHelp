import { Models } from "node-appwrite";
import { RoomNumber } from "../constants/index";

export interface Appointment extends Models.Document {
  schedule: Date;
  room_type: string;
  status: Status | '';
  reason: string;
  note: string | "";
  userId: string;
  cancellationReason: string | null;
}
