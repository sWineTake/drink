import React from 'react';
import { Plus, X } from 'lucide-react';

const DynamicIngredientInput = ({ ingredients, onChange }) => {
    const addIngredient = () => {
        onChange([...ingredients, '']);
    };

    const removeIngredient = (index) => {
        onChange(ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        onChange(newIngredients);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                    재료
                </label>
                <button
                    type="button"
                    onClick={addIngredient}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg hover:from-rose-600 hover:to-orange-600 transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>추가</span>
                </button>
            </div>

            {ingredients.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/50">
                    <p className="text-gray-500 mb-3">재료를 추가해주세요</p>
                    <button
                        type="button"
                        onClick={addIngredient}
                        className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg hover:from-rose-600 hover:to-orange-600 transition"
                    >
                        첫 번째 재료 추가
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {ingredients.map((ingredient, index) => (
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
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DynamicIngredientInput;
