# 루트에서 아래 명령어 실행
# docker build -t user-service-spring-server -f infra/infra-study/drink/Dockerfile .

FROM eclipse-temurin:17-jdk

COPY backend/user-service/build/libs/user-service-1.0.0-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]
