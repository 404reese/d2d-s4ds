import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section with Image Option */}
        <div className="text-center mb-20 opacity-0 animate-fade-in-up">
          {/* Profile Image - Replace src with your image URL or remove this div if no image */}
          <div className="mb-8 opacity-0 animate-fade-in stagger-1">
            <div className="w-40 h-40 md:w-64 md:h-64 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-300 flex items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105">
              {/* Option 1: Use an image */}
              <img 
                src="/image.jpg" 
                alt="John Doe" 
                className="w-full h-full object-cover"
              />
              
              {/* Option 2: Use initials as placeholder */}
              {/* <span className="text-3xl md:text-4xl font-light text-blue-600">JD</span> */}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-8 animate-pulse-hover">
  <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-gray-900 leading-tight">
    Hello, I'm{' '}
    <span className="font-normal text-blue-600 ml-2">Pranav !</span>
  </h1>
  <img 
    src="/icon.png" 
    alt="Icon" 
    className="h-[4em] md:h-[3em] lg:h-[6em] w-auto"
  />
</div>

          <p className="text-xl md:text-3xl lg:text-4xl text-gray-600 font-light leading-relaxed opacity-0 animate-fade-in-up stagger-2 max-w-4xl mx-auto">
            A passionate full-stack developer creating beautiful, functional web experiences
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 opacity-0 animate-fade-in-up stagger-3">
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg"
            >
              View My Work
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium transform hover:scale-105"
            >
              Get In Touch
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 mt-24">
          <div className="opacity-0 animate-slide-in-left stagger-4">
            <h2 className="text-2xl font-medium text-blue-800 mb-6">About Me</h2>
            <p className="text-gray-600 leading-relaxed mb-6 hover:text-gray-800 transition-colors duration-300">
              I'm a dedicated software developer with 5+ years of experience building modern web applications. 
              I specialize in React, Node.js, and cloud technologies, with a passion for creating intuitive 
              user experiences and scalable solutions.
            </p>
            <p className="text-gray-600 leading-relaxed hover:text-gray-800 transition-colors duration-300">
              When I'm not coding, you can find me exploring new technologies, contributing to open source, 
              or sharing knowledge with the developer community.
            </p>
          </div>
          
          <div className="opacity-0 animate-slide-in-right stagger-4">
            <h2 className="text-2xl font-medium text-blue-800 mb-6">Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                'JavaScript/TypeScript',
                'React & Next.js',
                'Node.js & Express',
                'Python & Django',
                'PostgreSQL & MongoDB',
                'AWS & Docker',
                'Git & CI/CD',
                'UI/UX Design'
              ].map((skill, index) => (
                <div key={skill} className="text-gray-600 text-sm">
                  <span className={`hover:text-blue-600 transition-colors duration-300 cursor-default opacity-0 animate-fade-in stagger-${Math.min(index % 4 + 1, 4)}`}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;