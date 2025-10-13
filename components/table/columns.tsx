"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { formatDateTime } from "@/lib/utils";
import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { Appointment } from "@/types/prisma.types";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      const appointment = row.original;
      const isCancelled = appointment.status === "cancelled";
      return (
        <p className={`text-14-medium ${isCancelled ? "line-through text-gray-500" : ""}`}>
          {row.index + 1}
        </p>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const appointment = row.original;
      const isCancelled = appointment.status === "cancelled";
      return (
        <div className="flex items-center gap-3">
          {appointment.customer?.customerDetails?.customerImageUrl && (
            <Image
              src={appointment.customer.customerDetails.customerImageUrl}
              alt="customer"
              width={32}
              height={32}
              className={`size-8 rounded-full ${isCancelled ? "opacity-50" : ""}`}
            />
          )}
          <p className={`text-14-medium ${isCancelled ? "line-through text-gray-500" : ""}`}>
            {appointment.customer?.name || "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status as Status} />
        </div>
      );
    },
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
    cell: ({ row }) => {
      const appointment = row.original;
      const isCancelled = appointment.status === "cancelled";
      return (
        <p className={`text-14-regular ${isCancelled ? "line-through text-gray-500" : ""}`}>
          {appointment.purpose}
        </p>
      );
    },
  },
  {
    accessorKey: "checkInDate",
    header: "Check-In",
    cell: ({ row }) => {
      const appointment = row.original;
      const isCancelled = appointment.status === "cancelled";
      return (
        <p className={`text-14-regular min-w-[100px] ${isCancelled ? "line-through text-gray-500" : ""}`}>
          {appointment.checkInDate
            ? formatDateTime(appointment.checkInDate).dateTime
            : "Not set"}
        </p>
      );
    },
  },
  {
    accessorKey: "numberOfRooms",
    header: "Rooms",
    cell: ({ row }) => {
      const appointment = row.original;
      const isCancelled = appointment.status === "cancelled";
      return (
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icons/room.svg"
            alt="room"
            width={32}
            height={32}
            className={`size-8 ${isCancelled ? "opacity-50" : ""}`}
          />
          <p className={`whitespace-nowrap ${isCancelled ? "line-through text-gray-500" : ""}`}>
            {appointment.numberOfRooms || "N/A"} Room(s)
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            userId={appointment.customerId}
            appointmentId={appointment.id}
            type="schedule"
          />
          <AppointmentModal
            userId={appointment.customerId}
            appointmentId={appointment.id}
            type="cancel"
          />
        </div>
      );
    },
  },
];

