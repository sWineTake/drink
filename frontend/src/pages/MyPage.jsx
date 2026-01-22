import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, BookOpen, Settings, ChevronRight } from 'lucide-react';
import { isAuthenticated, removeToken, getToken } from '../utils/auth';
import api from '../services/api';

const MyPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('recipes');
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login?from=/mypage');
            return;
        }
        fetchUserInfo();
        fetchMyRecipes();
    }, [navigate]);

    const fetchUserInfo = async () => {
        try {
            const token = getToken();
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserInfo({
                    email: payload.email || payload.sub,
                    nickname: payload.nickname || payload.name || '사용자'
                });
            }
        } catch (error) {
            console.error('Failed to parse token:', error);
        }
    };

    const fetchMyRecipes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/recipes/my');
            if (response.data.code === 200) {
                setMyRecipes(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            removeToken();
            navigate('/');
        }
    };

    const menuItems = [
        { id: 'recipes', label: '내가 만든 레시피', icon: BookOpen },
        { id: 'profile', label: '내 정보 관리', icon: Settings },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    마이페이지
                </h1>
                {userInfo && (
                    <p className="text-gray-600 mt-2">
                        안녕하세요, <span className="font-semibold text-gray-800">{userInfo.nickname}</span>님
                    </p>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* 사이드 메뉴 */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
                                    activeTab === item.id
                                        ? 'bg-gradient-to-r from-rose-50 to-orange-50 text-rose-600 border-l-4 border-rose-500'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-5 py-4 text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
                            <div className="flex items-center space-x-3">
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">로그아웃</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="flex-1">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-6">
                        {activeTab === 'recipes' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">내가 만든 레시피</h2>
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent"></div>
                                    </div>
                                ) : myRecipes.length > 0 ? (
                                    <div className="grid gap-4">
                                        {myRecipes.map((recipe) => (
                                            <Link
                                                key={recipe.id}
                                                to={`/recipe/${recipe.id}`}
                                                className="flex items-center p-4 rounded-xl border border-orange-100 hover:bg-orange-50 transition-colors"
                                            >
                                                {recipe.imageUrl && (
                                                    <img
                                                        src={recipe.imageUrl}
                                                        alt={recipe.title}
                                                        className="w-16 h-16 rounded-lg object-cover mr-4"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800">{recipe.title}</h3>
                                                    <p className="text-sm text-gray-500">{recipe.cafeName || '직접 만든 레시피'}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-4">아직 등록한 레시피가 없습니다.</p>
                                        <Link
                                            to="/add"
                                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl hover:from-rose-600 hover:to-orange-600 transition-all font-medium"
                                        >
                                            첫 레시피 등록하기
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-6">내 정보 관리</h2>
                                {userInfo && (
                                    <div className="space-y-4">
                                        <div className="flex items-center p-4 rounded-xl bg-gray-50">
                                            <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-3 rounded-full mr-4">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">닉네임</p>
                                                <p className="font-semibold text-gray-800">{userInfo.nickname}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center p-4 rounded-xl bg-gray-50">
                                            <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-3 rounded-full mr-4">
                                                <Settings className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">이메일</p>
                                                <p className="font-semibold text-gray-800">{userInfo.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;