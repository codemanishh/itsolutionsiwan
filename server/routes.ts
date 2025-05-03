import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { getCertificateByNumber, addCertificate, saveContactMessage } from "./storage";
import { 
  contactMessagesInsertSchema, 
  certificatesInsertSchema,
  computerCoursesInsertSchema,
  computerLearningPointsInsertSchema,
  typingCoursesInsertSchema,
  typingLearningPointsInsertSchema,
  computerCourses,
  computerLearningPoints,
  typingCourses,
  typingLearningPoints
} from "@shared/schema";
import { z } from "zod";
import { db } from "@db";
import { sql, eq, desc, and } from "drizzle-orm";
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
      
      // Perform the update using SQL template literals for safe SQL execution
      const updates = [];
      
      // Only add fields that are defined in the validated data
      if (validatedData.certificateNumber !== undefined) {
        updates.push(sql`certificate_number = ${validatedData.certificateNumber}`);
      }
      
      if (validatedData.name !== undefined) {
        updates.push(sql`name = ${validatedData.name}`);
      }
      
      if (validatedData.address !== undefined) {
        updates.push(sql`address = ${validatedData.address}`);
      }
      
      if (validatedData.aadharNumber !== undefined) {
        updates.push(sql`aadhar_number = ${validatedData.aadharNumber}`);
      }
      
      if (validatedData.certificateName !== undefined) {
        updates.push(sql`certificate_name = ${validatedData.certificateName}`);
      }
      
      if (validatedData.issueDate !== undefined) {
        updates.push(sql`issue_date = ${validatedData.issueDate}`);
      }
      
      if (validatedData.percentageScore !== undefined) {
        updates.push(sql`percentage_score = ${validatedData.percentageScore}`);
      }
      
      // No fields to update
      if (updates.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }
      
      // Build a dynamic SQL query by combining all field updates
      let query = sql`UPDATE certificates SET `;
      
      // Add each field update with a separator between them
      for (let i = 0; i < updates.length; i++) {
        if (i > 0) {
          query = sql`${query}, ${updates[i]}`;
        } else {
          query = sql`${query}${updates[i]}`;
        }
      }
      
      // Add the WHERE clause
      query = sql`${query} WHERE id = ${id}`;
      
      // Execute the final query
      await db.execute(query);
      
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
        SELECT id, name, phone, email, course, message, status, created_at as "createdAt" 
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
  
  // API route to update message status (protected)
  app.put('/api/admin/messages/:id/status', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      const { status } = req.body;
      if (!status || (status !== 'open' && status !== 'closed')) {
        return res.status(400).json({ message: 'Invalid status value. Must be "open" or "closed"' });
      }
      
      // Check if message exists
      const checkResult = await db.execute(sql`SELECT id FROM contact_messages WHERE id = ${id}`);
      if (!checkResult.rows?.length) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      // Update the message status
      await db.execute(sql`UPDATE contact_messages SET status = ${status} WHERE id = ${id}`);
      
      // Get the updated message
      const result = await db.execute(sql`
        SELECT id, name, phone, email, course, message, status, created_at as "createdAt"
        FROM contact_messages WHERE id = ${id}
      `);
      
      return res.status(200).json(result.rows?.[0] || {});
    } catch (error) {
      console.error('Error updating message status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // API route to delete a message (protected)
  app.delete('/api/admin/messages/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      // Check if message exists
      const checkResult = await db.execute(sql`SELECT id FROM contact_messages WHERE id = ${id}`);
      if (!checkResult.rows?.length) {
        return res.status(404).json({ message: 'Message not found' });
      }
      
      // Delete the message
      await db.execute(sql`DELETE FROM contact_messages WHERE id = ${id}`);
      
      return res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // =============== COMPUTER COURSES API ROUTES =============== //

  // Get all computer courses with learning points
  app.get('/api/computer-courses', async (req, res) => {
    try {
      const courses = await db.query.computerCourses.findMany({
        orderBy: [desc(computerCourses.title)],
        with: {
          learningPoints: {
            orderBy: [computerLearningPoints.sortOrder],
          }
        }
      });
      
      // Transform learning points to clean up the data
      const transformedCourses = courses.map(course => ({
        ...course,
        learningPoints: course.learningPoints.map(point => ({
          id: point.id,
          point: point.point,
          sortOrder: point.sortOrder,
          courseId: point.courseId
        }))
      }));
      
      return res.status(200).json(transformedCourses);
    } catch (error) {
      console.error('Error fetching computer courses:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get a single computer course by ID
  app.get('/api/computer-courses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      const course = await db.query.computerCourses.findFirst({
        where: eq(computerCourses.id, id),
        with: {
          learningPoints: {
            orderBy: [computerLearningPoints.sortOrder],
          }
        }
      });
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Transform learning points to ensure clean data
      const transformedCourse = {
        ...course,
        learningPoints: course.learningPoints.map(point => ({
          id: point.id,
          point: point.point,
          sortOrder: point.sortOrder,
          courseId: point.courseId
        }))
      };
      
      return res.status(200).json(transformedCourse);
    } catch (error) {
      console.error('Error fetching computer course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Create a new computer course (protected)
  app.post('/api/computer-courses', isAuthenticated, async (req, res) => {
    try {
      const { title, fullName, duration, price, description, learningPoints } = req.body;
      
      // Validate course data
      const validatedCourseData = computerCoursesInsertSchema.parse({
        title,
        fullName, 
        duration,
        price,
        description
      });
      
      // Insert the course
      const [newCourse] = await db.insert(computerCourses)
        .values(validatedCourseData)
        .returning();
      
      // Insert learning points if provided
      if (Array.isArray(learningPoints) && learningPoints.length > 0) {
        const learningPointsData = learningPoints.map((point, index) => ({
          courseId: newCourse.id,
          point,
          sortOrder: index + 1
        }));
        
        await db.insert(computerLearningPoints).values(learningPointsData);
      }
      
      // Return the created course with learning points
      const createdCourse = await db.query.computerCourses.findFirst({
        where: eq(computerCourses.id, newCourse.id),
        with: {
          learningPoints: {
            orderBy: [computerLearningPoints.sortOrder]
          }
        }
      });
      
      // Transform learning points to ensure clean data
      const transformedCourse = createdCourse ? {
        ...createdCourse,
        learningPoints: createdCourse.learningPoints.map(point => ({
          id: point.id,
          point: point.point,
          sortOrder: point.sortOrder,
          courseId: point.courseId
        }))
      } : null;
      
      return res.status(201).json(transformedCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating computer course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update a computer course (protected)
  app.put('/api/computer-courses/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      const { title, fullName, duration, price, description, learningPoints } = req.body;
      
      // Validate course data
      const validatedCourseData = computerCoursesInsertSchema.partial().parse({
        title,
        fullName,
        duration,
        price,
        description
      });
      
      // Check if course exists
      const existingCourse = await db.query.computerCourses.findFirst({
        where: eq(computerCourses.id, id)
      });
      
      if (!existingCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Update the course
      const [updatedCourse] = await db.update(computerCourses)
        .set({
          ...validatedCourseData,
          updatedAt: new Date()
        })
        .where(eq(computerCourses.id, id))
        .returning();
      
      // Update learning points if provided
      if (Array.isArray(learningPoints)) {
        // Delete existing learning points
        await db.delete(computerLearningPoints)
          .where(eq(computerLearningPoints.courseId, id));
        
        // Insert new learning points
        if (learningPoints.length > 0) {
          const learningPointsData = learningPoints.map((point, index) => ({
            courseId: id,
            point,
            sortOrder: index + 1
          }));
          
          await db.insert(computerLearningPoints).values(learningPointsData);
        }
      }
      
      // Return the updated course with learning points
      const finalCourse = await db.query.computerCourses.findFirst({
        where: eq(computerCourses.id, id),
        with: {
          learningPoints: {
            orderBy: [computerLearningPoints.sortOrder]
          }
        }
      });
      
      // Transform learning points to ensure clean data
      const transformedCourse = finalCourse ? {
        ...finalCourse,
        learningPoints: finalCourse.learningPoints.map(point => ({
          id: point.id,
          point: point.point,
          sortOrder: point.sortOrder,
          courseId: point.courseId
        }))
      } : null;
      
      return res.status(200).json(transformedCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error updating computer course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Delete a computer course (protected)
  app.delete('/api/computer-courses/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      // Check if course exists
      const existingCourse = await db.query.computerCourses.findFirst({
        where: eq(computerCourses.id, id)
      });
      
      if (!existingCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Delete the course (learning points will be deleted automatically due to CASCADE)
      await db.delete(computerCourses).where(eq(computerCourses.id, id));
      
      return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting computer course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // =============== TYPING COURSES API ROUTES =============== //

  // Get all typing courses with learning points
  app.get('/api/typing-courses', async (req, res) => {
    try {
      const courses = await db.query.typingCourses.findMany({
        orderBy: [typingCourses.title],
        with: {
          learningPoints: {
            orderBy: [typingLearningPoints.sortOrder],
          }
        }
      });
      
      // Transform learning points to clean up the data
      const transformedCourses = courses.map(course => ({
        ...course,
        learningPoints: course.learningPoints.map(point => ({
          id: point.id,
          point: point.point,
          sortOrder: point.sortOrder,
          courseId: point.courseId
        }))
      }));
      
      return res.status(200).json(transformedCourses);
    } catch (error) {
      console.error('Error fetching typing courses:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get a single typing course by ID
  app.get('/api/typing-courses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      const course = await db.query.typingCourses.findFirst({
        where: eq(typingCourses.id, id),
        with: {
          learningPoints: {
            orderBy: [typingLearningPoints.sortOrder],
          }
        }
      });
      
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Transform learning points to ensure clean data
      const transformedCourse = {
        ...course,
        learningPoints: course.learningPoints.map(point => ({
          id: point.id,
          point: point.point,
          sortOrder: point.sortOrder,
          courseId: point.courseId
        }))
      };
      
      return res.status(200).json(transformedCourse);
    } catch (error) {
      console.error('Error fetching typing course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Create a new typing course (protected)
  app.post('/api/typing-courses', isAuthenticated, async (req, res) => {
    try {
      const { title, duration, price, description, learningPoints } = req.body;
      
      // Validate course data
      const validatedCourseData = typingCoursesInsertSchema.parse({
        title,
        duration,
        price,
        description
      });
      
      // Insert the course
      const [newCourse] = await db.insert(typingCourses)
        .values(validatedCourseData)
        .returning();
      
      // Insert learning points if provided
      if (Array.isArray(learningPoints) && learningPoints.length > 0) {
        const learningPointsData = learningPoints.map((point, index) => ({
          courseId: newCourse.id,
          point,
          sortOrder: index + 1
        }));
        
        await db.insert(typingLearningPoints).values(learningPointsData);
      }
      
      // Return the created course with learning points
      const createdCourse = await db.query.typingCourses.findFirst({
        where: eq(typingCourses.id, newCourse.id),
        with: {
          learningPoints: {
            orderBy: [typingLearningPoints.sortOrder]
          }
        }
      });
      
      // Transform learning points to ensure clean data
      const transformedCourse = createdCourse ? {
        ...createdCourse,
        learningPoints: createdCourse.learningPoints.map(point => ({
          id: point.id,
          point: point.point,
          sortOrder: point.sortOrder,
          courseId: point.courseId
        }))
      } : null;
      
      return res.status(201).json(transformedCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating typing course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update a typing course (protected)
  app.put('/api/typing-courses/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      const { title, duration, price, description, learningPoints } = req.body;
      
      // Validate course data
      const validatedCourseData = typingCoursesInsertSchema.partial().parse({
        title,
        duration,
        price,
        description
      });
      
      // Check if course exists
      const existingCourse = await db.query.typingCourses.findFirst({
        where: eq(typingCourses.id, id)
      });
      
      if (!existingCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Update the course
      const [updatedCourse] = await db.update(typingCourses)
        .set({
          ...validatedCourseData,
          updatedAt: new Date()
        })
        .where(eq(typingCourses.id, id))
        .returning();
      
      // Update learning points if provided
      if (Array.isArray(learningPoints)) {
        // Delete existing learning points
        await db.delete(typingLearningPoints)
          .where(eq(typingLearningPoints.courseId, id));
        
        // Insert new learning points
        if (learningPoints.length > 0) {
          const learningPointsData = learningPoints.map((point, index) => ({
            courseId: id,
            point,
            sortOrder: index + 1
          }));
          
          await db.insert(typingLearningPoints).values(learningPointsData);
        }
      }
      
      // Return the updated course with learning points
      const finalCourse = await db.query.typingCourses.findFirst({
        where: eq(typingCourses.id, id),
        with: {
          learningPoints: {
            orderBy: [typingLearningPoints.sortOrder]
          }
        }
      });
      
      // Transform learning points to ensure clean data
      const transformedCourse = finalCourse ? {
        ...finalCourse,
        learningPoints: finalCourse.learningPoints.map(point => ({
          id: point.id,
          point: point.point,
          sortOrder: point.sortOrder,
          courseId: point.courseId
        }))
      } : null;
      
      return res.status(200).json(transformedCourse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error updating typing course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Delete a typing course (protected)
  app.delete('/api/typing-courses/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      // Check if course exists
      const existingCourse = await db.query.typingCourses.findFirst({
        where: eq(typingCourses.id, id)
      });
      
      if (!existingCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Delete the course (learning points will be deleted automatically due to CASCADE)
      await db.delete(typingCourses).where(eq(typingCourses.id, id));
      
      return res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting typing course:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
