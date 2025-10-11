"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { AppointmentForm } from "./form/AppointmentForm";
import { updateAppointment } from "@/lib/actions/appointment.actions";
import { toast } from "sonner";

import "react-datepicker/dist/react-datepicker.css";

export const AppointmentModal = ({
  userId,
  appointmentId,
  type,
}: {
  userId: string;
  appointmentId: string;
  type: "schedule" | "cancel";
}) => {
  const [open, setOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (!cancellationReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    startTransition(async () => {
      try {
        await updateAppointment({
          appointmentId,
          appointment: {
            status: "cancelled",
            cancellationReason,
          },
        });
        toast.success("Appointment cancelled successfully");
        setOpen(false);
      } catch (error) {
        toast.error("Failed to cancel appointment");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            {type === "cancel"
              ? "Please provide a reason for cancelling this appointment"
              : "Update the appointment details below"}
          </DialogDescription>
        </DialogHeader>

        {type === "cancel" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancellationReason">Cancellation Reason</Label>
              <Textarea
                id="cancellationReason"
                placeholder="Please explain why you're cancelling..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button
              onClick={handleCancel}
              disabled={isPending}
              className="w-full shad-danger-btn"
            >
              {isPending ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </div>
        ) : (
          <AppointmentForm
            userId={userId}
            appointmentId={appointmentId}
            type={type}
            onSuccess={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
