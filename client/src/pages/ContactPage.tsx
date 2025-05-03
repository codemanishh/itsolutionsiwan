import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 bg-primary text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
            <p className="mt-2 text-lg">Get in touch with IT Solution Computer Center</p>
          </div>
        </div>
        
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <ContactSection />
              </div>
              
              <div>
                <div className="bg-neutral-lightest p-6 rounded-lg shadow-sm border border-neutral-light mb-6">
                  <h3 className="text-xl font-bold text-neutral-darkest mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="text-primary mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Address:</p>
                        <p>आर्य समाज कम्प्यूटर डिग्री कॉलेज मोड़, सीवान</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="text-primary mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Phone:</p>
                        <p>7295956246, 9279501441</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="text-primary mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email:</p>
                        <p>info@itsolutionsiwan.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="text-primary mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Office Hours:</p>
                        <p>8 AM To 4 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Google Maps */}
                <div className="bg-neutral-lightest p-6 rounded-lg shadow-sm border border-neutral-light">
                  <h3 className="text-xl font-bold text-neutral-darkest mb-4">Our Location</h3>
                  <div className="rounded-lg overflow-hidden h-[350px]">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14363.277421536906!2d84.3590157!3d26.2129792!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3992e5ef3bd8c51b%3A0x8e7e60be0bf0d8d5!2sIT%20Solution!5e0!3m2!1sen!2sin!4v1714671232091!5m2!1sen!2sin" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
                  <div className="mt-3">
                    <a 
                      href="https://maps.app.goo.gl/34Z8nwhMZkU52VAw7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}