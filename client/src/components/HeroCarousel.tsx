import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import all carousel images
import carousel1 from "../assets/images/carousel-1.svg";
import carousel2 from "../assets/images/carousel-2.svg";
import carousel3 from "../assets/images/carousel-3.svg";
import carousel4 from "../assets/images/carousel-4.svg";
import carousel5 from "../assets/images/carousel-5.svg";

const carouselImages = [
  { src: carousel1, alt: "Computer Training" },
  { src: carousel2, alt: "DCA ADCA Training" },
  { src: carousel3, alt: "Computer Training Special Offer" },
  { src: carousel4, alt: "Job Opportunities After ADCA" },
  { src: carousel5, alt: "IT Solution Contact Information" },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((currentIndex) => 
        currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-md">
      {/* Carousel Images */}
      <div 
        className="h-full w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        <div className="absolute flex h-full w-[500%]">
          {carouselImages.map((image, index) => (
            <div key={index} className="h-full w-1/5">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

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