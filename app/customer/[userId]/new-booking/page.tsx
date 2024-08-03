import Image from "next/image";

import { AppointmentForm } from "@/components/form/AppointmentForm";
import { getCustomer } from "@/lib/actions/customer.actions";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getCustomer(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <div className="flex items-center">
            <Image
              src="/assets/icons/Logo.svg"
              height={1000}
              width={1000}
              alt="reception"
              className="-ml-2 mb-12 h-14 w-16 flex"
            />
            <span className=" text-3xl font-bold font-italic ml-5 mb-12 relative">
              RepHelp
            </span>
          </div>

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 Rephelp</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
