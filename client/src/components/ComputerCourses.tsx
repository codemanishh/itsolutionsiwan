import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { ComputerCourse, ComputerLearningPoint } from "@shared/schema";

interface CourseWithLearningPoints extends ComputerCourse {
  learningPoints: ComputerLearningPoint[];
}

export default function ComputerCourses() {
  // Fetch computer courses from the API
  const { data: courses, isLoading, error } = useQuery<CourseWithLearningPoints[]>({
    queryKey: ['/api/computer-courses'],
    queryFn: async () => {
      const response = await fetch('/api/computer-courses');
      if (!response.ok) {
        throw new Error('Failed to fetch computer courses');
      }
      return response.json();
    }
  });

  return (
    <section id="computer-courses" className="py-6">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-darkest mb-2">Computer Courses</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">Our comprehensive computer courses are designed to build your skills from basic to advanced level</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Failed to load courses. Please try again later.</p>
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-neutral-lightest rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-light">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-neutral-darkest">{course.title}</h3>
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">{course.duration}</span>
                  </div>
                  <h4 className="text-lg text-neutral-dark mb-4">{course.fullName}</h4>
                  <div className="mb-4 bg-accent/10 px-3 py-2 rounded-md">
                    <span className="text-lg font-semibold text-accent-dark">{course.price}</span>
                  </div>
                  <p className="text-neutral-dark mb-4">{course.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">What you'll learn:</h5>
                    <ul className="list-disc pl-5 text-neutral-dark space-y-1">
                      {course.learningPoints && course.learningPoints.map((pointObj) => (
                        <li key={pointObj.id}>{pointObj.point}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href="/contact">
                    <Button 
                      className="w-full bg-primary hover:bg-primary-dark text-white"
                    >
                      Enroll Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No computer courses available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
