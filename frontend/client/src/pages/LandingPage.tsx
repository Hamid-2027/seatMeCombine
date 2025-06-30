import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Bus, Star, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  // Hero slider configuration
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  // Hero slider content
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1586804199428-88a456fc0c42?q=80&w=2070&auto=format&fit=crop",
      title: "Explore the Beauty of Pakistan",
      description: "Discover breathtaking landscapes, rich culture, and unforgettable experiences across Pakistan's most beautiful destinations."
    },
    {
      image: "https://images.unsplash.com/photo-1567606940710-fa241652be4a?q=80&w=1886&auto=format&fit=crop",
      title: "Book Your Adventure Today",
      description: "Secure your seats on premium buses to the most scenic locations throughout Pakistan."
    },
    {
      image: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=1894&auto=format&fit=crop",
      title: "Travel in Comfort and Style",
      description: "Experience the journey of a lifetime with our modern fleet and professional service."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">SeatMe</span>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#destinations" className="text-gray-700 hover:text-primary transition-colors">Destinations</a>
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary transition-colors">Testimonials</a>
              <Link href="/login" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Go to Dashboard
              </Link>
            </nav>
            <div className="md:hidden flex items-center">
              <button className="text-gray-700 hover:text-primary focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Slider Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full">
            {heroSlides.map((slide, index) => (
              <div key={index} className="embla__slide relative h-full w-full flex-[0_0_100%]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 transform scale-105" 
                  style={{ backgroundImage: `url('${slide.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">{slide.title}</h1>
                    <p className="text-lg md:text-xl mb-8 animate-fade-in animation-delay-200">{slide.description}</p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-300">
                      <a href="#destinations" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md transition-all transform hover:scale-105 text-center flex items-center justify-center">
                        Explore Destinations
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                      <Link href="/login" className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-6 rounded-md transition-all transform hover:scale-105 text-center">
                        Go to Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Slider Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex ? 'bg-white' : 'bg-white/40'}`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm transition-colors"
          onClick={scrollPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-sm transition-colors"
          onClick={scrollNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </section>

      {/* Destinations Section with Map */}
      <section id="destinations" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Popular Destinations</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Explore some of Pakistan's most breathtaking locations and plan your next adventure with us.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Map View */}
            <div className="rounded-xl overflow-hidden shadow-lg h-[500px] bg-white">
              <div className="h-full w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6809659.254942012!2d69.34037135!3d30.3750272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38db52d2f8fd751f%3A0x46b7a1f7e614925c!2sPakistan!5e0!3m2!1sen!2s!4v1654956851845!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map of Pakistan's Tourist Destinations"
                ></iframe>
              </div>
            </div>
            
            {/* Destinations List */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Top Destinations</h3>
              
              {/* Destination Item 1 */}
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex gap-4 group cursor-pointer">
                <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1586804199428-88a456fc0c42?q=80&w=2070&auto=format&fit=crop" 
                    alt="Hunza Valley" 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">Hunza Valley</h4>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">Experience the majestic beauty of the Karakoram mountain range.</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" /> Gilgit-Baltistan, Northern Pakistan
                  </div>
                </div>
              </div>
              
              {/* Destination Item 2 */}
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex gap-4 group cursor-pointer">
                <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1567606940710-fa241652be4a?q=80&w=1886&auto=format&fit=crop" 
                    alt="Swat Valley" 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">Swat Valley</h4>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">Discover the 'Switzerland of Pakistan' with lush green landscapes.</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" /> Khyber Pakhtunkhwa, Pakistan
                  </div>
                </div>
              </div>
              
              {/* Destination Item 3 */}
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex gap-4 group cursor-pointer">
                <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=1894&auto=format&fit=crop" 
                    alt="Murree" 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">Murree</h4>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">Enjoy the colonial architecture and pine forests of this hill station.</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" /> Punjab, Pakistan
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <a href="#" className="inline-flex items-center text-primary font-medium hover:underline">
                  View all destinations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Quick Search Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-12">
            <h3 className="text-2xl font-bold mb-6">Find Your Perfect Trip</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select Destination</option>
                  <option value="hunza">Hunza Valley</option>
                  <option value="swat">Swat Valley</option>
                  <option value="murree">Murree</option>
                  <option value="naran">Naran Kaghan</option>
                  <option value="skardu">Skardu</option>
                </select>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input type="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
              <div className="relative">
                <Bus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Select Bus Type</option>
                  <option value="luxury">Luxury</option>
                  <option value="executive">Executive</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02]">
                  Search Available Buses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SeatMe</h2>
            <p className="text-gray-600 text-lg">Experience the best travel service with premium features designed for your comfort and convenience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Booking</h3>
              <p className="text-gray-600">Book your tickets with just a few clicks and secure your seats instantly. Our streamlined process makes planning your journey effortless.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Local Guides</h3>
              <p className="text-gray-600">Our experienced local guides will help you discover the hidden gems of each destination, providing authentic cultural insights.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Information</h3>
              <p className="text-gray-600">All our travel information is verified and up-to-date for a hassle-free journey. Trust our reliable data for your travel plans.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with advanced security measures ensure your transactions are always safe and protected.</p>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Bus Routes</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
            <p className="text-gray-600 text-lg">Discover why thousands of travelers choose SeatMe for their journeys across Pakistan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/32.jpg" 
                      alt="Sarah Ahmed" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Sarah Ahmed</h4>
                    <p className="text-gray-500 text-sm">Karachi, Pakistan</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"SeatMe made our family trip to Hunza Valley so easy and enjoyable. The booking process was smooth, and the local guide they arranged was exceptional!"</p>
              <div className="flex text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div className="mt-4 text-sm text-gray-500">Traveled to: Hunza Valley</div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/men/44.jpg" 
                      alt="Ali Hassan" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Ali Hassan</h4>
                    <p className="text-gray-500 text-sm">Islamabad, Pakistan</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"I've used many travel services before, but SeatMe stands out for their attention to detail and customer service. My trip to Murree was perfectly organized."</p>
              <div className="flex text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div className="mt-4 text-sm text-gray-500">Traveled to: Murree</div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/67.jpg" 
                      alt="Fatima Khan" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Fatima Khan</h4>
                    <p className="text-gray-500 text-sm">Lahore, Pakistan</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic mb-6">"As a solo female traveler, safety was my main concern. SeatMe ensured I had a safe and memorable experience exploring Swat Valley. Highly recommended!"</p>
              <div className="flex text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm text-gray-500">Traveled to: Swat Valley</div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-16 text-center">
            <a href="#" className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
              Read More Reviews
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Explore Pakistan?</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">Join thousands of satisfied travelers who have experienced the beauty of Pakistan with SeatMe.</p>
          <Link href="/login" className="bg-white text-primary font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors inline-block">
            Go to Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SeatMe</h3>
              <p className="text-gray-400">Explore the beauty of Pakistan with our premium travel services.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Popular Destinations</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hunza Valley</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Swat Valley</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Murree</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Skardu</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@seatme.pk
                </li>
                <li className="flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +92 300 1234567
                </li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SeatMe. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Smooth Scroll Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
              });
            });
          });
        `
      }} />
    </div>
  );
};

export default LandingPage;