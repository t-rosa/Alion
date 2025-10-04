using Microsoft.AspNetCore.Identity;
using Alion.Server.Modules.Users;

namespace Alion.Server;

public static class SeedTestData
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

        var userManager = scopedServices.GetRequiredService<UserManager<User>>();

        var memberEmail = "member@test.com";
        var memberPassword = "MemberTest1!";

        var memberUser = await userManager.FindByEmailAsync(memberEmail);
        if (memberUser == null)
        {
            memberUser = new User
            {
                UserName = memberEmail,
                Email = memberEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(memberUser, memberPassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(memberUser, "Member");
                Console.WriteLine($"✅ Member user '{memberEmail}' created.");
            }
            else
            {
                Console.WriteLine($"❌ Failed to create member: {string.Join(", ", result.Errors)}");
            }
        }
        else
        {
            if (!await userManager.IsInRoleAsync(memberUser, "Member"))
            {
                await userManager.AddToRoleAsync(memberUser, "Member");
                Console.WriteLine($"✅ Member role added to '{memberEmail}'.");
            }
        }

        var baseEmail = "base@test.com";
        var basePassword = "BaseTest1!";

        var baseUser = await userManager.FindByEmailAsync(baseEmail);
        if (baseUser == null)
        {
            baseUser = new User
            {
                UserName = baseEmail,
                Email = baseEmail,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(baseUser, basePassword);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(baseUser, "User");
                Console.WriteLine($"✅ Base user '{baseEmail}' created.");
            }
            else
            {
                Console.WriteLine($"❌ Failed to create base user: {string.Join(", ", result.Errors)}");
            }
        }
        else
        {
            if (!await userManager.IsInRoleAsync(baseUser, "User"))
            {
                await userManager.AddToRoleAsync(baseUser, "User");
                Console.WriteLine($"✅ User role added to '{baseEmail}'.");
            }
        }
    }
}
