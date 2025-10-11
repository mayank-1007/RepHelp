// New Prisma-based types
export interface Appointment {
  id: string;
  customerId: string;
  purpose: string;
  numberOfRooms: string | null;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  note: string | null;
  cancellationReason?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    customerDetails?: {
      id: string;
      customerImageUrl: string | null;
      identificationType: string | null;
      identificationNumber: string | null;
    } | null;
  };
}

