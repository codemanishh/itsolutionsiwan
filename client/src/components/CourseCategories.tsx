import { ArrowRight } from "lucide-react";

const courseCategories = [
  {
    title: "Computer Courses",
    description: "Learn essential computer skills from basic to advanced level with our comprehensive computer courses.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["DCA", "ADCA", "BCA", "Tally with GST"],
    link: "#computer-courses"
  },
  {
    title: "Typing Courses",
    description: "Master typing skills in English and Hindi to improve your employability for various office jobs.",
    image: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["English Typing", "Hindi Typing", "Stenography"],
    link: "#typing-courses"
  }
];

export default function CourseCategories() {
  return (
    <section id="courses" className="py-12 bg-neutral-lightest">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-darkest mb-2">Our Courses</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">Comprehensive courses designed to help you build a successful career in IT</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {courseCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-neutral-darkest mb-2">{category.title}</h3>
                <p className="text-neutral-dark mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                  {category.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="bg-primary-light/10 text-primary-dark text-sm px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <a href={category.link} className="text-primary font-medium hover:text-primary-light flex items-center">
                  View Courses <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
