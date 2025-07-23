"use server";
import { Query, ID } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  CUSTOMER_COLLECTION_ID,
  CUSTOMERDETAIL_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";
import { sendEmail } from "@/lib/email";
import { UserBindingInstance } from "twilio/lib/rest/ipMessaging/v2/service/user/userBinding";

export const createUser = async (user: CreateUserParams) => {
  try {
    console.log("Attempting to create user with data:", user);
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );
    console.log("User created successfully:", newUser);
    return newUser;
  } catch (error: any) {
    console.error("Error in createUser function:", error);
    if (error && error.code === 409) {
      try {
        const documents = await users.list([Query.equal("email", [user.email])]);
        console.log("Existing users with the same phone number:", documents);
        return documents.users[0]; // Return the existing user
      } catch (listError) {
        console.error("Error listing users with the same phone number:", listError);
        throw listError;
      }
    } else {
      console.error("An error occurred while creating a new user:", error);
      throw error;
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error: any) {
    console.error("An error occurred while registering user:", error);
    // throw error
  }
};

export const registerCustomer = async ({
  userId, // Assuming `id` is part of RegisterUserParams and used to identify the document
  ...customer
}: RegisterUserParams) => {
  try {
    // Check if the document exists
    let existingCustomer;
    if (userId) {
      try {
        existingCustomer = await databases.getDocument(
          DATABASE_ID!,
          CUSTOMERDETAIL_COLLECTION_ID!,
          userId
        );
      } catch (error) {
        // If the document does not exist, we can ignore the error
        if (error) {
          existingCustomer = null;
        } else {
          throw error;
        }
      }
    }

    if (existingCustomer) {
      const userId = UserBindingInstance; // or however you access the document ID

// Ensure userId is a string
    if (typeof userId !== 'string') {
      throw new Error('UserBindingInstance does not have a valid ID.');
    }
      // Update the existing document
      const updatedCustomer = await databases.updateDocument(
        DATABASE_ID!,
        CUSTOMER_COLLECTION_ID!,
        userId,
        {
          ...customer,
        }
      );
      return parseStringify(updatedCustomer);
    } else {
      // Create a new document
      const newCustomer = await databases.createDocument(
        DATABASE_ID!,
        CUSTOMERDETAIL_COLLECTION_ID!,
        ID.unique(),
        {
          ...customer,
        }
      );
      return parseStringify(newCustomer);
    }
  } catch (error) {
    console.log("An error occurred while registering a customer:", error);
  }
};


export const getCustomer = async (userId: string) => {
  try {
    const customers = await databases.listDocuments(
      DATABASE_ID!,
      CUSTOMER_COLLECTION_ID!,
      [Query.equal("userId", [userId])],
    );

    return parseStringify(customers.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the room details:",
      error,
    );
  }
};
const otpStore: { [userId: string]: { otp: string, expiresAt: number } } = {
  '668f88c7002c0813ce9a': { otp: "123456", expiresAt: Date.now() + 5 * 60 * 1000 } // OTP valid for 5 minutes
};

export async function sendOtp(phone: string, userId: string, email: string, name: string) {
  try {
    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Check if a document with the given userId already exists
    const existingDocuments = await databases.listDocuments(
      process.env.DATABASE_ID || "",          // Ensure DATABASE_ID is provided
      process.env.CUSTOMER_COLLECTION_ID || "", // Ensure CUSTOMER_COLLECTION_ID is provided
      [/* filters if needed */], // Adjust if you need to filter based on specific fields
    );

    const existingDocument = existingDocuments.documents.find(doc => doc.userId === userId);

    if (existingDocument) {
      // If document exists, update it with the new OTP (if needed)
      await databases.updateDocument(
        process.env.DATABASE_ID || "",
        process.env.CUSTOMER_COLLECTION_ID || "",
        existingDocument.$id, // ID of the existing document
        { 
          name : name,
          email: email,
          phone: phone,
          otp: otp, // Update the OTP
        }
      );
    } else {
      // Create a new document with the OTP
      await databases.createDocument(
        process.env.DATABASE_ID || "",
        process.env.CUSTOMER_COLLECTION_ID || "",
        userId, // This should be a unique ID, or you can use another unique field
        { 
          userId: userId,
          phone: phone,
          email: email,
          name: name,
          otp: otp,
        }
      );
    }

    // Send the OTP via email
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      body: `Your OTP code is ${otp}`,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    };
  }
}


  




export async function verifyOtp(userId: string, enteredOtp: string) {
  try {
    // Fetch the document from the database
    const document = await databases.getDocument(
      process.env.DATABASE_ID || "",
      process.env.CUSTOMER_COLLECTION_ID || "",
      userId
    );

    // Check if the entered OTP matches the stored OTP
    if (document.otp === enteredOtp) {
      // OTP is correct, update the document
      await databases.updateDocument(
        process.env.DATABASE_ID || "",
        process.env.CUSTOMER_COLLECTION_ID || "",
        userId,
        { otpVerified: true } // Ensure otpVerified field exists in your schema
      );

      return { success: true, message: "OTP verified successfully." };
    } else {
      // OTP is incorrect
      return { success: false, message: "Incorrect OTP." };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error instanceof Error ? { message: error.message, stack: error.stack } : error };
  }
}
