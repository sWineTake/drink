import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // 에러 메시지 초기화
    };

    const validateForm = () => {
        if (!formData.email) {
            setError('이메일을 입력해주세요.');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('올바른 이메일 형식이 아닙니다.');
            return false;
        }
        if (!formData.password) {
            setError('비밀번호를 입력해주세요.');
            return false;
        }
        if (formData.password.length < 4) {
            setError('비밀번호는 최소 4자 이상이어야 합니다.');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return false;
        }
        if (!formData.nickname) {
            setError('닉네임을 입력해주세요.');
            return false;
        }
        if (formData.nickname.length < 2 || formData.nickname.length > 20) {
            setError('닉네임은 2~20자여야 합니다.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 백엔드 API 호출
            await axios.post('http://localhost:8080/api/users', {
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname
            });

            alert('회원가입이 완료되었습니다!');
            navigate('/');
        } catch (error) {
            console.error('Signup error:', error);
            setError(error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
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
                            회원가입
                        </h1>
                        <p className="text-gray-600">음료 레시피를 공유하고 탐색해보세요</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 닉네임 (필수) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                닉네임 <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="nickname"
                                    required
                                    placeholder="닉네임을 입력하세요 (2~20자)"
                                    className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

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
                                    placeholder="최소 4자 이상"
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

                        {/* 비밀번호 확인 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                비밀번호 확인 <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    placeholder="비밀번호를 다시 입력하세요"
                                    className="w-full pl-12 pr-12 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition bg-white/80"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* 에러 메시지 */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* 회원가입 버튼 */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    가입 중...
                                </div>
                            ) : (
                                '회원가입'
                            )}
                        </button>

                        {/* 로그인 링크 */}
                        <div className="text-center pt-4">
                            <p className="text-gray-600 text-sm">
                                이미 계정이 있으신가요?{' '}
                                <Link to="/login" className="text-rose-600 hover:text-rose-700 font-semibold">
                                    로그인
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
