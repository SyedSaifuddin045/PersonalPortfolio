import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectCarouselProps {
  images?: string[];
  videos?: string[];
  title: string;
  imageFolder: string;
}

export default function ProjectCarousel({ images = [], videos = [], title, imageFolder }: ProjectCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const imageUrls = images.map(img => `/project_assets/${imageFolder}/${img}`);
  const allMedia = [...imageUrls, ...videos];
  
  const totalSlides = allMedia.length;

  // Reset current slide when media changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [imageFolder]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-play functionality
  useEffect(() => {
    if (totalSlides > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [totalSlides]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (totalSlides === 0) return null;

  return (
    <div 
      className="relative group"
      data-testid="project-carousel"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="overflow-hidden rounded-t-2xl">
        <div 
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {allMedia.length === 0 ? (
            <div className="w-full h-48 bg-portfolio-bg-secondary flex items-center justify-center text-portfolio-text-muted">
              No images available
            </div>
          ) : allMedia.map((media, index) => {
            const isVideo = videos.includes(media);
            return (
              <div key={index} className="w-full flex-none">
                {isVideo ? (
                  <video
                    src={media}
                    className="w-full h-48 object-cover"
                    controls
                    data-testid={`carousel-video-${index}`}
                  />
                ) : (
                  <img
                    key={media}
                    src={media}
                    alt={`${title} screenshot ${index + 1}`}
                    className="w-full h-48 object-cover"
                    data-testid={`carousel-image-${index}`}
                    onError={(e) => {
                      console.error(`Failed to load image: ${media}`);
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Controls */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-portfolio-bg-primary/70 hover:bg-portfolio-bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            data-testid="carousel-prev"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-portfolio-bg-primary/70 hover:bg-portfolio-bg-primary text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            data-testid="carousel-next"
          >
            <ChevronRight size={16} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                data-testid={`carousel-indicator-${index}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
