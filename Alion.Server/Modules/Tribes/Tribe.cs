using System.ComponentModel.DataAnnotations;

namespace Alion.Server.Modules.Tribes;

public class Tribe
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public required string Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    // Bonus spécifiques par peuple (exemple: Romains = +5% production fer)
    public int WoodBonus { get; set; } = 0;
    public int ClayBonus { get; set; } = 0;
    public int IronBonus { get; set; } = 0;
    public int CropBonus { get; set; } = 0;

    // Propriétés pour l'UI
    [MaxLength(50)]
    public string? IconName { get; set; }

    [MaxLength(20)]
    public string? ColorHex { get; set; }
}
