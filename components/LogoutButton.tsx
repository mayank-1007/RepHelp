"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear session authentication
    sessionStorage.setItem("adminAuthenticated", "false");
    toast.success("Logged out successfully");
    
    // Redirect to home page
    if(typeof window !== "undefined") {
      setTimeout(() => {
        router.push("/admin");
      }, 500);
    }
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
