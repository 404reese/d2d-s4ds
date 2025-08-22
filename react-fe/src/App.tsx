import { useState, useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';
import HealthCheck from './components/HealthCheck';

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Check if admin route
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      setIsAdminMode(path === '/admin');
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, []);

  useEffect(() => {
    if (!isAdminMode) {
      const handleScroll = () => {
        const sections = ['about', 'blog', 'projects', 'contact'];
        const scrollPosition = window.scrollY + 100;

        sections.forEach((section) => {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop;
            const height = element.offsetHeight;
            
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
              setActiveSection(section);
            }
          }
        });
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isAdminMode]);

  if (isAdminMode) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header activeSection={activeSection} />
      <main>
        <About />
        <Blog />
        <Projects />
        <Contact />
      </main>
      <HealthCheck />
    </div>
  );
}

export default App;