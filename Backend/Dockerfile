# ----------- Stage 1: Build React Frontend -----------
FROM node:18 AS frontend-build

WORKDIR /app/frontend

# Copy only required files
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/src ./src
COPY frontend/public ./public

RUN npm run build


# ----------- Stage 2: Build Spring Boot Backend -----------
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build

WORKDIR /app

# Copy only required Maven files
COPY Backend/pom.xml ./
COPY Backend/.mvn .mvn
COPY Backend/mvnw ./
RUN chmod +x mvnw

# Download dependencies (cache layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY Backend/src ./src

# Copy frontend build into static resources
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static

# Build jar
RUN ./mvnw clean package -DskipTests


# ----------- Stage 3: Run Application -----------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy only the built jar
COPY --from=backend-build /app/target/*.jar app.jar

# Use non-root user for security
RUN useradd -m appuser
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
