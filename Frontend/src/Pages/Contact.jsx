import React, { useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useTheme } from '../context/ThemeContext'

const Contact = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const contactInfo = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      title: "Our Location",
      content: ["54709 Willms Station", "Suite 350, Washington, USA"]
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      title: "Phone",
      content: ["(415) 555-0132", "Mon-Fri 9AM-6PM EST"]
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      title: "Email",
      content: ["admin@forever.com", "support@forever.com"]
    }
  ];

  return (
    <div className="py-10">
      {/* Header */}
      <div className='text-center mb-12'>
        <Title text1={'CONTACT'} text2={'US'} />
        <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          We'd love to hear from you. Get in touch with us.
        </p>
      </div>

      {/* Contact Content */}
      <div className={`rounded-3xl overflow-hidden mb-16 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className='flex flex-col lg:flex-row'>
          <div className="lg:w-1/2">
            <img className='w-full h-full object-cover' src={assets.contact_img} alt="Contact Alamgir Fashion Center" />
          </div>
          <div className='lg:w-1/2 p-8 lg:p-12'>
            {/* Contact Info Cards */}
            <div className="space-y-6 mb-10">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                    isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {info.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {info.title}
                    </h3>
                    {info.content.map((line, i) => (
                      <p key={i} className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Careers Section */}
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/50 to-teal-900/50 border border-indigo-500/20' : 'bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Careers at Alamgir Fashion Center
                </h3>
              </div>
              <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Learn more about our teams and job openings. Join our growing family!
              </p>
              <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white text-slate-900 hover:bg-slate-100' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}>
                Explore Careers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className={`rounded-3xl p-8 lg:p-12 mb-16 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              Send us a Message
            </h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              Fill out the form below and we'll get back to you shortly.
            </p>
          </div>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Your Name
                </label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Subject
              </label>
              <input 
                type="text" 
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                }`}
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Message
              </label>
              <textarea 
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500'
                }`}
                placeholder="Your message..."
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-indigo-500/25"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default Contact
