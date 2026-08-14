"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slideImages = [
  "/images/screenshot 1.png",
  "/images/screenshot 2.png",
  "/images/screenshot 3.png",
];

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fitur Otomatis
  useEffect(() => {
    if (isHovered) return; // Berhenti otomatis kalau mouse di atas gambar

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideImages.length);
    }, 4000); // Ganti tiap 4 detik

    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slideImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);

  return (
    <div 
      className="relative w-full aspect-square md:aspect-video lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100 flex items-center justify-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={slideImages[currentIndex]}
        alt={`Preview slide ${currentIndex + 1}`}
        fill
        priority
        className="object-cover transition-all duration-700"
      />

      {/* Panah Kiri - Dibuat lebih tebal dan kontras */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-4 rounded-full shadow-lg transition-all z-20"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* Panah Kanan - Dibuat lebih tebal dan kontras */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-4 rounded-full shadow-lg transition-all z-20"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Indikator Titik */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {slideImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full shadow-md transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-indigo-500"
                : "bg-white/80 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;