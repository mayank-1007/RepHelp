import React from "react";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "@/components/form/RegisterForm";
import { getUser } from "@/lib/actions/customer.actions";
const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  return (
    <div className="flex">
      <section className="remove-scrollbar container">
        <div className="flex-1 flex-col sub-container max-w-[860px] py-10">
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
          <RegisterForm user={user} />
          <p className="copyright py-12">©️ 2024 RepHelp</p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        layout="responsive"
        width={1000}
        height={600}
        alt="customer"
        className="h-screen side-img max-w-[40%] rounded-l-3xl"
      />
    </div>
  );
};

export default Register;
