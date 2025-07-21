# Base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

# Set workdir to project folder
WORKDIR /src/Backend/Cast-Stone-api

# Copy only the project folder contents
COPY Backend/Cast-Stone-api/ ./

# Restore, build, publish
RUN dotnet restore "Cast-Stone-api.csproj"
RUN dotnet build "Cast-Stone-api.csproj" -c $BUILD_CONFIGURATION -o /app/build
RUN dotnet publish "Cast-Stone-api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Cast-Stone-api.dll"]
