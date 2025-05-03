import fs from 'fs/promises';
import path from 'path';
import { db } from "@db";
import { certificates, contactMessages } from "@shared/schema";
import { eq } from "drizzle-orm";

// Function to get a certificate by certificate number
export const getCertificateByNumber = async (certificateNumber: string) => {
  try {
    const certificate = await db.query.certificates.findFirst({
      where: eq(certificates.certificateNumber, certificateNumber)
    });
    return certificate;
  } catch (error) {
    console.error("Error fetching certificate:", error);
    throw error;
  }
};

// Function to add a new certificate
export const addCertificate = async (certificateData: any) => {
  try {
    const [newCertificate] = await db.insert(certificates).values(certificateData).returning();
    return newCertificate;
  } catch (error) {
    console.error("Error adding certificate:", error);
    throw error;
  }
};

// Function to save contact message
export const saveContactMessage = async (messageData: any) => {
  try {
    const [newMessage] = await db.insert(contactMessages).values(messageData).returning();
    return newMessage;
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw error;
  }
};
