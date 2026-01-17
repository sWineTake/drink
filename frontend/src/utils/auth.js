// JWT 토큰 관리 유틸리티

const TOKEN_KEY = 'auth_token';

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;
    
    // 토큰이 만료되었는지 간단히 체크 (실제로는 서버에서 검증해야 함)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
    } catch (error) {
        return false;
    }
};
