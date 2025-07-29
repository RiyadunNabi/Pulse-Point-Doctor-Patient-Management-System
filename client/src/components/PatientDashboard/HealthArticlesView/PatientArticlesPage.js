import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardNavigation from '../Navigation/DashboardNavigation';
import PatientArticleCard from './PatientArticleCard';
import { 
    BookOpen, 
    Search, 
    Filter,
    Stethoscope
} from 'lucide-react';

const PatientArticlesPage = ({ user, onLogout }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [
        'General Health',
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Dermatology',
        'Mental Health',
        'Nutrition',
        'Preventive Care'
    ];

    // Fetch all articles
    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/health-articles');
            setArticles(response.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    // Filter articles based on search and category
    const filteredArticles = articles.filter(article => {
        const matchesSearch = searchTerm === '' || 
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
                <DashboardNavigation activeTab="articles" onLogout={onLogout} />
                <div className="flex items-center justify-center py-20">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        <span className="text-slate-700 font-medium">Loading health articles...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
            <DashboardNavigation activeTab="articles" onLogout={onLogout} />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Health Articles</h1>
                            <p className="text-slate-600">Expert medical insights from healthcare professionals</p>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles by title, author, or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none pl-4 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Articles Count */}
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Showing {filteredArticles.length} of {articles.length} articles
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="space-y-6">
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-800 mb-2">
                                {searchTerm || selectedCategory ? 'No articles found' : 'No health articles available'}
                            </h3>
                            <p className="text-slate-500">
                                {searchTerm || selectedCategory 
                                    ? 'Try adjusting your search criteria'
                                    : 'Check back later for new medical content from our healthcare professionals'
                                }
                            </p>
                        </div>
                    ) : (
                        filteredArticles.map(article => (
                            <PatientArticleCard 
                                key={article.article_id} 
                                article={article}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientArticlesPage;
