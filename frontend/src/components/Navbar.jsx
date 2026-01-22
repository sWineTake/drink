import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wine, PlusCircle, User } from 'lucide-react';
import { isAuthenticated } from '../utils/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const loggedIn = isAuthenticated();

    const handleAddRecipeClick = (e) => {
        e.preventDefault();
        if (!loggedIn) {
            navigate('/login?from=/add');
        } else {
            navigate('/add');
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 text-rose-600 hover:text-rose-700 transition-colors">
                            <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-2 rounded-xl shadow-lg">
                                <Wine className="w-7 h-7 text-white" />
                            </div>
                            <span className="font-bold text-2xl bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">음료 레시피</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleAddRecipeClick}
                            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>레시피 공유하기</span>
                        </button>
                        {loggedIn ? (
                            <Link
                                to="/mypage"
                                className="flex items-center space-x-2 px-4 py-3 rounded-xl border-2 border-orange-200 text-gray-700 hover:bg-orange-50 transition-all font-medium"
                            >
                                <User className="w-5 h-5" />
                                <span>마이페이지</span>
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 px-4 py-3 rounded-xl border-2 border-orange-200 text-gray-700 hover:bg-orange-50 transition-all font-medium"
                            >
                                <User className="w-5 h-5" />
                                <span>로그인</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
