"use server";
import { Query, ID } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  CUSTOMER_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
  try {
    // Attempt to create a new user
    console.log("Attempting to create user with data:", user); // Debugging line
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );
    console.log("User created successfully:", newUser); // Debugging line
    return parseStringify(newUser);
  } catch (error: any) {
    console.error("Error in createUser function:", error); // Better error logging
    if (error && error.code === 409) {
      // Handle conflict: user with the same email exists
      try {
        const documents = await users.list([
          Query.equal("phone", [user.phone]),
        ]);
        console.log("Existing users with the same email:", documents); // Debugging line
        return documents?.users[0]; // Return the existing user
      } catch (listError) {
        console.error("Error listing users with the same email:", listError); // Error listing users
        throw listError; // Rethrow to be handled by the caller
      }
    } else {
      // Handle other errors
      console.error("An error occurred while creating a new user:", error);
      throw error; // Rethrow the error to be handled by the caller
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
  customer_image,
  identificationDocument,
  ...customer
}: RegisterUserParams) => {
  try {
    let file;
    if (customer_image && identificationDocument) {
      const inputFile1 = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string,
      );
      const inputFile2 = InputFile.fromBuffer(
        customer_image?.get("blobFile") as Blob,
        customer_image?.get("fileName") as string,
      );
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile1);
    }
    const newCustomer = await databases.createDocument(
      DATABASE_ID!,
      CUSTOMER_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...customer,
      },
    );
    return parseStringify(newCustomer);
  } catch (error) {
    console.log("An error occurred while creating a new patient:", error);
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
      "An error occurred while retrieving the patient details:",
      error,
    );
  }
};

export async function sendOtp(
  phone: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("http://localhost:3000/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    // Log response details for debugging
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("Response body:", await response.text());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      console.log("OTP sent successfully:", data.otp);
      return { success: true };
    } else {
      console.error("Failed to send OTP:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.error("Error:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}

export async function verifyOtp(userId: string, otp: string) {
  // Implement your verify OTP logic
  return { success: true }; // Mock response
}
