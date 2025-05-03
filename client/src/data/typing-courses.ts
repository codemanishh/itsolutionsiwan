export interface TypingCourse {
  id: string;
  title: string;
  duration: string;
  description: string;
  learningPoints: string[];
}

const typingCourses: TypingCourse[] = [
  {
    id: "english-typing",
    title: "English Typing",
    duration: "3 months",
    description: "Master English typing with speed and accuracy. Perfect for office jobs and government positions.",
    learningPoints: [
      "Touch typing techniques",
      "Speed building exercises",
      "Accuracy improvement drills"
    ]
  },
  {
    id: "hindi-typing",
    title: "Hindi Typing",
    duration: "3 months",
    description: "Learn Hindi typing using both Krutidev and Unicode methods for government jobs and office work.",
    learningPoints: [
      "Krutidev and Devlys keyboard layouts",
      "Unicode Hindi typing",
      "Preparation for government typing tests"
    ]
  },
  {
    id: "stenography",
    title: "Stenography",
    duration: "6 months",
    description: "Learn shorthand writing and transcription for secretarial and court reporting positions.",
    learningPoints: [
      "Pitman shorthand basics",
      "Dictation and transcription practice",
      "Speed building for professional requirements"
    ]
  }
];

export default typingCourses;
