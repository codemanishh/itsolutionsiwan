import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CourseCategories from "@/components/CourseCategories";
import ComputerCourses from "@/components/ComputerCourses";
import TypingCourses from "@/components/TypingCourses";
import JobOpportunities from "@/components/JobOpportunities";
import CertificateVerification from "@/components/CertificateVerification";
import ContactSection from "@/components/ContactSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CourseCategories />
        <ComputerCourses />
        <TypingCourses />
        <JobOpportunities />
        <CertificateVerification />
        <ContactSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
