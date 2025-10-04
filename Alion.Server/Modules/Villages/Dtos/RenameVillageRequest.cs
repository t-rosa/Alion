using FluentValidation;

namespace Alion.Server.Modules.Villages.Dtos;

public record RenameVillageRequest(string Name);

public class RenameVillageRequestValidator : AbstractValidator<RenameVillageRequest>
{
    public RenameVillageRequestValidator()
    {
        RuleFor(e => e.Name)
            .NotEmpty()
            .WithMessage("Le nom du village ne peut pas être vide.")
            .MaximumLength(100)
            .WithMessage("Le nom du village ne peut pas dépasser 100 caractères.");
    }
}
