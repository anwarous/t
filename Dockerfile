# syntax=docker/dockerfile:1.7

FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /workspace

COPY backend/pom.xml backend/pom.xml
RUN --mount=type=cache,target=/root/.m2 \
    mvn -f backend/pom.xml -B -DskipTests dependency:go-offline

COPY backend/src backend/src
RUN --mount=type=cache,target=/root/.m2 \
    mvn -f backend/pom.xml -B -DskipTests clean package

FROM eclipse-temurin:17-jre-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app && apk add --no-cache curl
WORKDIR /app

ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8081
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseContainerSupport"

COPY --from=build /workspace/backend/target/learningplusplus-api-1.0.0.jar /app/app.jar

USER app
EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=5 \
  CMD curl -fsS http://127.0.0.1:${SERVER_PORT}/actuator/health >/dev/null || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
