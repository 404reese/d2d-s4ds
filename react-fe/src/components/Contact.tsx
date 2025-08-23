import React, { useState } from 'react';
import { newsletterAPI } from '../services/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    subscribed: false
  });
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [contactMessage, setContactMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await newsletterAPI.signup(formData.email);
      setMessage({ type: 'success', text: response.message || 'Successfully subscribed to newsletter!' });
      setFormData({ email: '', subscribed: true });
      
      // Reset subscribed status after 3 seconds
      setTimeout(() => {
        setFormData(prev => ({ ...prev, subscribed: false }));
        setMessage(null);
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to subscribe. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Contact form handlers
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setContactLoading(true);
    setContactMessage(null);

    try {
      // Replace with your actual Lambda function URL
      const LAMBDA_ENDPOINT = import.meta.env.VITE_CONTACT_LAMBDA_URL || 'https://your-api-gateway-url.amazonaws.com/contact';
      
      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm)
      });

      const data = await response.json();

      if (response.ok) {
        setContactMessage({ type: 'success', text: data.message || 'Thank you! Your message has been sent successfully.' });
        setContactForm({ name: '', email: '', subject: '', message: '' });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setContactMessage(null);
        }, 5000);
      } else {
        setContactMessage({ type: 'error', text: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (error: unknown) {
      console.error('Contact form error:', error);
      setContactMessage({ type: 'error', text: 'Failed to send message. Please check your connection and try again.' });
    } finally {
      setContactLoading(false);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-light text-blue-900 mb-4 animate-pulse-hover">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 font-light opacity-0 animate-fade-in-up stagger-1">
            Stay updated with my latest projects and insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="opacity-0 animate-slide-in-left stagger-2">
            <h3 className="text-xl font-medium text-blue-800 mb-6">
              Send me a Message
            </h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {contactMessage && (
                <div className={`p-3 rounded-lg text-sm ${
                  contactMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {contactMessage.text}
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-blue-800 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    disabled={contactLoading}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-blue-800 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    disabled={contactLoading}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-blue-800 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  disabled={contactLoading}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-blue-800 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  disabled={contactLoading}
                  rows={5}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed resize-vertical"
                  placeholder="Your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={contactLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                  contactLoading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {contactLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>Send Message ✉️</>
                )}
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 flex items-center">
                <span className="mr-2">⚡</span>
                <strong>Powered by AWS Lambda</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Your message is processed serverlessly for maximum reliability.
              </p>
            </div>
          </div>
          
          {/* Newsletter & Contact Info */}
          <div className="opacity-0 animate-slide-in-left stagger-2">
            <h3 className="text-xl font-medium text-blue-800 mb-6">
              Let's Connect
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8 hover:text-gray-800 transition-colors duration-300">
              I regularly share insights about web development, new technologies, and project updates. 
              Subscribe to stay in the loop with my latest work and thoughts.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Email</h4>
                <a 
                  href="mailto:john.doe@email.com" 
                  className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  john.doe@email.com
                </a>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">LinkedIn</h4>
                <a 
                  href="https://linkedin.com/in/johndoe" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  linkedin.com/in/johndoe
                </a>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">GitHub</h4>
                <a 
                  href="https://github.com/johndoe" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 inline-block"
                >
                  github.com/johndoe
                </a>
              </div>
            </div>
          </div>

          <div className="opacity-0 animate-slide-in-right stagger-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-100">
              <h3 className="text-xl font-medium text-blue-800 mb-4">
                Newsletter Signup
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Get notified about new projects, blog posts, and insights into modern web development.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 hover:border-blue-300 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formData.subscribed || loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                    formData.subscribed 
                      ? 'bg-green-600 text-white cursor-not-allowed' 
                      : loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subscribing...
                    </>
                  ) : formData.subscribed ? (
                    '✓ Subscribed!'
                  ) : (
                    'Subscribe to Newsletter'
                  )}
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                No spam, unsubscribe at any time. I respect your privacy.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Prefer direct contact?
              </p>
              <a
                href="mailto:john.doe@email.com"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium transform hover:scale-105"
              >
                Send me an email
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Contact;