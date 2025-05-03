export interface Course {
  id: string;
  title: string;
  fullName: string;
  duration: string;
  price: string;
  description: string;
  learningPoints: string[];
}

const courses: Course[] = [
  {
    id: "dca",
    title: "DCA",
    fullName: "Diploma in Computer Applications",
    duration: "6 months",
    price: "₹6,000",
    description: "A comprehensive course covering basic computer skills including MS Office, Internet basics, and fundamental computer concepts.",
    learningPoints: [
      "Microsoft Office Suite (Word, Excel, PowerPoint)",
      "Basic web design and internet skills",
      "Computer fundamentals and operating systems"
    ]
  },
  {
    id: "adca",
    title: "ADCA",
    fullName: "Advanced Diploma in Computer Applications",
    duration: "1 year",
    price: "₹12,000",
    description: "Advanced computer skills including programming, web development, and specialized software applications.",
    learningPoints: [
      "Computer Fundamental, Operating System",
      "MS-Office (Word, Excel, PowerPoint, Access)",
      "Photoshop, CorelDraw, Tally with GST",
      "Email, Internet, AI (Artificial Intelligence)"
    ]
  },
  {
    id: "bca",
    title: "BCA",
    fullName: "Bachelor of Computer Applications",
    duration: "3 years",
    price: "₹30,000/year",
    description: "A comprehensive degree program covering all aspects of computer science and applications.",
    learningPoints: [
      "Programming languages (C, C++, Java)",
      "Database management and system design",
      "Software development and project management"
    ]
  },
  {
    id: "tally",
    title: "Tally",
    fullName: "Tally with GST",
    duration: "3 months",
    price: "₹4,500",
    description: "Learn complete accounting and taxation management with the latest version of Tally.",
    learningPoints: [
      "Basic and advanced accounting concepts",
      "GST billing and compliance",
      "Financial statements and reports",
      "Inventory management"
    ]
  },
  {
    id: "dtp",
    title: "DTP",
    fullName: "Desktop Publishing",
    duration: "3 months",
    price: "₹4,000",
    description: "Master the skills of digital publishing and graphic design for print and digital media.",
    learningPoints: [
      "Adobe InDesign and PageMaker",
      "CorelDRAW and Photoshop",
      "Layout design and typography",
      "Print production techniques"
    ]
  }
];

export default courses;
