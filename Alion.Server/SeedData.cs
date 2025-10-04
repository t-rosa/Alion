using Microsoft.AspNetCore.Identity;
using Alion.Server.Modules.Users;

namespace Alion.Server;

public static class SeedData
{
    public static async Task ExecuteAsync(IServiceProvider services, IConfiguration config)
    {
        using var scope = services.CreateScope();
        var scopedServices = scope.ServiceProvider;

        var dbContext = scopedServices.GetRequiredService<ApplicationDbContext>();

        if (!await dbContext.Database.CanConnectAsync())
        {
            Console.WriteLine("⚠️ Database not available, skipping seeding.");
            return;
        }

        var roleManager = scopedServices.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = scopedServices.GetRequiredService<UserManager<User>>();

        string[] roles = ["Admin", "Member", "User"];

        foreach (var role in roles)
        {
            var roleExists = await roleManager.RoleExistsAsync(role);
            if (!roleExists)
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
                Console.WriteLine($"✅ Role '{role}' created.");
            }
        }

        var adminEmail = config["ADMIN_EMAIL"];
        var adminPassword = config["ADMIN_PASSWORD"];

        if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword))
        {
            Console.WriteLine("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin creation.");
            return;
        }

        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
                Console.WriteLine($"✅ Admin user '{adminEmail}' created.");
            }
            else
            {
                Console.WriteLine($"❌ Failed to create admin: {string.Join(", ", result.Errors)}");
            }
        }
        else
        {
            if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
                Console.WriteLine($"✅ Admin role added to '{adminEmail}'.");
            }
        }
    }
}
