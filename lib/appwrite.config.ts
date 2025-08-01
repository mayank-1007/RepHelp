import * as sdk from 'node-appwrite';
export const {
    PROJECT_ID,API_KEY,DATABASE_ID,CUSTOMER_COLLECTION_ID, CUSTOMERDETAIL_COLLECTION_ID,ROOMS_COLLECTION_ID,BOOKING_COLLECTION_ID,NEXT_PUBLIC_ADMIN_PASSKEY,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client();

client.
    setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);