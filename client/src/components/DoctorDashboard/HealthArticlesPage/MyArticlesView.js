import React, { useState } from 'react';
import ArticleCard from './ArticleCard';
import { Plus, FileText, Search, Filter } from 'lucide-react';

const MyArticlesView = ({ articles, doctorId, onArticleUpdated, categories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredArticles = articles.filter(article => {
        const matchesSearch = searchTerm === '' || 
            article.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search your articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>
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

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-2">
                        {searchTerm || selectedCategory ? 'No articles found' : "You haven't published any articles yet"}
                    </h3>
                    <p className="text-slate-500 mb-6">
                        {searchTerm || selectedCategory 
                            ? 'Try adjusting your search criteria'
                            : 'Switch to "All Articles" tab to create your first health article'
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Your Articles ({filteredArticles.length})
                        </h3>
                    </div>
                    
                    {filteredArticles.map(article => (
                        <ArticleCard 
                            key={article.article_id} 
                            article={article}
                            isOwner={true}
                            onArticleUpdated={onArticleUpdated}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyArticlesView;
