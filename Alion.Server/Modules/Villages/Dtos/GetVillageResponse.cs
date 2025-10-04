namespace Alion.Server.Modules.Villages.Dtos;

public record GetVillageResponse(
    Guid Id,
    string Name,
    int CoordinateX,
    int CoordinateY,
    int TribeId,
    string TribeName,
    int Wood,
    int Clay,
    int Iron,
    int Crop,
    int WoodProduction,
    int ClayProduction,
    int IronProduction,
    int CropProduction,
    int WarehouseCapacity,
    int GranaryCapacity,
    int Population,
    int PopulationLimit,
    bool IsCapital,
    DateTime LastResourceUpdate
);
