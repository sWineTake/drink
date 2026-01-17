import React from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

const StepInput = ({ steps, onChange }) => {
    const addStep = () => {
        onChange([...steps, { text: '', image: '' }]);
    };

    const removeStep = (index) => {
        onChange(steps.filter((_, i) => i !== index));
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        onChange(newSteps);
    };

    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateStep(index, 'image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                    만드는 방법
                </label>
                <button
                    type="button"
                    onClick={addStep}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg hover:from-rose-600 hover:to-orange-600 transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>단계 추가</span>
                </button>
            </div>

            {steps.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/50">
                    <p className="text-gray-500 mb-3">만드는 방법을 추가해주세요</p>
                    <button
                        type="button"
                        onClick={addStep}
                        className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg hover:from-rose-600 hover:to-orange-600 transition"
                    >
                        첫 번째 단계 추가
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-5 border border-orange-200">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                                    {index + 1}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <textarea
                                        value={step.text}
                                        onChange={(e) => updateStep(index, 'text', e.target.value)}
                                        placeholder={`${index + 1}단계: 설명을 입력하세요`}
                                        rows="3"
                                        className="w-full px-4 py-2.5 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white resize-none"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <label className="flex items-center space-x-2 px-3 py-2 border-2 border-orange-200 rounded-lg cursor-pointer hover:bg-white transition">
                                            <ImageIcon className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm text-gray-700">사진 추가</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(index, e)}
                                                className="hidden"
                                            />
                                        </label>
                                        {step.image && (
                                            <div className="relative">
                                                <img src={step.image} alt={`Step ${index + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => updateStep(index, 'image', '')}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StepInput;
