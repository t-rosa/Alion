using Alion.Server.Modules.Users;
using Alion.Server.Modules.Villages.Dtos;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alion.Server.Modules.Villages;

[ApiController]
[Route("api/villages")]
[Authorize]
public class VillagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public VillagesController(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    /// <summary>
    /// Récupère tous les villages du joueur connecté
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<GetVillageResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetVillages()
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user is null)
        {
            return Unauthorized();
        }

        var villages = await _context.Villages
            .AsNoTracking()
            .Include(v => v.Tribe)
            .Where(v => v.UserId == user.Id)
            .Select(v => new
            {
                Village = v,
                TribeName = v.Tribe.Name
            })
            .ToListAsync();

        // Calculer les ressources avec production depuis la dernière mise à jour
        var response = villages.Select(v =>
        {
            var updated = CalculateResources(v.Village);
            return new GetVillageResponse(
                updated.Id,
                updated.Name,
                updated.CoordinateX,
                updated.CoordinateY,
                updated.TribeId,
                v.TribeName,
                updated.Wood,
                updated.Clay,
                updated.Iron,
                updated.Crop,
                updated.WoodProduction,
                updated.ClayProduction,
                updated.IronProduction,
                updated.CropProduction,
                updated.WarehouseCapacity,
                updated.GranaryCapacity,
                updated.Population,
                updated.PopulationLimit,
                updated.IsCapital,
                updated.LastResourceUpdate
            );
        });

        return Ok(response);
    }

    /// <summary>
    /// Récupère un village spécifique par son ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(GetVillageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetVillage([FromRoute] Guid id)
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user is null)
        {
            return Unauthorized();
        }

        var village = await _context.Villages
            .Include(v => v.Tribe)
            .FirstOrDefaultAsync(v => v.Id == id && v.UserId == user.Id);

        if (village is null)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Village introuvable",
                Detail = $"Le village avec l'ID {id} n'existe pas ou ne vous appartient pas."
            });
        }

        // Calculer et sauvegarder les ressources mises à jour
        var updated = CalculateResources(village);
        village.Wood = updated.Wood;
        village.Clay = updated.Clay;
        village.Iron = updated.Iron;
        village.Crop = updated.Crop;
        village.LastResourceUpdate = updated.LastResourceUpdate;

        await _context.SaveChangesAsync();

        var response = new GetVillageResponse(
            updated.Id,
            updated.Name,
            updated.CoordinateX,
            updated.CoordinateY,
            updated.TribeId,
            updated.Tribe.Name,
            updated.Wood,
            updated.Clay,
            updated.Iron,
            updated.Crop,
            updated.WoodProduction,
            updated.ClayProduction,
            updated.IronProduction,
            updated.CropProduction,
            updated.WarehouseCapacity,
            updated.GranaryCapacity,
            updated.Population,
            updated.PopulationLimit,
            updated.IsCapital,
            updated.LastResourceUpdate
        );

        return Ok(response);
    }

    /// <summary>
    /// Récupère uniquement les ressources d'un village (endpoint léger pour polling)
    /// </summary>
    [HttpGet("{id:guid}/resources")]
    [ProducesResponseType(typeof(GetVillageResourcesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetVillageResources([FromRoute] Guid id)
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user is null)
        {
            return Unauthorized();
        }

        var village = await _context.Villages
            .FirstOrDefaultAsync(v => v.Id == id && v.UserId == user.Id);

        if (village is null)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Village introuvable",
                Detail = $"Le village avec l'ID {id} n'existe pas ou ne vous appartient pas."
            });
        }

        // Calculer et sauvegarder les ressources mises à jour
        var updated = CalculateResources(village);
        village.Wood = updated.Wood;
        village.Clay = updated.Clay;
        village.Iron = updated.Iron;
        village.Crop = updated.Crop;
        village.LastResourceUpdate = updated.LastResourceUpdate;

        await _context.SaveChangesAsync();

        var response = new GetVillageResourcesResponse(
            updated.Wood,
            updated.Clay,
            updated.Iron,
            updated.Crop,
            updated.LastResourceUpdate
        );

        return Ok(response);
    }

    /// <summary>
    /// Renomme un village
    /// </summary>
    [HttpPut("{id:guid}/rename")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RenameVillage(
        [FromRoute] Guid id,
        [FromBody] RenameVillageRequest request,
        [FromServices] IValidator<RenameVillageRequest> validator)
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user is null)
        {
            return Unauthorized();
        }

        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            return ValidationProblem(new ValidationProblemDetails(validation.ToDictionary()));
        }

        var village = await _context.Villages
            .FirstOrDefaultAsync(v => v.Id == id && v.UserId == user.Id);

        if (village is null)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Village introuvable",
                Detail = $"Le village avec l'ID {id} n'existe pas ou ne vous appartient pas."
            });
        }

        village.Name = request.Name;

        try
        {
            await _context.SaveChangesAsync();
            return Ok();
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Erreur lors du renommage",
                Detail = ex.Message
            });
        }
    }

    /// <summary>
    /// Calcule les ressources produites depuis la dernière mise à jour
    /// </summary>
    private Village CalculateResources(Village village)
    {
        var now = DateTime.UtcNow;
        var hoursSinceLastUpdate = (now - village.LastResourceUpdate).TotalHours;

        if (hoursSinceLastUpdate > 0)
        {
            // Calculer la production
            var woodProduced = (int)(village.WoodProduction * hoursSinceLastUpdate);
            var clayProduced = (int)(village.ClayProduction * hoursSinceLastUpdate);
            var ironProduced = (int)(village.IronProduction * hoursSinceLastUpdate);
            var cropProduced = (int)(village.CropProduction * hoursSinceLastUpdate);

            // Ajouter aux ressources actuelles avec limite de capacité
            village.Wood = Math.Min(village.Wood + woodProduced, village.WarehouseCapacity);
            village.Clay = Math.Min(village.Clay + clayProduced, village.WarehouseCapacity);
            village.Iron = Math.Min(village.Iron + ironProduced, village.WarehouseCapacity);
            village.Crop = Math.Min(village.Crop + cropProduced, village.GranaryCapacity);

            village.LastResourceUpdate = now;
        }

        return village;
    }
}
