import admin from "firebase-admin";
import * as service_account from "./service_account.json";

export function connectToDatabase() {
  try {
    if (admin.apps.length <= 0) {
      admin.initializeApp({
        credential: admin.credential.cert(service_account),
      });
    }
    const db = admin.firestore();
    return db;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Database connection error");
  }
}
