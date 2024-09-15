import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);

  // const doctor = Doctors.find(
  //   (doctor) => doctor.name === appointment.primaryPhysician,
  // );

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href={`/customer/${userId}/new-booking`} className="flex-row cursor-pointer mt-7 mb-1">
          <div className="flex flex-row gap-1 xl:flex-row">
            <Image
              src="/assets/icons/Logo.svg"
              height={1000}
              width={1000}
              alt="logo"
              className="h-14 w-fit"
            />
            <span className=" text-3xl font-bold font-italic mt-2 ml-5 mb-12 relative">
              RepHelp
            </span>
          </div>
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">Booking request</span> has
            been successfully submitted!
          </h2>
          <p>Our team will be in touch shortly to confirm your booking.</p>
        </section>

        <section className="request-details">
          <p>Requested Booking details: </p>
          <div className="flex items-center gap-3">
            <Image
              src="\assets\icons\room.svg"
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Room Type : {appointment.room_type}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> Checkout DateTime : {appointment.schedule?formatDateTime(appointment.schedule).dateTime : (new Date()).toISOString().split('T')[0]}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/customer/${userId}/new-booking`}>New Booking</Link>
        </Button>

        <p className="copyright">© 2024 Rephelp</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
