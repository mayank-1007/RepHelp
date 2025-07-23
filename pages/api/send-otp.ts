import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

type Data = {
  success: boolean;
  otp?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { phone } = req.body;

  if (!phone) {
    res.status(400).json({ success: false, error: "Phone number is required" });
    return;
  }

  console.log(`Received phone number: ${phone}`);
  console.log(`Twilio Phone Number: ${twilioPhoneNumber}`);

  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error("Twilio environment variables are not set correctly");
    }

    if (!/^\+\d{10,15}$/.test(phone)) {
      res
        .status(400)
        .json({ success: false, error: "Invalid phone number format" });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP: ${otp}`);

    await client.messages.create({
      body: `Your verification code is ${otp}`,
      to: phone,
      from: twilioPhoneNumber,  // Use the verified Twilio number here
    });

    res.status(200).json({ success: true, otp });
  } catch (error: any) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      status: error.status,
      details: error.details, // Include any additional details if available
    });

    let errorMessage = "Internal server error";
    if (error.code === 20404) { // Twilio specific error for resource not found
      errorMessage = "Twilio resource not found";
    } else if (error.code === 21608) { // Twilio specific error for 'From' phone number
      errorMessage = "Invalid 'From' phone number for Twilio";
    } else if (error.code === 21610) { // Twilio specific error for SMS not allowed
      errorMessage = "SMS cannot be sent to the 'To' phone number";
    }

    res.status(500).json({ success: false, error: errorMessage });
  }
}
