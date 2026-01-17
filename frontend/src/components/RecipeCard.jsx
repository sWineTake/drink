import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChefHat, Hash } from 'lucide-react';

const DIFFICULTY_LABELS = {
    easy: { label: '쉬움', color: 'green' },
    medium: { label: '보통', color: 'yellow' },
    hard: { label: '어려움', color: 'red' }
};

const RecipeCard = ({ recipe }) => {
    const difficulty = DIFFICULTY_LABELS[recipe?.difficulty] || DIFFICULTY_LABELS.easy;

    return (
        <Link to={`/recipe/${recipe.id}`}>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 group cursor-pointer">
                {/* 이미지 */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-rose-100 to-orange-100">
                    <img
                        src={recipe.imageUrl || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                        alt={recipe.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* 카테고리 배지 */}
                    {recipe.category && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-rose-700">
                            {recipe.category}
                        </div>
                    )}
                </div>

                {/* 내용 */}
                <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {recipe.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4 text-sm leading-relaxed">
                        {recipe.description}
                    </p>

                    {/* 메타 정보 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.difficulty && (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                difficulty.color === 'green' ? 'bg-green-100 text-green-700' :
                                difficulty.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                <ChefHat className="w-3 h-3 mr-1" />
                                {difficulty.label}
                            </span>
                        )}
                        {recipe.prepTime && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                <Clock className="w-3 h-3 mr-1" />
                                {recipe.prepTime}분
                            </span>
                        )}
                        {recipe.calories && (
                            <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {recipe.calories}kcal
                            </span>
                        )}
                    </div>

                    {/* 태그 */}
                    {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {recipe.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                                >
                                    <Hash className="w-2.5 h-2.5 mr-0.5" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 버튼 */}
                    <div className="pt-2 border-t border-orange-100">
                        <span className="text-rose-600 font-medium text-sm group-hover:text-rose-700 transition-colors">
                            레시피 보기 →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
