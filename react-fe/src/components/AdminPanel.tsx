import React, { useState, useEffect } from 'react';
import { postsAPI, uploadAPI, newsletterAPI, Post, NewsletterSubscriber } from '../services/api';
import { Plus, Edit, Trash2, Upload, Send, Users } from 'lucide-react';

const AdminPanel: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'posts' | 'newsletter'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Post form state
  const [postForm, setPostForm] = useState({
    id: null as number | null,
    title: '',
    content: '',
    image_url: ''
  });
  const [isEditingPost, setIsEditingPost] = useState(false);
  
  // Newsletter form state
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'posts') {
        const fetchedPosts = await postsAPI.getPosts();
        setPosts(fetchedPosts);
      } else {
        const fetchedSubscribers = await newsletterAPI.getSubscribers();
        setSubscribers(fetchedSubscribers);
      }
      setMessage(null);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to fetch data. Check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      setMessage({ type: 'error', text: 'Title and content are required.' });
      return;
    }

    setLoading(true);
    try {
      if (isEditingPost && postForm.id) {
        await postsAPI.updatePost(postForm.id, {
          title: postForm.title,
          content: postForm.content,
          image_url: postForm.image_url || undefined
        });
        setMessage({ type: 'success', text: 'Post updated successfully!' });
      } else {
        await postsAPI.createPost({
          title: postForm.title,
          content: postForm.content,
          image_url: postForm.image_url || undefined
        });
        setMessage({ type: 'success', text: 'Post created successfully!' });
      }
      
      resetPostForm();
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save post.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setLoading(true);
    try {
      await postsAPI.deletePost(id);
      setMessage({ type: 'success', text: 'Post deleted successfully!' });
      fetchData();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to delete post.' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const response = await uploadAPI.uploadImage(file);
      setPostForm(prev => ({ ...prev, image_url: response.url }));
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to upload image.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterForm.subject.trim() || !newsletterForm.content.trim()) {
      setMessage({ type: 'error', text: 'Subject and content are required.' });
      return;
    }

    setLoading(true);
    try {
      const response = await newsletterAPI.sendNewsletter(newsletterForm.subject, newsletterForm.content);
      setMessage({ 
        type: 'success', 
        text: `Newsletter sent to ${response.success_count} subscribers!` 
      });
      setNewsletterForm({ subject: '', content: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to send newsletter.' });
    } finally {
      setLoading(false);
    }
  };

  const resetPostForm = () => {
    setPostForm({ id: null, title: '', content: '', image_url: '' });
    setIsEditingPost(false);
  };

  const editPost = (post: Post) => {
    setPostForm({
      id: post.id,
      title: post.title,
      content: post.content,
      image_url: post.image_url || ''
    });
    setIsEditingPost(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-blue-900">Admin Panel</h1>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300"
              >
                Back to Website
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-8 py-4 font-medium transition-colors duration-300 ${
                activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Posts Management
            </button>
            <button
              onClick={() => setActiveTab('newsletter')}
              className={`px-8 py-4 font-medium transition-colors duration-300 ${
                activeTab === 'newsletter'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Newsletter
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mx-8 mt-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {activeTab === 'posts' ? (
              <div className="space-y-8">
                {/* Post Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {isEditingPost ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={postForm.title}
                        onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Post title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={postForm.content}
                        onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={6}
                        placeholder="Post content"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                        >
                          <Upload size={16} className="mr-2" />
                          Upload Image
                        </label>
                        {postForm.image_url && (
                          <img
                            src={postForm.image_url}
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <input
                        type="url"
                        value={postForm.image_url}
                        onChange={(e) => setPostForm(prev => ({ ...prev, image_url: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                        placeholder="Or enter image URL"
                      />
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                      >
                        <Plus size={16} className="mr-2" />
                        {isEditingPost ? 'Update Post' : 'Create Post'}
                      </button>
                      
                      {isEditingPost && (
                        <button
                          type="button"
                          onClick={resetPostForm}
                          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Posts List */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map(post => (
                        <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                              <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(post.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {post.image_url && (
                              <img
                                src={post.image_url}
                                alt={post.title}
                                className="h-20 w-20 object-cover rounded-lg ml-4"
                              />
                            )}
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <button
                              onClick={() => editPost(post)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center text-sm"
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center text-sm"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Newsletter Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Newsletter</h2>
                  
                  <form onSubmit={handleSendNewsletter} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={newsletterForm.subject}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Newsletter subject"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content (HTML supported)
                      </label>
                      <textarea
                        value={newsletterForm.content}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={8}
                        placeholder="Newsletter content"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                      <Send size={16} className="mr-2" />
                      Send Newsletter
                    </button>
                  </form>
                </div>

                {/* Subscribers List */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Users size={24} className="mr-2" />
                    Subscribers ({subscribers.length})
                  </h2>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Subscribed Date</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map(subscriber => (
                            <tr key={subscriber.id} className="border-t border-gray-200">
                              <td className="py-3 px-4">{subscriber.email}</td>
                              <td className="py-3 px-4 text-gray-600">
                                {new Date(subscriber.subscribed_at).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={async () => {
                                    if (confirm(`Remove ${subscriber.email} from newsletter?`)) {
                                      try {
                                        await newsletterAPI.unsubscribe(subscriber.id);
                                        setMessage({ type: 'success', text: 'Subscriber removed successfully!' });
                                        fetchData();
                                      } catch (error) {
                                        setMessage({ type: 'error', text: 'Failed to remove subscriber.' });
                                      }
                                    }
                                  }}
                                  className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
