# React Template

## How to use this template?

1. Install the template

```bash
dotnet new install .
```

2. Create a new project (don't forget the --title)

```bash
dotnet new full-stack-react -o MyProject --title my-project
```

3. Remove this "how to use this template" section inside the README.md

## Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org)
- [.NET](https://dotnet.microsoft.com/en-us/download)
  - Tools .NET
    - [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

### Recommended

- [GitHub CLI](https://cli.github.com/)
- [pgAdmin](https://www.pgadmin.org/)

## Getting started

1. Launch the database

```bash
docker compose up -d
```

2. Set environment variables

```bash
# From ./Alion.Server/
dotnet user-secrets set "SMTP_USERNAME" "value"
dotnet user-secrets set "SMTP_PASSWORD" "value"
dotnet user-secrets set "ADMIN_EMAIL" "value"
dotnet user-secrets set "ADMIN_PASSWORD" "value"
dotnet user-secrets set "CONNECTION_STRING" "Host=localhost;Port=5432;Username=postgres;Password=postgres;Database=alion;"
dotnet user-secrets set "OTEL_API_KEY" "768ba790-4261-4b9f-91d9-0fc21838463c"
```

3. Build the app

```bash
# From the root (./)
dotnet publish Alion.Server -o Alion.Server/bin/Production
```

4. Launch the app

```bash
dotnet run --project Alion.Server
```

## Debug

- VSCode

```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Server",
      "type": "dotnet",
      "request": "launch",
      "projectPath": "${workspaceFolder}/Alion.Server/Alion.Server.csproj"
    },
    {
      "name": "Client",
      "runtimeArgs": ["run-script", "dev"],
      "runtimeExecutable": "npm",
      "skipFiles": ["<node_internals>/**"],
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/Alion.Client"
    },
    {
      "name": "Browser",
      "request": "launch",
      "type": "msedge",
      "url": "https://localhost:7000",
      "webRoot": "${workspaceFolder}/Alion.Client"
    }
  ],
  "compounds": [
    {
      "name": "Debug",
      "configurations": ["Server", "Client", "Browser"],
      "presentation": {
        "hidden": false,
        "group": "",
        "order": 1
      },
      "stopAll": true
    }
  ]
}
```

## Production Preview

1. Publish

```bash
rm -rf Alion.Server/bin/Production/ && dotnet publish Alion.Server -t:PublishContainer -p ContainerArchiveOutputPath=../designer.tar.gz -o Alion.Server/bin/Production
```

2. Load docker image

```bash
docker load < designer.tar.gz
```

3. Stop runing containers

```bash
docker compose down
```

4. Uncomment the “preview” service in the “compose.yaml” file.

5. Restart containers

```bash
docker compose up -d
```

6. Access the application via: http://localhost:3000

## Deployment

```bash
# From the root (./)
rm -rf Alion.Server/bin/Publish && dotnet publish Alion.Server -t:PublishContainer -p ContainerArchiveOutputPath=../alion.tar.gz -o Alion.Server/bin/Publish
```

## Migrations

From Alion.Server

```bash
# From ./Alion.Server/
dotnet ef migrations add MigrationName
```

## Technologies

### Server

- [ASP NET Core](https://dotnet.microsoft.com/apps/aspnet)
- [EFCore](https://learn.microsoft.com/en-us/ef/core/)
- [Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [FluentValidation](https://fluentvalidation.net/)
- [OpenTelemetry](https://opentelemetry.io/)
- [XUnit](https://xunit.net/)
- [Testcontainers](https://testcontainers.com/)
- [FluentAssertion](https://fluentassertions.com/)
- [Bogus](https://github.com/bchavez/Bogus)

---

### Client

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tanstack/Router](https://tanstack.com/router/)
- [Tanstack/Query](https://tanstack.com/query/)
- [Tanstack/Table](https://tanstack.com/table/)
- [ReactHookForm](https://react-hook-form.com/)
- [openapi-typescript](https://openapi-ts.dev/)
- [openapi-fetch](https://openapi-ts.dev/openapi-fetch/)
- [openapi-react-query](https://openapi-ts.dev/openapi-react-query/)
- [Lucide](https://lucide.dev/)
- [Tailwind](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
- [Oxlint](https://oxc-project.github.io/docs/guide/usage/linter.html)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
