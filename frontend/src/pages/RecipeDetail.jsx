import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Clock, List, FileText, Heart, Share2, Bookmark, Hash, ChefHat } from 'lucide-react';

const DIFFICULTY_LABELS = {
    easy: { label: '쉬움', color: 'green' },
    medium: { label: '보통', color: 'yellow' },
    hard: { label: '어려움', color: 'red' }
};

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkedIngredients, setCheckedIngredients] = useState(new Set());
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`/recipes/${id}`);
                const recipeData = response.data;
                setRecipe(recipeData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recipe:', error);
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const toggleIngredient = (index) => {
        const newChecked = new Set(checkedIngredients);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedIngredients(newChecked);
    };

    // 레시피 데이터 파싱 (기존 형식과 새 형식 모두 지원)
    const getIngredients = () => {
        if (!recipe) return [];
        if (Array.isArray(recipe.ingredients)) {
            return recipe.ingredients;
        }
        return recipe.ingredients ? recipe.ingredients.split('\n').filter(i => i.trim()) : [];
    };

    const getSteps = () => {
        if (!recipe) return [];
        if (Array.isArray(recipe.steps)) {
            return recipe.steps;
        }
        // 기존 형식: instructions를 단계별로 분리
        if (recipe.instructions) {
            return recipe.instructions.split('\n')
                .filter(s => s.trim())
                .map((text, index) => ({ text: text.trim(), image: '' }));
        }
        return [];
    };

    const getImages = () => {
        if (!recipe) return [];
        const images = [];
        if (recipe.imageUrl) images.push(recipe.imageUrl);
        const steps = getSteps();
        steps.forEach(step => {
            if (step.image) images.push(step.image);
        });
        return images.length > 0 ? images : [recipe.imageUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-rose-500"></div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="container mx-auto px-4 py-8 text-center mt-20">
                <p className="text-xl text-gray-600">레시피를 찾을 수 없습니다</p>
            </div>
        );
    }

    const ingredients = getIngredients();
    const steps = getSteps();
    const images = getImages();
    const difficulty = DIFFICULTY_LABELS[recipe?.difficulty] || DIFFICULTY_LABELS.easy;

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Link to="/" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-6 font-medium transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                홈으로 돌아가기
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 좌측: 이미지 갤러리 */}
                <div className="space-y-4">
                    <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-2 border-orange-200 shadow-xl bg-gradient-to-br from-rose-100 to-orange-100">
                        <img
                            src={images[selectedImageIndex] || images[0]}
                            alt={recipe?.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                        selectedImageIndex === index
                                            ? 'border-rose-500 ring-2 ring-rose-200'
                                            : 'border-orange-200 hover:border-orange-300'
                                    }`}
                                >
                                    <img
                                        src={img}
                                        alt={`${recipe?.title} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 우측: 레시피 정보 */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {recipe?.title}
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            {recipe?.description}
                        </p>

                        {/* 메타 정보 */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {recipe?.category && (
                                <span className="px-4 py-2 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 rounded-full text-sm font-medium">
                                    {recipe.category}
                                </span>
                            )}
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                difficulty.color === 'green' ? 'bg-green-100 text-green-700' :
                                difficulty.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                <ChefHat className="w-4 h-4 inline mr-1" />
                                {difficulty.label}
                            </span>
                            {recipe?.prepTime && (
                                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {recipe.prepTime}분
                                </span>
                            )}
                            {recipe?.calories && (
                                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    {recipe.calories}kcal
                                </span>
                            )}
                        </div>

                        {/* 태그 */}
                        {recipe?.tags && recipe.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {recipe.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        <Hash className="w-3 h-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 액션 버튼 */}
                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl hover:from-rose-600 hover:to-orange-600 transition shadow-md">
                                <Heart className="w-5 h-5 mr-2" />
                                좋아요
                            </button>
                            <button className="flex-1 flex items-center justify-center px-4 py-3 bg-white border-2 border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 transition">
                                <Bookmark className="w-5 h-5 mr-2" />
                                저장
                            </button>
                            <button className="px-4 py-3 bg-white border-2 border-orange-200 text-gray-700 rounded-xl hover:bg-orange-50 transition">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RecipeDetail;
``