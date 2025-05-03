import { CheckCircle } from "lucide-react";
import jobOpportunities from "@/data/job-opportunities";

export default function JobOpportunities() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-darkest mb-2">Career Opportunities</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">Our courses prepare you for various job opportunities in government and private sectors</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobOpportunities.map((category, index) => (
            <div key={index} className="bg-neutral-lightest p-6 rounded-lg">
              <h3 className="text-xl font-bold text-neutral-darkest mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.opportunities.map((job, jobIndex) => (
                  <li key={jobIndex} className="flex items-start">
                    <CheckCircle className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
                    <span>{job}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
