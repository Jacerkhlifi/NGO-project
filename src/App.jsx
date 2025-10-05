import React, { useState } from 'react'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

function App() {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  // Handle contact form input changes
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: null });
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormStatus({ submitting: false, success: true, error: null });
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setFormStatus({ submitting: false, success: false, error: data.error || 'Failed to send message' });
      }
    } catch (error) {
      setFormStatus({ submitting: false, success: false, error: 'Network error. Please try again.' });
    }
  };

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50" style={{minHeight: '100vh', background: 'linear-gradient(to bottom right, #eff6ff, #ecfeff)'}}>
      {/* PayPal Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Make a Donation</h3>
              <button 
                onClick={() => setShowDonateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Your donation helps us provide clean water to communities in Tunisia. Thank you for your support!
            </p>
            <PayPalScriptProvider options={{ 
              "client-id": "test", 
              currency: "USD" 
            }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: "10.00",
                        },
                        description: "Donation to Ragoge El Kanz"
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert("Thank you for your donation!");
                    setShowDonateModal(false);
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-lg z-50" style={{position: 'fixed', top: 0, width: '100%', backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 50, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
        <div className="container-custom" style={{maxWidth: '1280px', margin: '0 auto', padding: '0 1rem'}}>
          <div className="flex justify-between items-center py-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0'}}>
            <div className="flex items-center space-x-3" style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <img 
                src="/images/logo.png" 
                alt="Ragoge El Kanz Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" 
                style={{width: '2rem', height: '2rem'}}
              />
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-gradient" style={{fontSize: '1.125rem', fontWeight: 'bold', background: 'linear-gradient(to right, #2563eb, #0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                Ragoge El Kanz
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button className="lg:hidden md:hidden flex items-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors" style={{color: '#374151', textDecoration: 'none'}}>Home</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors" style={{color: '#374151', textDecoration: 'none'}}>About</a>
              <a href="#presentation" className="text-gray-700 hover:text-blue-600 transition-colors" style={{color: '#374151', textDecoration: 'none'}}>Presentation</a>
              <a href="#team" className="text-gray-700 hover:text-blue-600 transition-colors" style={{color: '#374151', textDecoration: 'none'}}>Team</a>
              <a href="#programs" className="text-gray-700 hover:text-blue-600 transition-colors" style={{color: '#374151', textDecoration: 'none'}}>Programs</a>
              <a href="#events" className="text-gray-700 hover:text-blue-600 transition-colors" style={{color: '#374151', textDecoration: 'none'}}>Events</a>
              <a href="#gallery" className="text-gray-700 hover:text-blue-600 transition-colors" style={{color: '#374151', textDecoration: 'none'}}>Gallery</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors" style={{color: '#374151', textDecoration: 'none'}}>Contact</a>
            </div>
            
            <button className="hidden md:block btn-primary" onClick={() => setShowDonateModal(true)}>Donate Now</button>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-white border-t border-gray-100" style={{padding: '1rem 0', backgroundColor: 'white', borderTop: '1px solid #f3f4f6'}}>
              <div className="flex flex-col space-y-3" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2" style={{color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem'}}>Home</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2" style={{color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem'}}>About</a>
                <a href="#presentation" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2" style={{color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem'}}>Presentation</a>
                <a href="#team" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2" style={{color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem'}}>Team</a>
                <a href="#programs" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2" style={{color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem'}}>Programs</a>
                <a href="#events" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2" style={{color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem'}}>Events</a>
                <a href="#gallery" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2" style={{color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem'}}>Gallery</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2" style={{color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem'}}>Contact</a>
                <div className="px-4 pt-2" style={{padding: '0.5rem 1rem 0 1rem'}}>
                  <button className="btn-primary w-full" style={{backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600', width: '100%'}}>Donate Now</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0" style={{position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingTop: '5rem'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(to right, rgba(37, 99, 235, 0.6), rgba(8, 145, 178, 0.6))',
          backgroundImage: 'url("/images/help.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          filter: 'brightness(0.9)'
        }}></div>
        <div className="absolute inset-0 md:hidden" style={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(to right, rgba(37, 99, 235, 0.7), rgba(8, 145, 178, 0.7))',
          backgroundImage: 'url("/images/help.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          backgroundBlendMode: 'overlay',
          filter: 'brightness(0.85)'
        }}></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/30 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-400/20 rounded-full animate-bounce-slow"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-300/40 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-cyan-300/30 rounded-full animate-bounce-slow"></div>
        </div>
        
        <div className={`container-custom text-center z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{maxWidth: '1280px', margin: '0 auto', textAlign: 'center', zIndex: 10, padding: '0 1rem'}}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 animate-fade-in" style={{fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            <span className="text-gradient" style={{background: 'linear-gradient(to right, #2563eb, #0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Water</span>
            <br />
            <span className="text-gray-800" style={{color: '#1f2937'}}>A Right for Every Human</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 mb-6 md:mb-8 max-w-3xl mx-auto animate-slide-up font-medium px-4" style={{fontSize: '1rem', color: '#1f2937', marginBottom: '1.5rem', maxWidth: '48rem', margin: '0 auto 1.5rem', fontWeight: 500, padding: '0 1rem'}}>
            Water plays a crucial role in regulating body temperature. During physical activity or exposure to heat, 
            the body releases sweat, which cools the skin as it evaporates. Even while breathing, moisture is lost 
            to help control internal temperature. We work to ensure access to this vital resource for all in Tunisia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-slide-up px-4" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center', padding: '0 1rem'}}>
            <button className="btn-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4" style={{backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', fontWeight: '600', fontSize: '1rem'}}>
              Join Our Mission
            </button>
            <button className="btn-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4" style={{backgroundColor: 'transparent', color: '#2563eb', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '2px solid #2563eb', fontWeight: '600', fontSize: '1rem'}}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-white">
        <div className="container-custom px-4 md:px-0">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
                Our <span className="text-gradient">Mission</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6">
                We are dedicated to providing clean and safe water to Tunisian communities. 
                Our mission is to ensure that every person has access to potable water, which is 
                essential for health, dignity, and prosperity.
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
                Through innovative solutions, community partnerships, and sustainable practices, 
                we work to solve water scarcity and improve water quality in underserved regions of Tunisia.
              </p>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="text-center p-4 md:p-6 bg-blue-50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">24</div>
                  <div className="text-sm md:text-base text-gray-600">Governorates Served</div>
                </div>
                <div className="text-center p-4 md:p-6 bg-cyan-50 rounded-lg">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-600 mb-2">50K+</div>
                  <div className="text-sm md:text-base text-gray-600">Lives Impacted</div>
                </div>
              </div>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <img 
                  src="/images/mission.jpg" 
                  alt="Access to clean water in Tunisia" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation Section */}
      <section id="presentation" className="section-padding bg-gray-50" style={{padding: '4rem 1rem', backgroundColor: '#f9fafb'}}>
        <div className="container-custom" style={{maxWidth: '1280px', margin: '0 auto'}}>
          <div className="text-center mb-16" style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6" style={{fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem'}}>
              Our <span className="text-gradient" style={{background: 'linear-gradient(to right, #2563eb, #0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Presentation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{fontSize: '1.25rem', color: '#4b5563', maxWidth: '48rem', margin: '0 auto'}}>
              Discover our mission, values, and impact in the fight for access to clean water in Tunisia.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem'}}>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6" style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem'}}>
                Our Vision
              </h3>
              <p className="text-lg text-gray-600 mb-6" style={{fontSize: '1.125rem', color: '#4b5563', marginBottom: '1.5rem'}}>
                We envision a Tunisia where every citizen has access to quality drinking water, 
                contributing to public health, economic development, and human dignity.
              </p>
              <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div className="flex items-center space-x-3" style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center" style={{width: '2rem', height: '2rem', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" style={{width: '1rem', height: '1rem', color: '#2563eb'}}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700" style={{color: '#374151'}}>Universal access to clean water</span>
                </div>
                <div className="flex items-center space-x-3" style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center" style={{width: '2rem', height: '2rem', backgroundColor: '#cffafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20" style={{width: '1rem', height: '1rem', color: '#0891b2'}}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700" style={{color: '#374151'}}>Sustainable community development</span>
                </div>
                <div className="flex items-center space-x-3" style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center" style={{width: '2rem', height: '2rem', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" style={{width: '1rem', height: '1rem', color: '#059669'}}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700" style={{color: '#374151'}}>Technological innovation</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg" style={{backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
              <h4 className="text-xl font-bold text-gray-800 mb-4" style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem'}}>Our Values</h4>
              <div className="space-y-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div className="flex items-start space-x-3" style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0" style={{width: '1.5rem', height: '1.5rem', backgroundColor: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <span className="text-white text-sm font-bold" style={{color: 'white', fontSize: '0.875rem', fontWeight: 'bold'}}>1</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1" style={{fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem'}}>Transparency</h5>
                    <p className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>Transparent management of resources and projects</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3" style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                  <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0" style={{width: '1.5rem', height: '1.5rem', backgroundColor: '#0891b2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <span className="text-white text-sm font-bold" style={{color: 'white', fontSize: '0.875rem', fontWeight: 'bold'}}>2</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1" style={{fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem'}}>Sustainability</h5>
                    <p className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>Sustainable and environmentally friendly solutions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3" style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0" style={{width: '1.5rem', height: '1.5rem', backgroundColor: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <span className="text-white text-sm font-bold" style={{color: 'white', fontSize: '0.875rem', fontWeight: 'bold'}}>3</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1" style={{fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem'}}>Solidarity</h5>
                    <p className="text-gray-600 text-sm" style={{color: '#4b5563', fontSize: '0.875rem'}}>Commitment to the most vulnerable communities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center" style={{backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', textAlign: 'center'}}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '4rem', height: '4rem', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" style={{width: '2rem', height: '2rem', color: '#2563eb'}}>
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4" style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem'}}>Social Impact</h3>
              <p className="text-gray-600" style={{color: '#4b5563'}}>
                Improvement of public health and reduction of water-related diseases in Tunisian communities.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center" style={{backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', textAlign: 'center'}}>
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '4rem', height: '4rem', backgroundColor: '#cffafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 20 20" style={{width: '2rem', height: '2rem', color: '#0891b2'}}>
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4" style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem'}}>Innovation</h3>
              <p className="text-gray-600" style={{color: '#4b5563'}}>
                Development of innovative technologies for the treatment and distribution of drinking water.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center" style={{backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', textAlign: 'center'}}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '4rem', height: '4rem', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20" style={{width: '2rem', height: '2rem', color: '#059669'}}>
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4" style={{fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem'}}>Sustainability</h3>
              <p className="text-gray-600" style={{color: '#4b5563'}}>
                Sustainable solutions that preserve the environment and ensure the sustainability of water resources.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
              Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 md:px-0">
              Meet the dedicated professionals working to bring clean water to Tunisian communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 md:mb-6 overflow-hidden">
                  <img src="/images/insaf.jpg" alt="Insaf Makhloufi" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">Insaf Makhloufi</h3>
                <p className="text-blue-600 font-semibold mb-3 md:mb-4">President</p>
                <p className="text-sm md:text-base text-gray-600">
                  Leading our water initiatives in Tunisia with extensive experience in public health and water management.
                </p>
                <div className="mt-3 md:mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-blue-500 hover:text-blue-700"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg></a>
                  <a href="#" className="text-blue-800 hover:text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg></a>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
                  <img src="/images/ahmed.jpg" alt="Abdelhamid Ayadi" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Abdelhamid Ayadi</h3>
                <p className="text-cyan-600 font-semibold mb-4">Vice President</p>
                <p className="text-gray-600">
                  Supporting strategic initiatives and community partnerships for sustainable water solutions.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-blue-500 hover:text-blue-700"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg></a>
                  <a href="#" className="text-blue-800 hover:text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg></a>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
                  <img src="/images/jihhed.jpg" alt="Jihed Khlifi" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Jihed Khlifi</h3>
                <p className="text-green-600 font-semibold mb-4">Research & Community Engagement Officer</p>
                <p className="text-gray-600">
                  Building partnerships and educating communities about water conservation and hygiene practices.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-blue-500 hover:text-blue-700"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg></a>
                  <a href="#" className="text-blue-800 hover:text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg></a>
                </div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
                  <img src="/images/amir.jpg" alt="Amir Sousou" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Amir Sousou</h3>
                <p className="text-purple-600 font-semibold mb-4">Secretary</p>
                <p className="text-gray-600">
                  Managing organizational communications and administrative coordination for our water projects.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-blue-500 hover:text-blue-700"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg></a>
                  <a href="#" className="text-blue-800 hover:text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg></a>
                </div>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
                  <img src="/images/abdallah.jpg" alt="Abdelallah Lahdheri" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Abdelallah Lahdheri</h3>
                <p className="text-orange-600 font-semibold mb-4">Treasurer</p>
                <p className="text-gray-600">
                  Managing financial resources and ensuring transparent operations to maximize impact of every donation.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-blue-500 hover:text-blue-700"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg></a>
                  <a href="#" className="text-blue-800 hover:text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg></a>
                </div>
              </div>
            </div>

            {/* Team Member 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden">
                  <img src="/images/jacer.jpg" alt="Jacer Khlifi" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Jacer Khlifi</h3>
                <p className="text-indigo-600 font-semibold mb-4">Project Manager</p>
                <p className="text-gray-600">
                  Coordinating on-ground operations and ensuring successful project implementation across Tunisia.
                </p>
                <div className="mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-blue-500 hover:text-blue-700"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg></a>
                  <a href="#" className="text-blue-800 hover:text-blue-900"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Our <span className="text-gradient">Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement comprehensive water solutions through various programs designed 
              to address different aspects of water access and quality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Water Wells</h3>
              <p className="text-gray-600 mb-6">
                Drilling and maintaining deep water wells in rural Tunisian communities 
                to provide reliable access to clean groundwater.
              </p>
              <div className="text-blue-600 font-semibold">Learn More →</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Water Purification</h3>
              <p className="text-gray-600 mb-6">
                Installing advanced filtration systems to eliminate contaminants and provide 
                safe drinking water to Tunisian communities.
              </p>
              <div className="text-cyan-600 font-semibold">Learn More →</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Education & Training</h3>
              <p className="text-gray-600 mb-6">
                Teaching communities about water conservation, hygiene practices, and 
                sustainable water management in Tunisia.
              </p>
              <div className="text-green-600 font-semibold">Learn More →</div>
            </div>
          </div>
        </div>
      </section>

    

      {/* Events Section */}
      

      {/* Gallery Section */}
      <section id="gallery" className="section-padding bg-gray-50">
        <div className="container-custom px-4 md:px-0">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
              Our <span className="text-gradient">Gallery</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the impact of our work through these powerful images of the communities we serve in Tunisia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img src="/images/jouga1.jpg" alt="Water project" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img src="/images/jougar2.jpg" alt="Community support" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img src="/images/jougar3.jpg" alt="Clean water initiative" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img src="/images/jougar5.jpg" alt="Water distribution" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img src="/images/jougar7.jpg" alt="Team in action" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img src="/images/jougar10.jpg" alt="Community event" className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="section-padding bg-white">
        <div className="container-custom px-4 md:px-0">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
              Upcoming <span className="text-gradient">Events</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Join us in our mission across Tunisia
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 shadow-lg text-center">
              <div className="mb-6">
                <img src="/images/jougar7.jpg" alt="Upcoming event" className="w-full h-64 object-cover rounded-xl mb-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Water Project Launch</h3>
              <p className="text-xl text-blue-600 font-semibold mb-4">Stay Tuned!</p>
              <p className="text-gray-700 mb-6">
                We're preparing to launch our next major water project in Tunisia. 
                More details will be announced soon. Follow our social media channels for updates.
              </p>
              <button className="btn-primary text-lg px-8 py-4">
                Get Notified
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Get <span className="text-gradient">Involved</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us to make clean water accessible to everyone in Tunisia. Your support can change lives.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Email</div>
                    <div className="text-gray-600">contact@ragogekanz.org</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Address</div>
                    <div className="text-gray-600">ESPRIT School of Engineering, Z.I. Chotrana II, Tunis, Tunisia</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Phone</div>
                    <div className="text-gray-600">+216 71 123 456</div>
                  </div>
                </div>
                
                {/* Map */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Our Location</h3>
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer 
                      center={[36.8985, 10.1896]} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[36.8985, 10.1896]}>
                        <Popup>
                          ESPRIT School of Engineering<br />
                          Z.I. Chotrana II, Tunis, Tunisia
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              {formStatus.success ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                  Thank you for your message! We'll get back to you soon.
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div>
                    <input 
                      type="text" 
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <textarea 
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      placeholder="Your Message" 
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  {formStatus.error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                      {formStatus.error}
                    </div>
                  )}
                  <button 
                    type="submit" 
                    className="btn-primary w-full"
                    disabled={formStatus.submitting}
                  >
                    {formStatus.submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
      <div>
              <div className="flex items-center space-x-3 mb-4" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'}}>
                <img 
                  src="/images/logo.png" 
                  alt="Ragoge El Kanz Logo" 
                  className="w-10 h-10" 
                  style={{width: '2.5rem', height: '2.5rem'}}
                />
                <div className="text-2xl font-bold">Ragoge El Kanz</div>
              </div>
              <p className="text-gray-400 mb-4">
                Making clean water accessible to everyone in Tunisia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
        </a>
      </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Programs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Water Wells</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Purification</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Education</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency Relief</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Get Involved</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Donate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fundraising</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partnership</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Annual Report</a></li>
                <li><a href="#" className="hover:text-white transition-colors">News</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ragoge El Kanz. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
  )
}

export default App
