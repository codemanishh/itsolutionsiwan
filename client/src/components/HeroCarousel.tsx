import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import all carousel images
import carousel1 from "../assets/uploads/11.jpeg";
import carousel2 from "../assets/uploads/22.jpeg";
import carousel3 from "../assets/uploads/33.jpeg";
import carousel4 from "../assets/uploads/44.jpeg";
import carousel5 from "../assets/uploads/55.jpeg";

const carouselImages = [
  { src: carousel1, alt: "Computer Training Institute" },
  { src: carousel2, alt: "IT Solutions Computer Center" },
  { src: carousel3, alt: "Computer Training Programs" },
  { src: carousel4, alt: "Computer Courses Siwan" },
  { src: carousel5, alt: "IT Training Center" },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageSrc, setFullImageSrc] = useState("");

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showFullImage) {
        setCurrentIndex((currentIndex) => 
          currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1
        );
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [showFullImage]);

  const goToPrevious = () => {
    setCurrentIndex((currentIndex) => 
      currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex) => 
      currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const handleImageClick = (src: string) => {
    setFullImageSrc(src);
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
  };

  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-lg shadow-lg">
      {/* Carousel Images */}
      <div 
        className="h-full w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        <div className="absolute flex h-full w-[500%]">
          {carouselImages.map((image, index) => (
            <div 
              key={index} 
              className="h-full w-1/5 cursor-pointer relative group"
              onClick={() => handleImageClick(image.src)}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <span className="text-white bg-black/50 px-4 py-2 rounded-md text-sm md:text-base">Click to view full image</span>
              </div>
              <div className="flex justify-center items-center h-full px-4 py-2">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="max-h-[250px] max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Full-screen image view */}
      {showFullImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeFullImage}
        >
          <div className="relative max-w-screen-lg max-h-screen p-4">
            <img 
              src={fullImageSrc} 
              alt="Full view" 
              className="max-w-full max-h-[90vh] object-contain bg-white/5 p-1 rounded-md"
            />
            <button 
              className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-lg hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                closeFullImage();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-md">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}

      {/* Left/Right Controls */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}