using FluentValidation;

namespace Alion.Server.Modules.Tribes.Dtos;

public record SelectTribeRequest(int TribeId);

public class SelectTribeRequestValidator : AbstractValidator<SelectTribeRequest>
{
    public SelectTribeRequestValidator()
    {
        RuleFor(e => e.TribeId)
            .GreaterThan(0)
            .WithMessage("L'identifiant de la tribu doit être valide.");
    }
}
