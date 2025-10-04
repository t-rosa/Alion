namespace Alion.Server.Modules.Auth.Dtos;

public record GetUserResponse(string Id, string Email, IList<string> Roles, bool IsEmailConfirmed);
