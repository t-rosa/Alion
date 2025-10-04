# Alion Copilot Instructions

## Architecture Overview

Full-stack .NET + React template with **vertical slice architecture** (not layered):

- **Server**: ASP.NET Core 9.0 with EF Core, Identity, FluentValidation, OpenTelemetry
- **Client**: React 19 + TypeScript with TanStack Router/Query, Vite, Tailwind + shadcn/ui
- **Communication**: Type-safe API via `openapi-typescript` auto-generated schemas from OpenAPI spec
- **Database**: PostgreSQL with snake_case naming convention (via `UseSnakeCaseNamingConvention()`)
- **Auth**: ASP.NET Identity with role-based authorization (Admin/Member/User roles)

## Module Organization (Vertical Slices)

Both client and server follow **feature-based modules**, not layered architecture:

### Server (`Alion.Server/Modules/`)

Each module contains its complete feature: Controller, DTOs, Validators, Entity

```
WeatherForecasts/
  ├── WeatherForecast.cs          # Entity (added to ApplicationDbContext as DbSet)
  ├── WeatherForecastsController.cs
  └── Dtos/
      ├── CreateWeatherForecastRequest.cs  # record with inline FluentValidation validator
      └── GetWeatherForecastResponse.cs
```

### Client (`Alion.Client/src/modules/`)

Each module contains views, components, and business logic (NOT routes - those go in `src/routes/`):

```
app/forecasts/
  ├── forecasts.view.tsx          # Main view component (imported in route file)
  ├── create-forecast/
  │   └── create-forecast.view.tsx
  └── forecast-actions/
      └── forecast-actions.view.tsx
```

## Critical Workflows

### API Contract Generation

**MUST run after ANY backend changes to sync types:**

```bash
cd Alion.Client
npm run openapi  # Generates src/lib/api/schema.ts from Alion.Server/obj/Alion.Server.json
```

This generates TypeScript types from OpenAPI spec. Frontend will not compile without this.

### Database Migrations

```bash
cd Alion.Server
dotnet ef migrations add MigrationName
```

Migrations auto-apply in Development via `Program.cs: context.Database.Migrate()`.
Production requires manual migration or startup auto-apply.

### Environment Setup (Required First Time)

```bash
docker compose up -d  # Starts PostgreSQL (5432) + Aspire Dashboard (18888)
cd Alion.Server
dotnet user-secrets set "ADMIN_EMAIL" "admin@example.com"
dotnet user-secrets set "ADMIN_PASSWORD" "SecurePass123!"
dotnet user-secrets set "CONNECTION_STRING" "Host=localhost;Port=5432;Username=postgres;Password=postgres;Database=alion;"
dotnet user-secrets set "SMTP_USERNAME" "your-smtp-user"
dotnet user-secrets set "SMTP_PASSWORD" "your-smtp-pass"
dotnet user-secrets set "OTEL_API_KEY" "768ba790-4261-4b9f-91d9-0fc21838463c"
```

### Build & Run

```bash
# Development (separate processes - RECOMMENDED)
docker compose up -d              # Starts PostgreSQL + telemetry
dotnet run --project Alion.Server  # Server on https://localhost:7000
cd Alion.Client && npm run dev     # Client dev server, proxies /api to server

# Production build (builds client into server's wwwroot)
dotnet publish Alion.Server -o Alion.Server/bin/Production

# Production preview (Docker container)
rm -rf Alion.Server/bin/Production/ && dotnet publish Alion.Server -t:PublishContainer -p ContainerArchiveOutputPath=../designer.tar.gz
docker load < designer.tar.gz
# Uncomment "alion-preview" service in compose.yaml, then:
docker compose up -d
# Access at http://localhost:3000
```

### Testing

```bash
# Server: XUnit integration tests with Testcontainers (PostgreSQL on port 5555)
dotnet test Alion.Tests

# Client: Playwright E2E with UI mode
cd Alion.Client && npm run test:e2e
```

## Key Patterns

### Server Conventions

**Controllers**: Always in module root, inherit `ControllerBase`, use `[Authorize]` by default (add `[AllowAnonymous]` per endpoint if needed)

```csharp
[ApiController]
[Route("api/weather-forecasts")]  // Always kebab-case
[Authorize]
public class WeatherForecastsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    // DI via constructor
    public WeatherForecastsController(ApplicationDbContext context, UserManager<User> userManager)

    // Get current user pattern
    var user = await _userManager.GetUserAsync(HttpContext.User);
    if (user is null) return Unauthorized();

    // Query with user scoping
    var data = _context.WeatherForecasts.Where(e => e.UserId == user.Id);
}
```

**DTOs**: Use records with inline FluentValidation validators in same file

```csharp
public record CreateWeatherForecastRequest(int TemperatureC, string? Summary)
{
    public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
}

public class CreateWeatherForecastRequestValidator : AbstractValidator<CreateWeatherForecastRequest>
{
    public CreateWeatherForecastRequestValidator()
    {
        RuleFor(e => e.Date).NotEmpty().WithMessage("La date doit être renseignée.");
    }
}
```

Inject validator: `[FromServices] IValidator<CreateWeatherForecastRequest> validator`

**DbContext**: Entities added as `internal DbSet<T>` properties in `ApplicationDbContext.cs`

```csharp
public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    internal DbSet<WeatherForecast> WeatherForecasts { get; set; }
}
```

