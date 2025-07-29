# Usa uma imagem base oficial do OpenJDK 21, versão slim para menor tamanho
FROM openjdk:21-jdk-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o JAR executável da sua aplicação (gerado pelo Maven/Gradle)
# para dentro do contêiner, renomeando-o para app.jar
# Certifique-se de que o caminho 'target/Hub_do_Saber-0.0.1-SNAPSHOT.jar'
# está correto e que o JAR foi construído antes de construir a imagem Docker.
COPY target/Hub_do_Saber-0.0.1-SNAPSHOT.jar app.jar

# Informa ao Docker/Podman que o contêiner escuta na porta 8080
# (Esta é uma instrução de documentação; o mapeamento real da porta é feito no docker-compose.yml)
EXPOSE 8080

# Define o comando que será executado quando o contêiner for iniciado
# para rodar a aplicação Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
