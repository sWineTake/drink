import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Hash, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import CafeNameInput from '../components/CafeNameInput';
import { isAuthenticated } from '../utils/auth';

const CATEGORIES = ['커피', '에이드', '스무디', '밀크티', '차', '주스', '기타'];
const DIFFICULTIES = [
    { value: 'easy', label: '쉬움', color: 'green' },
    { value: 'medium', label: '보통', color: 'yellow' },
    { value: 'hard', label: '어려움', color: 'red' }
];

const AddRecipe = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cafeName: '',
        title: '',
        imageUrl: '',
        description: '',
        category: '',
        difficulty: 'easy',
        prepTime: '',
        tags: [],
        ingredients: [''], // 처음부터 1개 재료 입력 필드 표시
        steps: []
    });
    const [tagInput, setTagInput] = useState('');
    const [showOptional, setShowOptional] = useState(false);
    const [loading, setLoading] = useState(false);

    // JWT 토큰 체크
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login?from=/add');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (imageUrl) => {
        setFormData(prev => ({ ...prev, imageUrl }));
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, '']
        }));
    };

    const removeIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const updateIngredient = (index, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = value;
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [...prev.steps, '']
        }));
    };

    const removeStep = (index) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
        }));
    };

    const updateStep = (index, value) => {
        const newSteps = [...formData.steps];
        newSteps[index] = value;
        setFormData(prev => ({ ...prev, steps: newSteps }));
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().replace('#', '');
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                }));
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 필수 항목 검사
        if (!formData.cafeName) {
            alert('카페 이름을 입력해주세요.');
            return;
        }
        if (!formData.title) {
            alert('음료 이름을 입력해주세요.');
            return;
        }
        if (!formData.imageUrl) {
            alert('음료 이미지를 업로드해주세요.');
            return;
        }

        setLoading(true);
        try {
            // 백엔드 형식에 맞게 변환
            const recipeData = {
                ...formData,
                ingredients: formData.ingredients.filter(i => i.trim()).join('\n'),
                instructions: formData.steps.filter(s => s.trim()).join('\n')
            };
            await api.post('/recipes', recipeData);
            navigate('/');
        } catch (error) {
            console.error('Error creating recipe:', error);
            alert('레시피 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <button onClick={() => navigate(-1)} className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-6 font-medium transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                뒤로가기
            </button>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 border border-orange-100">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                        음료 레시피 공유하기
                    </h1>
                    <p className="text-gray-600">간단하게 3가지만 입력하면 끝!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 필수 입력 항목 */}
                    <div className="space-y-6">
                        {/* 1. 카페 이름 */}
                        <CafeNameInput
                            value={formData.cafeName}
                            onChange={(value) => setFormData(prev => ({ ...prev, cafeName: value }))}
                        />

                        {/* 2. 음료 이름 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                음료 이름 <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder="예: 딸기 스무디"
                                className="w-full px-4 py-3.5 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80 text-lg"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 3. 음료 이미지 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                음료 이미지 <span className="text-rose-500">*</span>
                            </label>
                            <ImageUpload onImageChange={handleImageChange} existingImageUrl={formData.imageUrl} />
                        </div>
                    </div>

                    {/* 선택 입력 항목 (아코디언) */}
                    <div className="border-t border-orange-200 pt-6">
                        <button
                            type="button"
                            onClick={() => setShowOptional(!showOptional)}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl hover:from-rose-100 hover:to-orange-100 transition"
                        >
                            <span className="font-semibold text-gray-700">더 자세히 작성하기</span>
                            {showOptional ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        {showOptional && (
                            <div className="mt-6 space-y-6 animate-fadeIn">
                                {/* 간단한 설명 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        간단한 설명 <span className="text-xs text-gray-500">(100자 이내 권장)</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        maxLength={100}
                                        placeholder="이 음료에 대한 간단한 설명을 작성해주세요"
                                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80 resize-none"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/100</p>
                                </div>

                                {/* 카테고리 & 난이도 & 준비 시간 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">카테고리</label>
                                        <select
                                            name="category"
                                            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="">선택하세요</option>
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">난이도</label>
                                        <select
                                            name="difficulty"
                                            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                            value={formData.difficulty}
                                            onChange={handleChange}
                                        >
                                            {DIFFICULTIES.map(diff => (
                                                <option key={diff.value} value={diff.value}>{diff.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">준비 시간 (분)</label>
                                        <input
                                            type="number"
                                            name="prepTime"
                                            placeholder="예: 10"
                                            min="1"
                                            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                            value={formData.prepTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* 태그 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">태그</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {formData.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 rounded-full text-sm font-medium"
                                            >
                                                <Hash className="w-3 h-3 mr-1" />
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-2 text-rose-600 hover:text-rose-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="태그를 입력하고 Enter (예: 달콤한, 시원한)"
                                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleAddTag}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 재료 */}
                    <div className="border-t border-orange-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-semibold text-gray-700">재료</label>
                        </div>
                        <div className="space-y-3">
                            {formData.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={ingredient}
                                        onChange={(e) => updateIngredient(index, e.target.value)}
                                        placeholder={`재료 ${index + 1} (예: 딸기 200g)`}
                                        className="flex-1 px-4 py-2.5 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                    />
                                    {/* 재료가 2개 이상일 때만 삭제 버튼 표시 */}
                                    {formData.ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                            className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="w-full py-2 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50/50 hover:bg-orange-50 transition flex items-center justify-center space-x-2"
                            >
                                <Plus className="w-5 h-5 text-orange-500" />
                                <span className="text-gray-700 font-medium">재료 추가</span>
                            </button>
                        </div>
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center px-6 py-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-8"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                공유 중...
                            </div>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                레시피 공유하기
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRecipe;
