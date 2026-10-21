# Use a minimal official OpenJDK image
FROM azul/zulu-openjdk:21-jre-headless

# Create a non-root user
RUN useradd -ms /bin/bash springuser

# Set the working directory
WORKDIR /app

# Copy the JAR file into the container
COPY --chown=springuser:springuser target/app.jar app.jar

# Switch to the non-root user
USER springuser

# Expose app's port
EXPOSE 8800

# Run the app with some sane default JVM memory settings
ENTRYPOINT ["java", "-Xms16m", "-Xmx64m", "-XX:MaxMetaspaceSize=64m", "-Xss256k", "-jar", "app.jar"]
