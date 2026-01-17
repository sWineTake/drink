import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { setToken } from '../utils/auth';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // 에러 메시지 초기화
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 백엔드 API 호출 (실제 엔드포인트에 맞게 수정 필요)
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });
            
            // JWT 토큰 저장
            if (response.data.token) {
                setToken(response.data.token);
            } else if (response.data.accessToken) {
                setToken(response.data.accessToken);
            }
            
            // 이전 페이지로 리다이렉트 또는 홈으로
            const from = new URLSearchParams(window.location.search).get('from') || '/';
            navigate(from);
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <Link to="/" className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-6 font-medium transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    홈으로
                </Link>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 border border-orange-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                            로그인
                        </h1>
                        <p className="text-gray-600">음료 레시피를 공유하고 탐색해보세요</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 이메일 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                이메일 <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                비밀번호 <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    placeholder="비밀번호를 입력하세요"
                                    className="w-full pl-12 pr-12 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* 에러 메시지 */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    로그인 중...
                                </div>
                            ) : (
                                '로그인'
                            )}
                        </button>

                        {/* 회원가입 링크 */}
                        <div className="text-center pt-4 space-y-2">
                            <p className="text-gray-600 text-sm">
                                계정이 없으신가요?{' '}
                                <Link to="/signup" className="text-rose-600 hover:text-rose-700 font-semibold">
                                    회원가입
                                </Link>
                            </p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-orange-200 rounded-xl hover:bg-orange-50 transition font-medium text-gray-700"
                            >
                                회원가입 바로가기
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
