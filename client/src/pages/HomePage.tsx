import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import JobOpportunities from "@/components/JobOpportunities";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <JobOpportunities />
        
        {/* Course Preview Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-neutral-darkest mb-4">Our Courses</h2>
            <p className="text-neutral-dark max-w-2xl mx-auto mb-8">
              We offer a variety of computer and typing courses designed to help you build valuable skills and advance your career.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-neutral-lightest rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-light p-6">
                <h3 className="text-xl font-bold text-neutral-darkest mb-3">Computer Courses</h3>
                <p className="text-neutral-dark mb-6">
                  Learn essential computer skills with our comprehensive courses including DCA, ADCA, BCA, Tally with GST, and Desktop Publishing.
                </p>
                <Link href="/courses">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                    View Computer Courses
                  </Button>
                </Link>
              </div>
              
              <div className="bg-neutral-lightest rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-light p-6">
                <h3 className="text-xl font-bold text-neutral-darkest mb-3">Typing Courses</h3>
                <p className="text-neutral-dark mb-6">
                  Master typing in multiple languages with our specialized typing courses - English Typing, Hindi Typing, and Stenography.
                </p>
                <Link href="/courses">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                    View Typing Courses
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-12">
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary-light">
                  Contact Us to Enroll
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Verification Preview */}
        <section className="py-12 bg-neutral-lightest">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-neutral-darkest mb-4">Certificate Verification</h2>
            <p className="text-neutral-dark max-w-2xl mx-auto mb-6">
              Verify the authenticity of certificates issued by IT Solution Computer Center. Enter your certificate number to get started.
            </p>
            <Link href="/verify">
              <Button size="lg" className="bg-accent hover:bg-accent-dark text-white">
                Verify Certificate
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who have built successful careers with training from IT Solution Computer Center.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/courses">
                <Button size="lg" className="bg-white text-primary hover:bg-neutral-light">
                  Explore Courses
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}