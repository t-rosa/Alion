using Alion.Server.Modules.Tribes.Dtos;
using Alion.Server.Modules.Users;
using Alion.Server.Modules.Villages;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Alion.Server.Modules.Tribes;

[ApiController]
[Route("api/tribes")]
[Authorize]
public class TribesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public TribesController(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    /// <summary>
    /// Récupère toutes les tribus disponibles
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<GetTribeResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTribes()
    {
        var tribes = await _context.Tribes
            .AsNoTracking()
            .Select(t => new GetTribeResponse(
                t.Id,
                t.Name,
                t.Description,
                t.WoodBonus,
                t.ClayBonus,
                t.IronBonus,
                t.CropBonus,
                t.IconName,
                t.ColorHex
            ))
            .ToListAsync();

        return Ok(tribes);
    }

    /// <summary>
    /// Sélectionne une tribu pour le joueur et crée son premier village
    /// </summary>
    [HttpPost("select")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> SelectTribe(
        [FromBody] SelectTribeRequest request,
        [FromServices] IValidator<SelectTribeRequest> validator)
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (user is null)
        {
            return Unauthorized();
        }

        // Validation
        var validation = await validator.ValidateAsync(request);
        if (!validation.IsValid)
        {
            return ValidationProblem(new ValidationProblemDetails(validation.ToDictionary()));
        }

        // Vérifier si l'utilisateur a déjà sélectionné une tribu
        if (user.TribeId.HasValue)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Tribu déjà sélectionnée",
                Detail = "Vous avez déjà sélectionné une tribu. Vous ne pouvez pas la changer."
            });
        }

        // Vérifier que la tribu existe
        var tribe = await _context.Tribes.FindAsync(request.TribeId);
        if (tribe is null)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Tribu introuvable",
                Detail = $"La tribu avec l'ID {request.TribeId} n'existe pas."
            });
        }

        // Assigner la tribu à l'utilisateur
        user.TribeId = request.TribeId;

        // Créer le premier village avec coordonnées aléatoires
        var random = new Random();
        int x, y;
        bool coordinatesValid;

        // Trouver des coordonnées libres (entre -100 et 100)
        do
        {
            x = random.Next(-100, 101);
            y = random.Next(-100, 101);

            coordinatesValid = !await _context.Villages
                .AnyAsync(v => v.CoordinateX == x && v.CoordinateY == y);
        } while (!coordinatesValid);

        var village = new Village
        {
            Id = Guid.NewGuid(),
            Name = $"Village de {user.UserName}",
            UserId = user.Id,
            TribeId = request.TribeId,
            CoordinateX = x,
            CoordinateY = y,
            IsCapital = true
        };

        _context.Villages.Add(village);

        try
        {
            await _context.SaveChangesAsync();
            return Ok();
        }
        catch (DbUpdateException ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Erreur lors de la sélection de la tribu",
                Detail = ex.Message
            });
        }
    }
}
