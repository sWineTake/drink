import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Store } from 'lucide-react';

const CAFE_NAMES = [
    '스타벅스',
    '메가커피',
    '투썸플레이스',
    '컴포즈커피',
    '이디야커피',
    '할리스커피',
    '탐앤탐스',
    '카페베네',
    '빽다방',
    '엔젤리너스',
    '카페드롭탑',
    '더벤티',
    '기타'
];

const CafeNameInput = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCafes = CAFE_NAMES.filter(cafe =>
        cafe.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (cafe) => {
        onChange(cafe);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                카페 이름 <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-3.5 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80 flex items-center justify-between text-left"
                >
                    <div className="flex items-center">
                        <Store className="w-5 h-5 text-orange-500 mr-2" />
                        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                            {value || '카페를 선택하거나 입력하세요'}
                        </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-orange-200 rounded-xl shadow-xl max-h-60 overflow-auto">
                        <div className="p-2 border-b border-orange-100">
                            <input
                                type="text"
                                placeholder="검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="py-1">
                            {filteredCafes.map((cafe) => (
                                <button
                                    key={cafe}
                                    type="button"
                                    onClick={() => handleSelect(cafe)}
                                    className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition ${
                                        value === cafe ? 'bg-rose-50 text-rose-700 font-medium' : 'text-gray-700'
                                    }`}
                                >
                                    {cafe}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {value && (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                    placeholder="또는 직접 입력"
                />
            )}
        </div>
    );
};

export default CafeNameInput;
