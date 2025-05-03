import { MapPin, Phone, Clock, Facebook, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-darkest text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">IT SOLUTION</h3>
            <p className="text-gray-300 mb-4">Providing quality computer education for over 18 years. Government recognized institute offering comprehensive courses.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="#courses" className="text-gray-300 hover:text-white">Courses</a></li>
              <li><a href="#verify" className="text-gray-300 hover:text-white">Certificate Verification</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Courses</h4>
            <ul className="space-y-2">
              <li><a href="#computer-courses" className="text-gray-300 hover:text-white">DCA</a></li>
              <li><a href="#computer-courses" className="text-gray-300 hover:text-white">ADCA</a></li>
              <li><a href="#computer-courses" className="text-gray-300 hover:text-white">BCA</a></li>
              <li><a href="#typing-courses" className="text-gray-300 hover:text-white">English Typing</a></li>
              <li><a href="#typing-courses" className="text-gray-300 hover:text-white">Hindi Typing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
                <span>आर्य समाज कम्प्यूटर डिग्री कॉलेज मोड़, सीवान</span>
              </li>
              <li className="flex items-start">
                <Phone className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
                <span>7295956246, 9279501441</span>
              </li>
              <li className="flex items-start">
                <Clock className="text-primary mr-2 h-5 w-5 flex-shrink-0" />
                <span>Office Hours: 8 AM To 4 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} IT SOLUTION Computer Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
