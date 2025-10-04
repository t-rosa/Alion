namespace Alion.Server.Modules.Tribes.Dtos;

public record GetTribeResponse(
    int Id,
    string Name,
    string? Description,
    int WoodBonus,
    int ClayBonus,
    int IronBonus,
    int CropBonus,
    string? IconName,
    string? ColorHex
);
