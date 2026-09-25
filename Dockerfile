# Builds the Ktor server (with the web frontend embedded) into a single container
# image, for hosts that run containers or a JVM (e.g. a Spaceship VPS).
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY . .
RUN ./gradlew --no-daemon :server:buildFatJar

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --no-create-home app
COPY --from=build /workspace/server/build/libs/organization-page-server.jar app.jar
USER app
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
