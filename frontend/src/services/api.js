import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: JWT 토큰을 헤더에 추가
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401 에러 시 토큰 제거
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken();
            // 로그인 페이지로 리다이렉트 (무한 루프 방지)
            if (window.location.pathname !== '/login') {
                window.location.href = '/login?from=' + encodeURIComponent(window.location.pathname);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
