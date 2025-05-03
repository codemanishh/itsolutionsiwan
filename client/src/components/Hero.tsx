import { Button } from "@/components/ui/button";
import HeroCarousel from "./HeroCarousel";

export default function Hero() {
  return (
    <section id="home" className="bg-gradient-to-r from-primary to-[hsl(var(--primary-light))] text-white py-12 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 z-10 relative">
        {/* Carousel Section */}
        <div className="mb-14 max-w-5xl mx-auto">
          <HeroCarousel />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">एक साल की पढ़ाई उपर बार की कमाई</h1>
            <p className="text-lg md:text-xl mb-6">करे अपने बच्चों की सपनों साकार, 6 महीने में बने आत्मनिर्भर कम्प्यूटर एक्सपर्ट</p>
            <div className="bg-white text-primary-dark inline-block px-4 py-2 rounded-lg font-medium">
              ADMISSION OPEN
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="#courses">
                <Button 
                  size="lg"
                  className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent-dark))] text-white"
                >
                  View Courses
                </Button>
              </a>
              <a href="#contact">
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-neutral-light text-primary"
                >
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Students learning computer skills" 
              className="rounded-lg shadow-lg max-w-full floating-image"
            />
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 opacity-10">
        <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
          <defs>
            <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
            </pattern>
          </defs>
          <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"></rect>
        </svg>
      </div>
    </section>
  );
}
