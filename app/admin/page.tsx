"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { PasskeyModal } from "@/components/PasskeyModal";
import { LogoutButton } from "@/components/LogoutButton";

const AdminPage = () => {
  const [appointments, setAppointments] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Check authentication
  //   const checkAuth = () => {
  //     if (typeof window !== "undefined") {
  //       const sessionAuth = sessionStorage.getItem("adminAuthenticated");
  //       console.log("Session Auth:", sessionAuth === "true");
  //       setIsAuthenticated(sessionAuth === "true");
  //     }
  //     setIsLoading(false);
  //   };

  //   checkAuth();

  //   // Listen for authentication changes
  //   const interval = setInterval(() => {
  //     if (typeof window !== "undefined") {
  //       const sessionAuth = sessionStorage.getItem("adminAuthenticated");
  //       const newAuthState = sessionAuth === "true";
        
  //       if (newAuthState !== isAuthenticated) {
  //         setIsAuthenticated(newAuthState);
          
  //         // Load appointments when authenticated
  //         if (newAuthState) {
  //           loadAppointments();
  //         }
  //       }
  //     }
  //   }, 500);

  //   return () => clearInterval(interval);
  // }, [isAuthenticated]);

  const loadAppointments = async () => {
    const data = await getRecentAppointmentList();
    setAppointments(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-lg text-dark-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Show passkey modal if not authenticated
  if (!isAuthenticated) {
    return <PasskeyModal />;
  }

  // Show loading while appointments are being fetched
  if (!appointments) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-lg text-dark-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header max-h-[80px]">
        <Link href="/" className="cursor-pointer mt-7 mb-1">
          <div className="flex flex-row gap-1 xl:flex-row">
            <Image
              src="/assets/icons/Logo.svg"
              height={1000}
              width={1000}
              alt="logo"
              className="h-14 w-fit"
            />
            <span className="text-3xl font-bold font-italic mt-2 ml-5 mb-12 relative">
              RepHelp
            </span>
          </div>
        </Link>
        <LogoutButton />
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome Admin 👋</h1>
          <pre className="text-dark-700">
            Start the day with managing the bookings.
          </pre>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount || 0}
            label="Scheduled Booking"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount || 0}
            label="Pending Booking"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount || 0}
            label="Cancelled Booking"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns || []} data={appointments.documents || []} />
      </main>
    </div>
  );
};

export default AdminPage;
