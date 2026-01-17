import React, { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Search, Wine, Filter, X } from 'lucide-react';

const CATEGORIES = ['커피', '에이드', '스무디', '밀크티', '차', '주스', '기타'];
const DIFFICULTIES = ['쉬움', '보통', '어려움'];

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // all, popular, recent
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await api.get('/recipes');
            setRecipes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setLoading(false);
        }
    };

    const filteredRecipes = useMemo(() => {
        let filtered = [...recipes];

        // 검색어 필터
        if (searchTerm) {
            filtered = filtered.filter(recipe =>
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // 카테고리 필터
        if (selectedCategory) {
            filtered = filtered.filter(recipe => recipe.category === selectedCategory);
        }

        // 난이도 필터
        if (selectedDifficulty) {
            const difficultyMap = { '쉬움': 'easy', '보통': 'medium', '어려움': 'hard' };
            filtered = filtered.filter(recipe => recipe.difficulty === difficultyMap[selectedDifficulty]);
        }

        // 탭 필터
        if (activeTab === 'popular') {
            // 인기순 (좋아요 수 기준, 현재는 최신순으로 대체)
            filtered = filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        } else if (activeTab === 'recent') {
            // 최신순
            filtered = filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        }

        return filtered;
    }, [recipes, searchTerm, selectedCategory, selectedDifficulty, activeTab]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedDifficulty('');
    };

    const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty;

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* 헤더 */}
            <div className="mb-8">
                <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                    맛있는 음료 레시피
                </h1>
                <p className="text-gray-600 text-lg">다양한 음료 레시피를 탐색해보세요</p>
            </div>

            {/* 검색 및 필터 바 */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="레시피, 재료, 태그로 검색..."
                            className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80 backdrop-blur-sm shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-3.5 text-orange-400 w-5 h-5" />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-6 py-3 rounded-xl font-medium transition flex items-center space-x-2 ${
                            showFilters || hasActiveFilters
                                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                                : 'bg-white border-2 border-orange-200 text-gray-700 hover:bg-orange-50'
                        }`}
                    >
                        <Filter className="w-5 h-5" />
                        <span>필터</span>
                        {hasActiveFilters && (
                            <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
                                {[searchTerm, selectedCategory, selectedDifficulty].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                </div>

                {/* 필터 패널 */}
                {showFilters && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">카테고리</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                            !selectedCategory
                                                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        전체
                                    </button>
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                                selectedCategory === cat
                                                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">난이도</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedDifficulty('')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                            !selectedDifficulty
                                                ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        전체
                                    </button>
                                    {DIFFICULTIES.map(diff => (
                                        <button
                                            key={diff}
                                            onClick={() => setSelectedDifficulty(diff)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                                selectedDifficulty === diff
                                                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-medium"
                            >
                                <X className="w-4 h-4" />
                                <span>필터 초기화</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* 탭 */}
            <div className="flex space-x-2 mb-8 border-b border-orange-200">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-6 py-3 font-medium transition border-b-2 ${
                        activeTab === 'all'
                            ? 'border-rose-500 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    전체
                </button>
                <button
                    onClick={() => setActiveTab('popular')}
                    className={`px-6 py-3 font-medium transition border-b-2 ${
                        activeTab === 'popular'
                            ? 'border-rose-500 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    인기 레시피
                </button>
                <button
                    onClick={() => setActiveTab('recent')}
                    className={`px-6 py-3 font-medium transition border-b-2 ${
                        activeTab === 'recent'
                            ? 'border-rose-500 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    최신 레시피
                </button>
            </div>

            {/* 결과 카운트 */}
            {!loading && (
                <div className="mb-6 text-gray-600">
                    <span className="font-medium text-rose-600">{filteredRecipes.length}</span>개의 레시피를 찾았습니다
                </div>
            )}

            {/* 레시피 그리드 */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-rose-500"></div>
                </div>
            ) : filteredRecipes.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-gray-500 bg-white/60 rounded-2xl backdrop-blur-sm shadow-sm">
                    <Wine className="w-20 h-20 mb-4 text-orange-200" />
                    <p className="text-xl font-medium text-gray-600">레시피가 없습니다</p>
                    <p className="mt-2 text-gray-500">
                        {hasActiveFilters ? '필터 조건에 맞는 레시피가 없습니다' : '첫 번째 레시피를 공유해보세요!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
