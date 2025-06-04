import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

const AdminPage = async () => {
  const appointments = await getRecentAppointmentList();

  // Ensure appointments has default values if undefined
  const safeAppointments = appointments || {
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
    documents: []
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header max-h-[80px]">
        <Link href="/" className="cursor-pointer mt-7 mb-1">
          <div className="flex flex-col gap-1 xl:flex-row">
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

        <Link href="/master-admin" className="mb-2 text-16-semibold">
          Admin Dashboard
        </Link>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome Admin 👋</h1>
          <pre className="text-dark-700">
            Start the day with managing the bookings.
          </pre>
        </section>        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={safeAppointments.scheduledCount || 0}
            label="Scheduled Booking"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={safeAppointments.pendingCount || 0}
            label="Pending Booking"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={safeAppointments.cancelledCount || 0}
            label="Cancelled Booking"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns || []} data={safeAppointments.documents || []} />
      </main>
    </div>
  );
};

export default AdminPage;
