using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Alion.Server.Modules.Tribes;
using Alion.Server.Modules.Users;

namespace Alion.Server.Modules.Villages;

public class Village
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    // Coordonnées sur la carte du monde
    public int CoordinateX { get; set; }
    public int CoordinateY { get; set; }

    // Relations
    [Required]
    public required Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = default!;

    [Required]
    public required int TribeId { get; set; }

    [ForeignKey(nameof(TribeId))]
    public Tribe Tribe { get; set; } = default!;

    // Ressources actuelles
    public int Wood { get; set; } = 750;
    public int Clay { get; set; } = 750;
    public int Iron { get; set; } = 750;
    public int Crop { get; set; } = 750;

    // Production par heure (peut augmenter avec les bâtiments)
    public int WoodProduction { get; set; } = 30;
    public int ClayProduction { get; set; } = 30;
    public int IronProduction { get; set; } = 30;
    public int CropProduction { get; set; } = 30;

    // Capacité de stockage (augmente avec entrepôt/grenier)
    public int WarehouseCapacity { get; set; } = 800;  // Bois, Argile, Fer
    public int GranaryCapacity { get; set; } = 800;     // Céréales

    // Population
    public int Population { get; set; } = 2;
    public int PopulationLimit { get; set; } = 2;

    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastResourceUpdate { get; set; } = DateTime.UtcNow;

    // Indicateur si c'est le village principal
    public bool IsCapital { get; set; } = true;
}
