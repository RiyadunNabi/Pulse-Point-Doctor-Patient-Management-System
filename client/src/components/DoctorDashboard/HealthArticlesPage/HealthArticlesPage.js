import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorNavigation from '../shared/DoctorNavigation';
import ArticleCreationSection from './ArticleCreationSection';
import ArticlesList from './ArticlesList';
import MyArticlesView from './MyArticlesView';
import { 
    BookOpen, 
    Plus, 
    Grid, 
    User,
    Filter,
    Search
} from 'lucide-react';

const HealthArticlesPage = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [articles, setArticles] = useState([]);
    const [myArticles, setMyArticles] = useState([]);
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

    // Fetch doctor's articles
    const fetchMyArticles = async () => {
        try {
            const response = await axios.get(`/api/health-articles?doctorId=${user.doctor_id}`);
            setMyArticles(response.data);
        } catch (error) {
            console.error('Error fetching my articles:', error);
        }
    };

    useEffect(() => {
        fetchArticles();
        fetchMyArticles();
    }, [user.doctor_id]);

    const handleArticleCreated = () => {
        fetchArticles();
        fetchMyArticles();
    };

    const handleArticleUpdated = () => {
        fetchArticles();
        fetchMyArticles();
    };

    const tabs = [
        { id: 'all', label: 'All Articles', icon: Grid, count: articles.length },
        { id: 'my-articles', label: 'My Articles', icon: User, count: myArticles.length }
    ];

    if (loading && articles.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
                <DoctorNavigation user={user} onLogout={onLogout} />
                <div className="flex items-center justify-center py-20">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                        <span className="text-slate-700 font-medium">Loading articles...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
            <DoctorNavigation user={user} onLogout={onLogout} />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">Health Articles</h1>
                            <p className="text-slate-600">Share knowledge and connect with the medical community</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center space-x-1 bg-white rounded-lg p-1 shadow-sm border">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        activeTab === tab.id 
                                            ? 'bg-white/20 text-white' 
                                            : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Search and Filter Bar */}
                {activeTab === 'all' && (
                    <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none pl-4 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
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
                )}

                {/* Content */}
                <div className="space-y-6">
                    {/* Article Creation Section - Only show in 'all' tab */}
                    {activeTab === 'all' && (
                        <ArticleCreationSection 
                            doctorId={user.doctor_id}
                            onArticleCreated={handleArticleCreated}
                            categories={categories}
                        />
                    )}

                    {/* Articles List */}
                    {activeTab === 'all' ? (
                        <ArticlesList 
                            articles={articles}
                            loading={loading}
                            searchTerm={searchTerm}
                            selectedCategory={selectedCategory}
                            currentDoctorId={user.doctor_id}
                            onArticleUpdated={handleArticleUpdated}
                        />
                    ) : (
                        <MyArticlesView 
                            articles={myArticles}
                            doctorId={user.doctor_id}
                            onArticleUpdated={handleArticleUpdated}
                            categories={categories}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthArticlesPage;
