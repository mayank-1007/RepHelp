"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { roomTypes } from "@/constants";
import { formatDateTime } from "@/lib/utils";

import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { Appointment } from "@/types/appwrite.types";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.room_type}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.purpose} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "room_type",
    header: "Room",
    cell: ({ row }) => {
      const appointment = row.original;

      const room = roomTypes.find(
        (room) => room === appointment.room_type,
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icons/room.svg"
            alt="room"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Room Type : {room}</p>
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
            userId={appointment.userId}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            userId={appointment.userId}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];
