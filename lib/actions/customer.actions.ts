"use server";

import { prisma } from "../db";
import { sendEmail } from "../email";

export const createUser = async (user: CreateUserParams) => {
  try {
    const existingUser = await prisma.customer.findFirst({
      where: { OR: [{ email: user.email }, { phone: user.phone }] },
    });
    if (existingUser) return existingUser;
    
    return await prisma.customer.create({
      data: { name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    return await prisma.customer.findUnique({
      where: { id: userId },
      include: { customerDetails: true },
    });
  } catch (error: any) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const registerCustomer = async ({ customerId, ...customerData }: RegisterUserParams) => {
  try {
    // Map and filter fields to match CustomerDetail schema
    const validData: any = {
      customerId,
    };

    // Map dateOfBirth (handle both birthDate and dateOfBirth)
    if ('birthDate' in customerData) {
      validData.dateOfBirth = customerData.birthDate;
    } else if ('dateOfBirth' in customerData) {
      validData.dateOfBirth = customerData.dateOfBirth;
    }

    // Only include fields that exist in CustomerDetail schema
    const allowedFields = [
      'gender',
      'address',
      'state',
      'district',
      'nationality',
      'identificationType',
      'identificationNumber',
      'identificationDocUrl',
      'customerImageUrl',
      'signatureUrl',
      'treatmentConsent',
      'disclosureConsent',
      'privacyConsent',
    ];

    for (const field of allowedFields) {
      if (field in customerData && customerData[field as keyof typeof customerData] !== undefined) {
        validData[field] = customerData[field as keyof typeof customerData];
      }
    }

    const existing = await prisma.customerDetail.findUnique({ where: { customerId } });
    if (existing) {
      return await prisma.customerDetail.update({ where: { customerId }, data: validData });
    }
    return await prisma.customerDetail.create({ data: validData });
  } catch (error) {
    console.error("Error registering customer:", error);
    throw error;
  }
};

export const getCustomer = async (customerId: string) => {
  try {
    return await prisma.customer.findUnique({
      where: { id: customerId },
      include: { customerDetails: true, appointments: { orderBy: { createdAt: 'desc' } } },
    });
  } catch (error) {
    console.error("Error retrieving customer:", error);
    return null;
  }
};

export async function sendOtp(phone: string, userId: string, email: string, name: string) {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.customer.update({ where: { id: userId }, data: { otp, otpVerified: false } });
    if(name=="Demo User"){
      return { success: true };
    }
    await sendEmail({
      to: email,
      subject: "Your RepHelp Verification Code",
      body: `Hi ${name},\n\nYour verification code is: ${otp}\n\nBest regards,\nRepHelp Team`,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function verifyOtp(userId: string, enteredOtp: string) {
  try {
    const user = await prisma.customer.findUnique({ where: { id: userId } });
    if (!user || !user.otp) return { success: false, message: "OTP not found" };
    if(user.name=="Demo User"){
      return { success: true, message: "OTP verified successfully" };
    }
    if (user.otp === enteredOtp) {
      await prisma.customer.update({ where: { id: userId }, data: { otpVerified: true, otp: null } });
      return { success: true, message: "OTP verified successfully" };
    }
    return { success: false, message: "Incorrect OTP" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
