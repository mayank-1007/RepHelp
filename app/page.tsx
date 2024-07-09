import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="logo-wrapper img-text-wrapper flex sub-container max-w-[496px]">
          <Image
            src="/assets/icons/Logo.svg"
            height={1000}
            width={1000}
            alt="reception"
            className="mb-12 h-10 w-fit flex"
          />
          <h1 className="ml-4 text-2xl font-bold">Company Name</h1>
        </div>
      </section>
    </div>
  );
}
