import React, { useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useTheme } from '../context/ThemeContext'

const About = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
      title: "Quality Assurance",
      description: "We meticulously select and vet each product to ensure it meets our stringent quality standards."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
      title: "Convenience",
      description: "With our user-friendly interface and hassle-free ordering process, shopping has never been easier."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      title: "Exceptional Support",
      description: "Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority."
    }
  ];

  return (
    <div className="py-10">
      {/* Header */}
      <div className='text-center mb-12'>
        <Title text1={'ABOUT'} text2={'US'} />
        <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Discover our story and what makes us different
        </p>
      </div>

      {/* Story Section */}
      <div className={`rounded-3xl overflow-hidden mb-16 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className='flex flex-col lg:flex-row'>
          <div className="lg:w-1/2">
            <img className='w-full h-full object-cover' src={assets.about_img} alt="About Alamgir Fashion Center" />
          </div>
          <div className='lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center'>
            <span className={`text-sm font-semibold tracking-wider mb-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              OUR STORY
            </span>
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Redefining Online Shopping
            </h2>
            <div className={`space-y-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>
                Alamgir Fashion Center was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
              </p>
              <p>
                Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.
              </p>
            </div>
            
            {/* Mission */}
            <div className={`mt-8 p-6 rounded-2xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-indigo-50'}`}>
              <h3 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Our Mission
              </h3>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Our mission at Alamgir Fashion Center is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <Title text1={'WHY'} text2={'CHOOSE US'} />
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 ${
                isDarkMode 
                  ? 'bg-slate-800 border border-slate-700 hover:border-indigo-500/50' 
                  : 'bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg'
              }`}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {feature.icon}
              </div>
              <h3 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {feature.title}
              </h3>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className={`rounded-3xl p-8 lg:p-12 mb-16 ${isDarkMode ? 'bg-gradient-to-r from-indigo-900 to-teal-900' : 'bg-gradient-to-r from-indigo-600 to-teal-600'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Happy Customers" },
            { value: "5K+", label: "Products Available" },
            { value: "50+", label: "Brand Partners" },
            { value: "99%", label: "Satisfaction Rate" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-indigo-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default About
