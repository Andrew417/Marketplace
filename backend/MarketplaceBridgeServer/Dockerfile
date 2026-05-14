# =========================
# Stage 1: Build the app
# =========================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY MarketplaceBridgeServer/pom.xml .

RUN mvn -B dependency:go-offline

COPY MarketplaceBridgeServer/src ./src

RUN mvn -B clean package dependency:copy-dependencies -DincludeScope=runtime -DskipTests


# =========================
# Stage 2: Run the app
# =========================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S marketplace && adduser -S marketplace -G marketplace

COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/target/dependency ./lib

EXPOSE 8081

USER marketplace

ENTRYPOINT ["java", "-cp", "app.jar:lib/*", "com.marketplace.bridge.Main"]