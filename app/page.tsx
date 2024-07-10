import CustomerForm from "@/components/form/CustomerForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="flex logo-wrapper img-text-wrapper sub-container max-w-[496px]">
          <div className="flex items-center">
            <Image
              src="/assets/icons/Logo.svg"
              height={1000}
              width={1000}
              alt="reception"
              className="-ml-2 mb-12 h-14 w-16 flex"
            />
            <span className=" text-3xl font-bold font-italic ml-5 mb-12 relative" >RepHelp</span>
          </div>
          <CustomerForm/>

          <div className="text-14-regular mt-20 flex justify-between ">
            <p className="justify-items-end text-dark-500 xl:text-left">
              ©️ 2024 RepHelp
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding.webp"
        height={1000}
        width={1000}
        alt="customer"
        className="side-img max-w-[50%] rounded-l-3xl"
      />
    </div>
  );
}
