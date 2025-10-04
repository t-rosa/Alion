using Alion.Server.Modules.Tribes;
using Alion.Server.Modules.Users;
using Alion.Server.Modules.Villages;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Alion.Server;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    internal DbSet<Tribe> Tribes { get; set; }
    internal DbSet<Village> Villages { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed des tribus
        modelBuilder.Entity<Tribe>().HasData(
            new Tribe
            {
                Id = 1,
                Name = "Romains",
                Description = "Excellents bâtisseurs et stratèges. Bonus de production équilibré.",
                WoodBonus = 0,
                ClayBonus = 0,
                IronBonus = 5,
                CropBonus = 0,
                IconName = "shield-roman",
                ColorHex = "#DC2626"
            },
            new Tribe
            {
                Id = 2,
                Name = "Germains",
                Description = "Guerriers redoutables et excellents pillards. Bonus militaire.",
                WoodBonus = 0,
                ClayBonus = 0,
                IronBonus = 0,
                CropBonus = 5,
                IconName = "axe",
                ColorHex = "#2563EB"
            },
            new Tribe
            {
                Id = 3,
                Name = "Gaulois",
                Description = "Excellents commerçants et défenseurs. Vitesse de construction rapide.",
                WoodBonus = 5,
                ClayBonus = 5,
                IronBonus = 0,
                CropBonus = 0,
                IconName = "helmet",
                ColorHex = "#16A34A"
            }
        );

        // Index pour les coordonnées des villages (recherche rapide sur la carte)
        modelBuilder.Entity<Village>()
            .HasIndex(v => new { v.CoordinateX, v.CoordinateY })
            .IsUnique();
    }
}
