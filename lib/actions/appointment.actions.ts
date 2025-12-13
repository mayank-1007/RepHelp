"use server";

import { prisma } from "../db";
import { revalidatePath } from "next/cache";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const checkInDate = appointment.checkInDate ? new Date(appointment.checkInDate) : new Date();
    const now = new Date();
    
    // Determine initial status based on check-in time
    let initialStatus = "pending";
    if (checkInDate <= now) {
      // If check-in is now or in the past, mark as scheduled
      initialStatus = "scheduled";
    }
    
    const newAppointment = await prisma.appointment.create({
      data: {
        customerId: appointment.customerId,
        purpose: appointment.purpose,
        numberOfRooms: appointment.numberOfRooms || null,
        checkInDate: checkInDate,
        checkOutDate: appointment.checkOutDate ? new Date(appointment.checkOutDate) : null,
        note: appointment.note || null,
        status: initialStatus,
      },
    });

    revalidatePath("/admin");
    return newAppointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        customer: {
          include: {
            customerDetails: true,
          },
        },
      },
    });

    return appointment;
  } catch (error) {
    console.error("Error retrieving appointment:", error);
    return null;
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        customer: {
          include: {
            customerDetails: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const counts = {
      scheduledCount: appointments.filter((apt: any) => apt.status === "scheduled").length,
      pendingCount: appointments.filter((apt: any) => apt.status === "pending").length,
      cancelledCount: appointments.filter((apt: any) => apt.status === "cancelled").length,
    };

    return {
      totalCount: appointments.length,
      ...counts,
      documents: appointments,
    };
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return {
      totalCount: 0,
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
      documents: [],
    };
  }
};

export const updateAppointment = async ({
  appointmentId,
  appointment,
}: UpdateAppointmentParams) => {
  try {
    // Prepare update data
    const updateData: any = {};

    // If status is being updated
    if (appointment.status) {
      updateData.status = appointment.status;
    }

    // If cancelling, save cancellationReason
    if (appointment.status === "cancelled" && appointment.cancellationReason) {
      updateData.cancellationReason = appointment.cancellationReason;
    }

    // If rescheduling, update dates and check smart status logic
    if (appointment.checkInDate && appointment.checkOutDate) {
      const checkInDate = new Date(appointment.checkInDate);
      const now = new Date();
      
      updateData.checkInDate = checkInDate;
      updateData.checkOutDate = new Date(appointment.checkOutDate);
      
      // Smart status logic for rescheduling
      if (checkInDate <= now) {
        updateData.status = "scheduled";
      } else {
        updateData.status = "pending";
      }
    }

    // Update note if provided
    if (appointment.note) {
      updateData.note = appointment.note;
    }

    // Update numberOfRooms if provided
    if (appointment.numberOfRooms) {
      updateData.numberOfRooms = appointment.numberOfRooms.toString();
    }

    // Update purpose if provided
    if (appointment.purpose) {
      updateData.purpose = appointment.purpose;
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
    });

    revalidatePath("/admin");
    return updatedAppointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};
