import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { getCertificateByNumber, addCertificate, saveContactMessage } from "./storage";
import { contactMessagesInsertSchema, certificatesInsertSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "@db";
import { setupAuth } from "./auth";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  await setupAuth(app);
  // API routes for certificates
  app.get('/api/certificates/:certificateNumber', async (req, res) => {
    try {
      const certificateNumber = req.params.certificateNumber;
      const certificate = await getCertificateByNumber(certificateNumber);
      
      if (!certificate) {
        return res.status(404).json({ message: 'Certificate not found' });
      }
      
      return res.status(200).json(certificate);
    } catch (error) {
      console.error('Error fetching certificate:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/api/certificates', async (req, res) => {
    try {
      const validatedData = certificatesInsertSchema.parse(req.body);
      const newCertificate = await addCertificate(validatedData);
      return res.status(201).json(newCertificate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating certificate:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // API routes for contact messages
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = contactMessagesInsertSchema.parse(req.body);
      const newMessage = await saveContactMessage(validatedData);
      return res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error saving contact message:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // API route to get all contact messages (protected)
  app.get('/api/admin/messages', isAuthenticated, async (req, res) => {
    try {
      const result = await db.execute(
        `SELECT id, name, phone, email, course, message, created_at as "createdAt" 
         FROM contact_messages 
         ORDER BY created_at DESC`
      );
      
      // Extract rows from the result
      const messages = result.rows || [];
      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
