# Use a base image with Java runtime environment
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file into the container
COPY ./target/wheesh-0.0.1-SNAPSHOT.jar app.jar

# Copy the src/main/resources/ directory into the container
COPY src/main/resources/ /app/resources/

# Create the images directory if it doesn't exist and copy files from backup to images
RUN mkdir -p /app/resources/images && \
    cp -r /app/resources/backup/* /app/resources/images/

# Expose the port the application runs on
EXPOSE 8080

# Command to run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]