# Cast Stone - Monolithic Application Structure

This project follows a monolithic architecture with a .NET Web API backend and Next.js TypeScript frontend.

## Project Structure

```
cast-stonev2/
├── Backend/
│   └── Cast-Stone-api/
│       ├── Configuration/
│       │   └── MongoDbSettings.cs
│       ├── Controllers/
│       │   └── UsersController.cs
│       ├── Domain/
│       │   └── Models/
│       │       ├── BaseEntity.cs
│       │       └── User.cs
│       ├── DTOs/
│       │   ├── Request/
│       │   │   ├── CreateUserRequest.cs
│       │   │   └── UpdateUserRequest.cs
│       │   └── Response/
│       │       ├── ApiResponse.cs
│       │       └── UserResponse.cs
│       ├── Repositories/
│       │   ├── Interfaces/
│       │   │   ├── IBaseRepository.cs
│       │   │   └── IUserRepository.cs
│       │   └── Implementations/
│       │       ├── BaseRepository.cs
│       │       └── UserRepository.cs
│       ├── Services/
│       │   ├── Interfaces/
│       │   │   └── IUserService.cs
│       │   └── Implementations/
│       │       └── UserService.cs
│       ├── Program.cs
│       ├── appsettings.json
│       └── appsettings.Development.json
└── Frontend/
    └── cast-stone-frontend/
        └── src/
            ├── app/
            │   ├── about/
            │   │   └── page.tsx
            │   ├── contact/
            │   │   └── page.tsx
            │   ├── users/
            │   │   └── page.tsx
            │   ├── layout.tsx
            │   ├── page.tsx
            │   └── globals.css
            ├── components/
            │   ├── Home/
            │   │   ├── HeroSection/
            │   │   │   ├── HeroSection.tsx
            │   │   │   └── heroSection.module.css
            │   │   ├── FeaturesSection/
            │   │   │   ├── FeaturesSection.tsx
            │   │   │   └── featuresSection.module.css
            │   │   ├── HomeComponent.tsx
            │   │   └── homeComponent.module.css
            │   ├── Users/
            │   │   └── UsersList/
            │   │       ├── UsersList.tsx
            │   │       └── usersList.module.css
            │   └── shared/
            │       ├── Header/
            │       │   ├── Header.tsx
            │       │   └── header.module.css
            │       └── Footer/
            │           ├── Footer.tsx
            │           └── footer.module.css
            ├── services/
            │   └── api.ts
            └── types/
                └── index.ts
```

## Architecture Patterns

### Backend (.NET 8 Web API)

- **Controller-Service-Repository Pattern**: Clean separation of concerns
- **Domain Models**: Entity classes with MongoDB attributes
- **DTOs**: Request/Response data transfer objects
- **Dependency Injection**: Configured in Program.cs
- **MongoDB Integration**: Using MongoDB.Driver for database operations
- **Swagger Documentation**: Configured with detailed API documentation

### Frontend (Next.js 14 with TypeScript)

- **App Router**: Modern Next.js routing system
- **Component-Based Architecture**: Reusable, modular components
- **CSS Modules**: Scoped styling for each component
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **API Service Layer**: Centralized API communication

## Key Features

### Backend Features
- RESTful API endpoints
- MongoDB integration with clean repository pattern
- Comprehensive error handling
- Input validation with data annotations
- Soft delete functionality
- CORS configuration for frontend integration
- Swagger UI for API documentation

### Frontend Features
- Server-side rendering with Next.js
- Responsive design with Tailwind CSS
- Component-based UI architecture
- Type-safe API integration
- Modern React patterns with hooks
- Modular CSS with CSS Modules

## Getting Started

### Backend Setup
1. Navigate to `Backend/Cast-Stone-api`
2. Run `dotnet restore` to install dependencies
3. Update MongoDB connection string in `appsettings.json`
4. Run `dotnet run` to start the API server
5. Access Swagger UI at `https://localhost:7000`

### Frontend Setup
1. Navigate to `Frontend/cast-stone-frontend`
2. Run `npm install` to install dependencies
3. Update API URL in environment variables if needed
4. Run `npm run dev` to start the development server
5. Access the application at `http://localhost:3000`

## Database Configuration

The application uses MongoDB with the following configuration:
- Connection String: `mongodb://localhost:27017` (configurable)
- Database Name: `CastStoneDb` (production) / `CastStoneDb_Dev` (development)
- Collections: Automatically created based on entity models

## API Endpoints

### Users API
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/email/{email}` - Get user by email
- `GET /api/users/active` - Get active users
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (soft delete)

## Component Structure

Each component follows this structure:
- `ComponentName.tsx` - Main component file
- `componentName.module.css` - Scoped styles
- Components are organized by feature/page

## Development Guidelines

1. **Backend**: Follow SOLID principles and clean architecture
2. **Frontend**: Use TypeScript for type safety
3. **Styling**: Use Tailwind CSS with CSS Modules for component-specific styles
4. **API**: Always use the service layer for API calls
5. **Error Handling**: Implement proper error boundaries and user feedback
6. **Testing**: Write unit tests for both backend and frontend components

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://localhost:7000/api
```

### Backend (appsettings.json)
```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "CastStoneDb"
  }
}
```
