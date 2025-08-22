import React, { useState, useEffect } from 'react';
import { postsAPI, Post } from '../services/api';
import { Calendar, ExternalLink } from 'lucide-react';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postsAPI.getPosts();
      setPosts(fetchedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-blue-900 mb-4">
              Blog Posts
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Latest insights and updates
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading posts...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-blue-900 mb-4">
              Blog Posts
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Latest insights and updates
            </p>
          </div>
          
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-light text-blue-900 mb-4 animate-pulse-hover">
            Blog Posts
          </h2>
          <p className="text-lg text-gray-600 font-light opacity-0 animate-fade-in-up stagger-1">
            Latest insights and updates from my development journey
          </p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-blue-100 inline-block">
              <p className="text-gray-600 text-lg">No blog posts available yet.</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for new content!</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 opacity-0 animate-fade-in-up border border-blue-100 overflow-hidden stagger-${Math.min(index + 1, 4)}`}
              >
                {post.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/public/image.jpg'; // Fallback image
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(post.created_at)}
                  </div>
                  
                  <h3 className="text-xl font-medium text-blue-800 mb-3 hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {truncateContent(post.content)}
                  </p>
                  
                  <button
                    onClick={() => {
                      // In a real app, this would navigate to a full post view
                      console.log('Opening post:', post);
                      alert(`Full post view would open here for: "${post.title}"`);
                    }}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-all duration-300 font-medium transform hover:scale-110"
                  >
                    Read More
                    <ExternalLink size={16} className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
