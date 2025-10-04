using FluentValidation;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Exporter;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Alion.Server.Modules.Email;
using Alion.Server.Modules.Users;
using Scalar.AspNetCore;

namespace Alion.Server;

public interface Program
{
    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Open Telemetry
        builder.Services.AddOpenTelemetry()
            .ConfigureResource(resource => resource.AddService("Alion"))
            .WithMetrics(metrics =>
            {
                metrics
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation();

                metrics.AddOtlpExporter();
            })
            .WithTracing((tracing) =>
            {
                tracing
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddEntityFrameworkCoreInstrumentation();

                tracing.AddOtlpExporter();
            });

        builder.Logging.AddOpenTelemetry(logging => logging.AddOtlpExporter());

        builder.Services.Configure<OtlpExporterOptions>(options =>
        {
            options.Headers = $"x-otlp-api-key={builder.Configuration["OTEL_API_KEY"]}";
        });

        // Database
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
        {
            options
                .UseNpgsql(builder.Configuration["CONNECTION_STRING"])
                .UseSnakeCaseNamingConvention();
        });

        // Authentication
        builder.Services.AddAuthorization();

        builder.Services
            .AddIdentityApiEndpoints<User>(options =>
            {
                options.SignIn.RequireConfirmedAccount = true;
                options.SignIn.RequireConfirmedEmail = true;
                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        builder.Services.Configure<IdentityOptions>(options =>
        {
            options.SignIn.RequireConfirmedEmail = true;
            options.User.RequireUniqueEmail = true;
        });

        if (builder.Environment.IsDevelopment())
        {
            builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo("./keys/storage"));
        }
        else
        {
            builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo("keys/storage"));
        }

        // Email
        builder.Services.AddTransient<IEmailSender<User>, EmailSender>();

        builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("SmtpOptions"));

        // Validation
        builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly, includeInternalTypes: true);

        builder.Services.AddControllers();

        builder.Services.AddOpenApi();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();

            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            context.Database.Migrate();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.MapFallbackToFile("/index.html");

        await SeedData.ExecuteAsync(app.Services, builder.Configuration);
        if (app.Environment.IsDevelopment())
        {
            await SeedTestData.ExecuteAsync(app.Services, builder.Configuration);
        }
        app.Run();
    }
}