**Seeding**: `SeedData.cs` runs on startup, creates roles (Admin/Member/User) and admin user from secrets.

**OpenTelemetry**: Configured in `Program.cs` with Aspire Dashboard (localhost:18888), exports to OTLP endpoint with API key from secrets.

### Client Conventions

**API Calls**: Use `$api` from `@/lib/api/client.ts` - wraps openapi-fetch with TanStack Query

```tsx
// Queries (GET)
const { data } = $api.useSuspenseQuery("get", "/api/weather-forecasts");

// Mutations (POST/PUT/DELETE) - always invalidate queries on success
const { mutate } = $api.useMutation("post", "/api/weather-forecasts", {
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["get", "/api/weather-forecasts"],
    });
  },
});

// Query options for loaders
$api.queryOptions("get", "/api/weather-forecasts");
```

**Routing**: File-based via `@tanstack/router` - routes in `src/routes/`, auto-generates `routeTree.gen.ts`

- `_app/*` = authenticated routes (requires login)
- `_auth/*` = authentication pages (login, register, forgot-password, reset-password)
- `_marketing/*` = public marketing pages
- `admin/*` = admin-only pages

```tsx
// src/routes/_app/forecasts/index.tsx
export const Route = createFileRoute("/_app/forecasts/")({
  loader({ context }) {
    // Prefetch data for route
    return context.queryClient.ensureQueryData(
      $api.queryOptions("get", "/api/weather-forecasts")
    );
  },
  component: ForecastsView, // Import from src/modules/app/forecasts/forecasts.view.tsx
});
```

**Modules vs Routes**:

- `src/routes/` = route definitions (loader + component reference)
- `src/modules/` = view components and feature logic (imported by routes)

**Components**: shadcn/ui in `src/components/ui/`, use CVA for variants. Import via `@/` alias.
Add new components: `npx shadcn@latest add [component]` (configured via `components.json`)

**Types**: Reference OpenAPI schemas: `components["schemas"]["GetWeatherForecastResponse"]`

**Vite Proxy**: Dev client proxies `/api` to server (see `vite.config.ts`). HTTPS certs auto-generated via `dotnet dev-certs`.

## Configuration

### Server Secrets (Development)

```bash
cd Alion.Server
dotnet user-secrets set "ADMIN_EMAIL" "admin@example.com"
dotnet user-secrets set "ADMIN_PASSWORD" "SecurePass123!"
dotnet user-secrets set "CONNECTION_STRING" "Host=localhost;Port=5432;Username=postgres;Password=postgres;Database=alion;"
dotnet user-secrets set "SMTP_USERNAME" "your-smtp-user"
dotnet user-secrets set "SMTP_PASSWORD" "your-smtp-pass"
dotnet user-secrets set "OTEL_API_KEY" "768ba790-4261-4b9f-91d9-0fc21838463c"
```

### Docker Services (compose.yaml)

- **PostgreSQL**: `localhost:5432` (alion-db) - persistent volume `alion-db-data`
- **Aspire Dashboard**: `localhost:18888` (alion-telemetry) - OpenTelemetry UI with OTLP endpoint on 4317
- **Preview** (commented): `localhost:3000` (alion-preview) - production container preview

## Project Structure Notes

- **Modules/Auth**: `AuthController` - Identity endpoints (register/login/logout/forgotPassword) wrapping ASP.NET Identity
- **Modules/Users**: User management, `User` extends `IdentityUser<Guid>`, `UsersController` (note typo: `UersController.cs`)
- **Modules/Email**: `EmailSender` implementing `IEmailSender` with SMTP configuration via `SmtpOptions`
- **Integration Tests**: `BaseFactory` uses Testcontainers PostgreSQL on port 5555, inherits `WebApplicationFactory<Program>`
- **Client routing**: `_app` = authenticated, `_auth` = auth pages, `_marketing` = public, `admin` = admin-only
- **Data protection keys**: Persisted to `./keys/storage` in Development (see `Program.cs`)

## Common Tasks

**Add new feature (full vertical slice):**

1. **Server**: Create `Alion.Server/Modules/FeatureName/`
   - Add entity class (e.g., `Feature.cs`)
   - Add controller (e.g., `FeaturesController.cs`) with `[ApiController]`, `[Route("api/features")]`, `[Authorize]`
   - Add DTOs in `Dtos/` folder with FluentValidation validators
   - Register entity in `ApplicationDbContext.cs` as `internal DbSet<Feature> Features { get; set; }`
   - Create migration: `cd Alion.Server && dotnet ef migrations add AddFeature`
2. **Sync types**: `cd Alion.Client && npm run openapi`
3. **Client**: Create `Alion.Client/src/modules/app/feature/`
   - Add view component (e.g., `features.view.tsx`)
   - Create route in `src/routes/_app/feature/index.tsx` with loader and component reference
4. **Test**:
   - Server: Add `FeaturesControllerTests.cs` in `Alion.Tests/Modules/Feature/`
   - Client: Add E2E test in `Alion.Client/tests/e2e/`

**Update UI component:**
`npx shadcn@latest add [component]` (configured via `components.json`)

**Debug full stack:**
Use VSCode compound launch config: Server (.NET) + Client (npm) + Browser (Edge/Chrome) - see README.

**Verify OpenAPI spec:**
After server changes, check `Alion.Server/obj/Alion.Server.json` - this is the source for frontend type generation.
