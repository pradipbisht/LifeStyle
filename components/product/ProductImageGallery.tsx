import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types/shop";

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({
  product,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group shadow-lg">
        <Image
          src={product.images[selectedImage] || "/placeholder.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 600px) 100vw, 40vw"
          className="object-cover transition-transform group-hover:scale-105"
        />

        {/* Navigation Arrows */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {product.images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {product.images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === index
                  ? "border-amber-500 scale-95 shadow-lg"
                  : "border-slate-200 hover:border-amber-300 hover:scale-95"
              }`}>
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
