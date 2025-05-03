import { db } from "./index";
import { certificates } from "@shared/schema";
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
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
