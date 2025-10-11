"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear session authentication
    sessionStorage.removeItem("adminAuthenticated");
    toast.success("Logged out successfully");
    
    // Redirect to home page
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="shad-gray-btn"
    >
      Logout
    </Button>
  );
};
