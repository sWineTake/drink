# Drink Project (음료 레시피 공유 플랫폼)
🔗 **[사이트 바로가기](https://drink-9no0tvu2h-cow-songs-projects.vercel.app/)**


## 프로젝트 구조

```
drink/
├── frontend/          # React 프론트엔드
├── backend/           # Spring Boot 마이크로서비스 백엔드
│   ├── gateway/       # API Gateway
│   ├── user-service/  # 사용자 서비스
│   ├── recipe-service/# 레시피 서비스
│   └── comment-service/# 댓글 서비스
└── README.md
```

---

## Frontend

### 기술 스택
| 기술 | 버전 |
|------|------|
| React | 19.2.0 |
| Vite | 7.2.4 |
| TailwindCSS | 3.4.19 |
| React Router | 7.12.0 |
| Axios | 1.13.2 |
| Lucide React | 0.562.0 |

### 디렉토리 구조
```
frontend/src/
├── components/    # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── services/      # API 서비스
├── utils/         # 유틸리티 함수
├── assets/        # 정적 리소스
├── App.jsx        # 메인 앱 컴포넌트
└── main.jsx       # 엔트리 포인트
```

### 실행 방법
```bash
cd frontend
npm install
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

---

## Backend

### 기술 스택
| 기술 | 버전 |
|------|------|
| Java | 17 |
| Spring Boot | 3.2.2 |
| Spring Cloud | 2023.0.0 |
| H2 Database | (개발용) |
| Lombok | - |

### 마이크로서비스 구성

#### 1. Gateway (API Gateway)
- **역할**: 모든 API 요청의 진입점, 라우팅 처리
- **주요 의존성**: Spring Cloud Gateway, Actuator

#### 2. User Service (사용자 서비스)
- **역할**: 사용자 인증 및 관리
- **주요 의존성**: Spring Web, JPA, Validation, H2

#### 3. Recipe Service (레시피 서비스)
- **역할**: 음료 레시피 CRUD 관리
- **주요 의존성**: Spring Web, JPA, Validation, H2

#### 4. Comment Service (댓글 서비스)
- **역할**: 레시피 댓글 관리
- **주요 의존성**: Spring Web, JPA, Validation, H2

### 실행 방법
```bash
cd backend
./gradlew build              # 전체 빌드
./gradlew :gateway:bootRun   # Gateway 실행
./gradlew :user-service:bootRun    # User Service 실행
./gradlew :recipe-service:bootRun  # Recipe Service 실행
./gradlew :comment-service:bootRun # Comment Service 실행
```

---

## Database (MySQL Docker)

### 데이터베이스 구성
각 마이크로서비스별로 독립된 MySQL 데이터베이스를 사용합니다.

| 서비스 | 컨테이너명 | 데이터베이스 | 포트 | 용도 |
|--------|-----------|-------------|------|------|
| User Service | user-mysql | user_db | 3306 | 사용자 정보, 인증 데이터 관리 |
| Recipe Service | recipe-mysql | recipe_db | 3307 | 음료 레시피 데이터 관리 |
| Comment Service | comment-mysql | comment_db | 3308 | 레시피 댓글 데이터 관리 |

### Docker 실행 방법

#### 전체 DB 실행
```bash
cd backend
docker-compose up -d
```

#### 개별 DB 실행
```bash
cd backend
# User DB만 실행
docker-compose up -d user-mysql

# Recipe DB만 실행
docker-compose up -d recipe-mysql

# Comment DB만 실행
docker-compose up -d comment-mysql
```

#### DB 중지
```bash
cd backend
# 전체 중지
docker-compose down

# 볼륨까지 삭제 (데이터 초기화)
docker-compose down -v
```

### 접속 정보

#### User MySQL (사용자 서비스용)
- **Host**: localhost
- **Port**: 3306
- **Database**: user_db
- **User**: user
- **Password**: user1234

#### Recipe MySQL (레시피 서비스용)
- **Host**: localhost
- **Port**: 3307
- **Database**: recipe_db
- **User**: recipe
- **Password**: recipe1234

#### Comment MySQL (댓글 서비스용)
- **Host**: localhost
- **Port**: 3308
- **Database**: comment_db
- **User**: comment
- **Password**: comment1234

---

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- Java 17+
- Gradle 8+
