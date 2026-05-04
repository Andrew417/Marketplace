# =========================
# Stage 1: Build the app
# =========================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copy SharedModels first because SocketServer depends on it
COPY MarketplaceSharedModels/pom.xml MarketplaceSharedModels/pom.xml
COPY MarketplaceSharedModels/src MarketplaceSharedModels/src

# Install SharedModels into the local Maven repository inside the build container
RUN mvn -B -f MarketplaceSharedModels/pom.xml clean install -DskipTests

# Copy SocketServer pom first
COPY MarketplaceSocketServer/pom.xml MarketplaceSocketServer/pom.xml

# Download SocketServer dependencies after SharedModels is installed
RUN mvn -B -f MarketplaceSocketServer/pom.xml dependency:go-offline

# Copy SocketServer source code
COPY MarketplaceSocketServer/src MarketplaceSocketServer/src

# Build SocketServer and copy runtime dependencies
RUN mvn -B -f MarketplaceSocketServer/pom.xml clean package dependency:copy-dependencies -DincludeScope=runtime -DskipTests


# =========================
# Stage 2: Run the app
# =========================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -S marketplace && adduser -S marketplace -G marketplace

# Copy SocketServer JAR
COPY --from=build /workspace/MarketplaceSocketServer/target/*.jar app.jar

# Copy runtime dependencies
COPY --from=build /workspace/MarketplaceSocketServer/target/dependency ./lib

# Socket server port
EXPOSE 9000

USER marketplace

# If your Main.java has no package, use "Main"
ENTRYPOINT ["java", "-cp", "app.jar:lib/*", "Main"]