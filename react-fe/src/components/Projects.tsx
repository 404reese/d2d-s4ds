import React from 'react';

interface Project {
  title: string;
  description: string;
  link: string;
  tags: string[];
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      title: 'E-Commerce Dashboard',
      description: 'A comprehensive admin dashboard for managing online stores with real-time analytics, inventory management, and order processing.',
      link: 'https://github.com/johndoe/ecommerce-dashboard',
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, team workspaces, and advanced filtering capabilities.',
      link: 'https://github.com/johndoe/task-manager',
      tags: ['Next.js', 'Socket.io', 'MongoDB', 'Tailwind CSS']
    },
    {
      title: 'Weather Forecast API',
      description: 'A RESTful API service that aggregates weather data from multiple sources and provides accurate forecasts with caching.',
      link: 'https://github.com/johndoe/weather-api',
      tags: ['Python', 'FastAPI', 'Redis', 'Docker']
    },
    {
      title: 'Portfolio Website',
      description: 'A responsive portfolio website built with modern web technologies, featuring smooth animations and optimal performance.',
      link: 'https://github.com/johndoe/portfolio',
      tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion']
    }
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-light text-blue-900 mb-4 animate-pulse-hover">
            Selected Projects
          </h2>
          <p className="text-lg text-gray-600 font-light opacity-0 animate-fade-in-up stagger-1">
            A collection of work I'm proud to have built
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 opacity-0 animate-fade-in-up border border-blue-100 stagger-${Math.min(index + 1, 4)}`}
            >
              <h3 className="text-xl font-medium text-blue-800 mb-4 hover:text-blue-600 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 hover:text-gray-800 transition-colors duration-300">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-300 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 font-medium transform hover:scale-110"
              >
                View Project
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;