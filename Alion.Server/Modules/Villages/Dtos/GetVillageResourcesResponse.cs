namespace Alion.Server.Modules.Villages.Dtos;

public record GetVillageResourcesResponse(
    int Wood,
    int Clay,
    int Iron,
    int Crop,
    DateTime LastResourceUpdate
);
