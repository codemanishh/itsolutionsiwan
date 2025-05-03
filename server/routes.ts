import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { getCertificateByNumber, addCertificate, saveContactMessage } from "./storage";
import { contactMessagesInsertSchema, certificatesInsertSchema } from "@shared/schema";
import { z } from "zod";
import { db } from "@db";
import { sql } from "drizzle-orm";
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
  
  // Get all certificates (protected route)
  app.get('/api/certificates', isAuthenticated, async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM certificates ORDER BY issue_date DESC
      `);
      
      // Extract rows from the result
      const certificates = result.rows || [];
      return res.status(200).json(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/api/certificates', isAuthenticated, async (req, res) => {
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
  
  // Update a certificate (protected)
  app.put('/api/certificates/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      const validatedData = certificatesInsertSchema.partial().parse(req.body);
      
      // Perform the update
      await db.execute(sql`
        UPDATE certificates SET 
        certificate_number = COALESCE(${validatedData.certificateNumber}, certificate_number),
        name = COALESCE(${validatedData.name}, name),
        address = COALESCE(${validatedData.address}, address),
        aadhar_number = COALESCE(${validatedData.aadharNumber}, aadhar_number),
        certificate_name = COALESCE(${validatedData.certificateName}, certificate_name),
        issue_date = COALESCE(${validatedData.issueDate}::date, issue_date),
        percentage_score = COALESCE(${validatedData.percentageScore}::integer, percentage_score)
        WHERE id = ${id}
      `);
      
      // Get the updated certificate
      const result = await db.execute(sql`SELECT * FROM certificates WHERE id = ${id}`);
      const updatedCertificate = result.rows?.[0];
      
      if (!updatedCertificate) {
        return res.status(404).json({ message: 'Certificate not found after update' });
      }
      
      return res.status(200).json(updatedCertificate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error updating certificate:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Delete a certificate (protected)
  app.delete('/api/certificates/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      // Check if certificate exists
      const checkResult = await db.execute(sql`SELECT id FROM certificates WHERE id = ${id}`);
      if (!checkResult.rows?.length) {
        return res.status(404).json({ message: 'Certificate not found' });
      }
      
      // Delete the certificate
      await db.execute(sql`DELETE FROM certificates WHERE id = ${id}`);
      
      return res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
      console.error('Error deleting certificate:', error);
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
      const result = await db.execute(sql`
        SELECT id, name, phone, email, course, message, created_at as "createdAt" 
        FROM contact_messages 
        ORDER BY created_at DESC
      `);
      
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
