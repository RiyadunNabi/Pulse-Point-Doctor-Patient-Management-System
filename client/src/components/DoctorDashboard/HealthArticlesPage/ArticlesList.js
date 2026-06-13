import React, { useMemo } from 'react';
import ArticleCard from './ArticleCard';
import ErrorBoundary from '../../shared/ErrorBoundary';
import { BookOpen } from 'lucide-react';

const ArticlesList = ({ 
    articles, 
    loading, 
    searchTerm, 
    selectedCategory, 
    currentDoctorId, 
    onArticleUpdated 
}) => {
    const filteredArticles = useMemo(() => {
        // Add null check for articles
        if (!articles || !Array.isArray(articles)) {
            return [];
        }
        
        return articles.filter(article => {
            // Add null checks for article properties
            const title = article?.title || '';
            const firstName = article?.first_name || '';
            const lastName = article?.last_name || '';
            const category = article?.category || '';
            
            const matchesSearch = searchTerm === '' || 
                title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lastName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === '' || category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [articles, searchTerm, selectedCategory]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                            <div className="space-y-1">
                                <div className="h-4 bg-slate-200 rounded w-32"></div>
                                <div className="h-3 bg-slate-200 rounded w-24"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (filteredArticles.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                    {searchTerm || selectedCategory ? 'No articles found' : 'No articles yet'}
                </h3>
                <p className="text-slate-500">
                    {searchTerm || selectedCategory 
                        ? 'Try adjusting your search or filter criteria'
                        : 'Be the first to share your medical knowledge!'
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {filteredArticles.map(article => (
                <ErrorBoundary key={article?.article_id || Math.random()}>
                    <ArticleCard 
                        article={article}
                        isOwner={article?.doctor_id === currentDoctorId}
                        onArticleUpdated={onArticleUpdated}
                    />
                </ErrorBoundary>
            ))}
        </div>
    );
};

export default ArticlesList;
