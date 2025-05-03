import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 bg-primary text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
            <p className="mt-2 text-lg">Learn more about IT Solution Computer Center and our mission</p>
          </div>
        </div>
        
        <div className="py-12">
          <div className="container mx-auto px-4">
            <AboutSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}