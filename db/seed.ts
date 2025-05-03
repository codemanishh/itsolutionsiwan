import { db } from "./index";
import { 
  certificates, 
  computerCourses, 
  computerLearningPoints,
  typingCourses,
  typingLearningPoints
} from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Seeding database...");

    // Direct insert of certificates (faster and more reliable approach)
    await db.insert(certificates).values([
      {
        certificateNumber: "ADCA-2023-1234",
        name: "Rahul Kumar",
        address: "Bihar, Siwan",
        aadharNumber: "XXXX-XXXX-1234",
        certificateName: "Advanced Diploma in Computer Applications",
        issueDate: new Date("2023-04-15"),
        percentageScore: 85,
      },
      {
        certificateNumber: "DCA-2023-5678",
        name: "Priya Sharma",
        address: "Bihar, Patna",
        aadharNumber: "XXXX-XXXX-5678",
        certificateName: "Diploma in Computer Applications",
        issueDate: new Date("2023-05-20"),
        percentageScore: 78,
      },
      {
        certificateNumber: "TALLY-2023-9012",
        name: "Amit Singh",
        address: "Bihar, Gaya",
        aadharNumber: "XXXX-XXXX-9012",
        certificateName: "Tally with GST",
        issueDate: new Date("2023-06-10"),
        percentageScore: 92,
      },
      {
        certificateNumber: "HINDI-2023-3456",
        name: "Neha Gupta",
        address: "Bihar, Siwan",
        aadharNumber: "XXXX-XXXX-3456",
        certificateName: "Hindi Typing Course",
        issueDate: new Date("2023-07-05"),
        percentageScore: 88,
      },
      {
        certificateNumber: "ENG-2023-7890",
        name: "Rajesh Verma",
        address: "Bihar, Muzaffarpur",
        aadharNumber: "XXXX-XXXX-7890",
        certificateName: "English Typing Course",
        issueDate: new Date("2023-08-15"),
        percentageScore: 75,
      }
    ]).onConflictDoNothing({ target: certificates.certificateNumber });
    
    console.log("Certificates seeded successfully!");

    // Seed Computer Courses
    console.log("Seeding computer courses...");
    
    // Define the computer course data for seeding
    const computerCoursesData = [
      {
        title: "DCA",
        fullName: "Diploma in Computer Applications",
        duration: "6 months",
        price: "₹6,000",
        description: "A comprehensive course covering basic computer skills including MS Office, Internet basics, and fundamental computer concepts.",
      },
      {
        title: "ADCA",
        fullName: "Advanced Diploma in Computer Applications",
        duration: "1 year",
        price: "₹12,000",
        description: "Advanced computer skills including programming, web development, and specialized software applications.",
      },
      {
        title: "BCA",
        fullName: "Bachelor of Computer Applications",
        duration: "3 years",
        price: "₹30,000/year",
        description: "A comprehensive degree program covering all aspects of computer science and applications.",
      },
      {
        title: "Tally",
        fullName: "Tally with GST",
        duration: "3 months",
        price: "₹4,500",
        description: "Learn complete accounting and taxation management with the latest version of Tally.",
      },
      {
        title: "DTP",
        fullName: "Desktop Publishing",
        duration: "3 months",
        price: "₹4,000",
        description: "Master the skills of digital publishing and graphic design for print and digital media.",
      }
    ];

    // Insert computer courses one by one to capture the IDs for learning points
    for (const courseData of computerCoursesData) {
      const existingCourse = await db.query.computerCourses.findFirst({
        where: eq(computerCourses.title, courseData.title)
      });

      if (!existingCourse) {
        // Insert the course and get its ID
        const [course] = await db.insert(computerCourses)
          .values(courseData)
          .returning({ id: computerCourses.id });

        // Insert the learning points for this course
        if (course) {
          const learningPointsData = [];
          switch (courseData.title) {
            case "DCA":
              learningPointsData.push(
                { courseId: course.id, point: "Microsoft Office Suite (Word, Excel, PowerPoint)", sortOrder: 1 },
                { courseId: course.id, point: "Basic web design and internet skills", sortOrder: 2 },
                { courseId: course.id, point: "Computer fundamentals and operating systems", sortOrder: 3 }
              );
              break;
            case "ADCA":
              learningPointsData.push(
                { courseId: course.id, point: "Computer Fundamental, Operating System", sortOrder: 1 },
                { courseId: course.id, point: "MS-Office (Word, Excel, PowerPoint, Access)", sortOrder: 2 },
                { courseId: course.id, point: "Photoshop, CorelDraw, Tally with GST", sortOrder: 3 },
                { courseId: course.id, point: "Email, Internet, AI (Artificial Intelligence)", sortOrder: 4 }
              );
              break;
            case "BCA":
              learningPointsData.push(
                { courseId: course.id, point: "Programming languages (C, C++, Java)", sortOrder: 1 },
                { courseId: course.id, point: "Database management and system design", sortOrder: 2 },
                { courseId: course.id, point: "Software development and project management", sortOrder: 3 }
              );
              break;
            case "Tally":
              learningPointsData.push(
                { courseId: course.id, point: "Basic and advanced accounting concepts", sortOrder: 1 },
                { courseId: course.id, point: "GST billing and compliance", sortOrder: 2 },
                { courseId: course.id, point: "Financial statements and reports", sortOrder: 3 },
                { courseId: course.id, point: "Inventory management", sortOrder: 4 }
              );
              break;
            case "DTP":
              learningPointsData.push(
                { courseId: course.id, point: "Adobe InDesign and PageMaker", sortOrder: 1 },
                { courseId: course.id, point: "CorelDRAW and Photoshop", sortOrder: 2 },
                { courseId: course.id, point: "Layout design and typography", sortOrder: 3 },
                { courseId: course.id, point: "Print production techniques", sortOrder: 4 }
              );
              break;
          }
          
          if (learningPointsData.length > 0) {
            await db.insert(computerLearningPoints).values(learningPointsData);
          }
        }
      }
    }
    
    console.log("Computer courses seeded successfully!");

    // Seed Typing Courses
    console.log("Seeding typing courses...");
    
    // Define the typing course data for seeding
    const typingCoursesData = [
      {
        title: "English Typing",
        duration: "3 months",
        price: "₹3,500",
        description: "Master English typing with speed and accuracy. Perfect for office jobs and government positions.",
      },
      {
        title: "Hindi Typing",
        duration: "3 months",
        price: "₹3,500",
        description: "Learn Hindi typing using both Krutidev and Unicode methods for government jobs and office work.",
      },
      {
        title: "Stenography",
        duration: "6 months",
        price: "₹5,000",
        description: "Learn shorthand writing and transcription for secretarial and court reporting positions.",
      }
    ];

    // Insert typing courses one by one to capture the IDs for learning points
    for (const courseData of typingCoursesData) {
      const existingCourse = await db.query.typingCourses.findFirst({
        where: eq(typingCourses.title, courseData.title)
      });

      if (!existingCourse) {
        // Insert the course and get its ID
        const [course] = await db.insert(typingCourses)
          .values(courseData)
          .returning({ id: typingCourses.id });

        // Insert the learning points for this course
        if (course) {
          const learningPointsData = [];
          switch (courseData.title) {
            case "English Typing":
              learningPointsData.push(
                { courseId: course.id, point: "Touch typing techniques", sortOrder: 1 },
                { courseId: course.id, point: "Speed building exercises", sortOrder: 2 },
                { courseId: course.id, point: "Accuracy improvement drills", sortOrder: 3 }
              );
              break;
            case "Hindi Typing":
              learningPointsData.push(
                { courseId: course.id, point: "Krutidev and Devlys keyboard layouts", sortOrder: 1 },
                { courseId: course.id, point: "Unicode Hindi typing", sortOrder: 2 },
                { courseId: course.id, point: "Preparation for government typing tests", sortOrder: 3 }
              );
              break;
            case "Stenography":
              learningPointsData.push(
                { courseId: course.id, point: "Pitman shorthand basics", sortOrder: 1 },
                { courseId: course.id, point: "Dictation and transcription practice", sortOrder: 2 },
                { courseId: course.id, point: "Speed building for professional requirements", sortOrder: 3 }
              );
              break;
          }
          
          if (learningPointsData.length > 0) {
            await db.insert(typingLearningPoints).values(learningPointsData);
          }
        }
      }
    }
    
    console.log("Typing courses seeded successfully!");
    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
