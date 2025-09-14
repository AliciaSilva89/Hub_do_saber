# Use uma imagem Maven com OpenJDK 21 para build
FROM maven:3.9-eclipse-temurin-21 AS build

# Definir diretório de trabalho
WORKDIR /app

# Definir variáveis de ambiente para encoding
ENV MAVEN_OPTS="-Dfile.encoding=UTF-8"

# Copiar pom.xml e baixar dependências primeiro (para cache)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src src

# Compilar aplicação com encoding explícito
RUN mvn clean package -DskipTests -Dproject.build.sourceEncoding=UTF-8

# Use OpenJDK 21 runtime para execução
FROM eclipse-temurin:21-jre-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar JAR da etapa de build
COPY --from=build /app/target/Hub_do_Saber-0.0.1-SNAPSHOT.jar app.jar

# Expor porta da aplicação
EXPOSE 8080

# Comando para executar a aplicação
CMD ["java", "-jar", "app.jar"]
