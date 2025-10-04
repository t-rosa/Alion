using Alion.Server.Modules.Villages;
using Microsoft.AspNetCore.Identity;

namespace Alion.Server.Modules.Users;

public class User : IdentityUser<Guid>
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    // Tribe sélectionné par le joueur (null = pas encore choisi)
    public int? TribeId { get; set; }

    public ICollection<Village> Villages { get; } = default!;
}
