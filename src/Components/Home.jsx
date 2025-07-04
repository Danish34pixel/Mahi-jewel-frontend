import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Star,
  ShoppingBag,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Nav from "./Nav";

// Nav component removed as requested

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const heroSlides = [
    {
      title: "Exquisite Diamond Collection",
      subtitle: "Crafted with precision, designed for eternity",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Explore Collection",
    },
    {
      title: "Timeless Gold Elegance",
      subtitle: "Where luxury meets artistry",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Shop Now",
    },
    {
      title: "Signature Bridal Sets",
      subtitle: "Your perfect moment deserves perfection",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "View Bridal",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Aurora Diamond Ring",
      price: "$2,999",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 5,
    },
    {
      id: 2,
      name: "Celestial Gold Necklace",
      price: "$1,599",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 5,
    },
    {
      id: 3,
      name: "Eternal Pearl Earrings",
      price: "$899",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 5,
    },
    {
      id: 4,
      name: "Radiant Tennis Bracelet",
      price: "$3,299",
      image:
        "https://images.unsplash.com/photo-1588444650700-6d3fb2a2c969?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 5,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50">
      <Nav />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-4xl">
            <div className="mb-6">
              <Sparkles className="h-8 w-8 mx-auto mb-4 text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
              {heroSlides[currentSlide].subtitle}
            </p>
            <button className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-400 group">
              {heroSlides[currentSlide].cta}
              <ArrowRight className="inline ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-amber-400 w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 text-white animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-20 px-4 max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.featured
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-amber-600 bg-clip-text text-transparent">
            Featured Collections
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most coveted pieces, each crafted with meticulous
            attention to detail
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group cursor-pointer transition-all duration-700 ${
                isVisible.featured
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-yellow-50 p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Heart className="h-5 w-5 text-gray-700 hover:text-red-500 transition-colors" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="flex justify-center mb-2">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-amber-400 fill-current"
                    />
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-amber-600">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Promise */}
      <section
        id="promise"
        className="py-20 bg-gradient-to-r from-amber-50 to-yellow-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible.promise
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-amber-600 bg-clip-text text-transparent">
                Our Promise of Excellence
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Every piece in our collection represents decades of
                craftsmanship, ethically sourced materials, and a commitment to
                creating jewelry that tells your unique story.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Ethically Sourced",
                    desc: "100% conflict-free diamonds",
                  },
                  {
                    title: "Lifetime Warranty",
                    desc: "Comprehensive protection",
                  },
                  {
                    title: "Expert Craftsmanship",
                    desc: "Master jewelers since 1920",
                  },
                  {
                    title: "Custom Design",
                    desc: "Bespoke pieces made for you",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`transition-all duration-1000 ${
                isVisible.promise
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-2xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Luxury jewelry craftsmanship"
                  className="relative w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible.newsletter
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Stay in the Loop
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Be the first to know about new collections, exclusive offers, and
              jewelry care tips
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-l-full sm:rounded-r-none rounded-r-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white px-8 py-4 rounded-r-full sm:rounded-l-none rounded-l-full font-semibold hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 mt-4 sm:mt-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
};

export default Home;
