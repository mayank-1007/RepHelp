"use server"
import { Query, ID } from "node-appwrite"
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
import {InputFile} from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
    try{
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name)
        console.log(newUser);
        return parseStringify(newUser);
    }
    catch(error:any){
        if(error && error?.code ===409){
            const documents = await users.list([
                Query.equal('email',[user.email])
            ])
            return documents?.users[0]
        }
        console.error("An error occurred while creating a new user:", error);
        // throw error
    }
};

export const getUser = async (userId : string) => {
    try{        
        const user = await users.get(userId);
        return parseStringify(user);
    }
    catch(error:any){
        console.error("An error occurred while registering user:", error);
        // throw error
    }
}

export const registerCustomer = async ({customer_image, identificationDocument, ...customer}:RegisterUserParams) =>{
    try{
        let file;
        if(customer_image && identificationDocument){
            const inputFile1 = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )
            const inputFile2 =  InputFile.fromBuffer(
                customer_image?.get('blobFile') as Blob,
                customer_image?.get('fileName') as string,
            )
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile1)
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
              }
        );
        return parseStringify(newCustomer);
    } catch(error){
        console.log("An error occurred while creating a new patient:", error);
    }
}

export const getCustomer = async (userId: string) => {
    try {
      const customers = await databases.listDocuments(
        DATABASE_ID!,
        CUSTOMER_COLLECTION_ID!,
        [Query.equal("userId", [userId])]
      );
  
      return parseStringify(customers.documents[0]);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the patient details:",
        error
      );
    }
  };

