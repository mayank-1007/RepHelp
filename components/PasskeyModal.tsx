"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only show modal if on admin path
    if (path === "/admin") {
      // Check if user is authenticated in this session
      if (typeof window !== "undefined") {
        const sessionAuth = sessionStorage.getItem("adminAuthenticated");
        
        if (sessionAuth === "true") {
          setIsAuthenticated(true);
          setOpen(false);
        } else {
          setIsAuthenticated(false);
          setOpen(true);
        }
      }
    }
  }, [path]);

  const closeModal = () => {
    setOpen(false);
    toast.info("Authentication cancelled");
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (passkey.length !== 6) {
      setError("Please enter all 6 digits");
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    const adminPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || "111111";

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (passkey === adminPasskey) {
        // Use sessionStorage instead of localStorage
        // This will require re-authentication when browser/tab is closed
        if (typeof window !== "undefined") {
          sessionStorage.setItem("adminAuthenticated", "true");
        }
        
        toast.success("Access granted! Welcome Admin 👋");
        setIsAuthenticated(true);
        setOpen(false);
        setError("");
      } else {
        setError("Invalid passkey. Please try again.");
        toast.error("Invalid passkey. Please try again.");
        setPasskey(""); // Clear the input
      }
      setIsLoading(false);
    }, 800);
  };

  // Don't render anything until mounted (client-side only)
  if (!mounted) {
    return null;
  }

  // If authenticated, don't render the modal
  if (isAuthenticated) {
    return null;
  }

  // Don't show modal if not on admin path
  if (path !== "/admin") {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value: any) => setPasskey(value)}
            disabled={isLoading}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e: any) => validatePasskey(e)}
            disabled={isLoading || passkey.length !== 6}
            className="shad-primary-btn w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Verifying...
              </div>
            ) : (
              "Enter Admin Passkey"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
