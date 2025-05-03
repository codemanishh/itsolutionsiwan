import { School, Computer, Briefcase } from "lucide-react";

const features = [
  {
    icon: <School className="text-white" />,
    title: "Certified Courses",
    description: "Government recognized certification to help you secure job opportunities in various sectors."
  },
  {
    icon: <Computer className="text-white" />,
    title: "Modern Labs",
    description: "Well-equipped computer labs with latest software and hardware for practical training."
  },
  {
    icon: <Briefcase className="text-white" />,
    title: "Job Opportunities",
    description: "Our courses prepare you for roles like Computer Operator, Data Entry Operator, Graphic Designer and more."
  }
];

export default function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-darkest mb-2">Why Choose Us?</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">18 सालों से संचालित सरस्वान - भरत सरकार द्वारा मान्यता प्राप्त</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-neutral-lightest p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-neutral-dark">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
