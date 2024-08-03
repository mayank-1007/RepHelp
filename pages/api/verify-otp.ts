import type { NextApiRequest, NextApiResponse } from "next";
import { Client, Databases, Query } from "appwrite";

const appwriteClient = new Client();
const databases = new Databases(appwriteClient);

appwriteClient
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!);

const verifyOtp = async (phone: string, otp: string) => {
  const otpDocs = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_COLLECTION_ID!,
    [Query.equal("phone", phone), Query.equal("otp", otp)],
  );

  if (otpDocs.total === 0) {
    return false;
  }

  const otpDoc = otpDocs.documents[0];
  const currentTime = new Date().toISOString();
  if (currentTime > otpDoc.expiresAt) {
    return false;
  }

  await databases.deleteDocument(
    process.env.APPWRITE_DATABASE_ID!,
    process.env.APPWRITE_COLLECTION_ID!,
    otpDoc.$id,
  );

  return true;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  try {
    const result = await verifyOtp(phone, otp);
    if (result) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
}
