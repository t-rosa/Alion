namespace Alion.Server.Modules.Users.Dtos;

public record GetCurrentPlayerResponse(
    Guid Id,
    string? Email,
    string? FirstName,
    string? LastName,
    int? TribeId,
    bool HasVillages
);
