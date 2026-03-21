# ----------- Build Spring Boot Backend -----------
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

# Download dependencies (cache layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build jar
RUN ./mvnw clean package -DskipTests


# ----------- Run Application -----------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy built jar
COPY --from=build /app/target/*.jar app.jar

# Security: non-root user
RUN useradd -m appuser
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
