# =========================
# Stage 1: Build the app
# =========================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml first so Docker can cache dependency downloads
COPY pom.xml .

RUN mvn -B dependency:go-offline

# Copy source code
COPY src ./src

# Build the JAR and copy runtime dependencies
RUN mvn -B clean package dependency:copy-dependencies -DincludeScope=runtime -DskipTests


# =========================
# Stage 2: Run the app
# =========================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root user for safer container execution
RUN addgroup -S marketplace && adduser -S marketplace -G marketplace

# Copy the app JAR
COPY --from=build /app/target/*.jar app.jar

# Copy dependency JARs
COPY --from=build /app/target/dependency ./lib

# Bridge server port
EXPOSE 8081

USER marketplace

# Run the Java main class
ENTRYPOINT ["java", "-cp", "app.jar:lib/*", "com.marketplace.bridge.Main"]