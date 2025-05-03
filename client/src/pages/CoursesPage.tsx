import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComputerCourses from "@/components/ComputerCourses";
import TypingCourses from "@/components/TypingCourses";

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 bg-primary text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">Our Courses</h1>
            <p className="mt-2 text-lg">Explore our computer and typing courses designed to build your skills</p>
          </div>
        </div>
        
        <ComputerCourses />
        <TypingCourses />
      </main>
      <Footer />
    </div>
  );
}