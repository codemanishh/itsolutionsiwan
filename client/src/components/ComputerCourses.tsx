import { Button } from "@/components/ui/button";
import courses from "@/data/courses";

export default function ComputerCourses() {
  return (
    <section id="computer-courses" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-darkest mb-2">Computer Courses</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">Our comprehensive computer courses are designed to build your skills from basic to advanced level</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-neutral-lightest rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-light">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-neutral-darkest">{course.title}</h3>
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded">{course.duration}</span>
                </div>
                <h4 className="text-lg text-neutral-dark mb-4">{course.fullName}</h4>
                <p className="text-neutral-dark mb-4">{course.description}</p>
                
                <div className="mb-4">
                  <h5 className="font-medium mb-2">What you'll learn:</h5>
                  <ul className="list-disc pl-5 text-neutral-dark space-y-1">
                    {course.learningPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
                
                <a href="#contact">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark text-white"
                  >
                    Enroll Now
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
