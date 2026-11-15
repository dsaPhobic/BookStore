using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BookStoreFullStackNg.Api.Hubs;

/// <summary>
/// Real-time channel for customer-facing notifications.
/// Connections are authenticated with the same JWT as the REST API and are
/// addressed by the customer's user name (see <see cref="UserNameUserIdProvider"/>).
/// </summary>
[Authorize]
public class NotificationHub : Hub
{
    public const string Route = "/hubs/notifications";

    /// <summary>Server-to-client event raised when an order changes status.</summary>
    public const string OrderStatusChangedEvent = "OrderStatusChanged";
}

/// <summary>
/// Resolves the SignalR user id from the identity name instead of the default
/// name-identifier claim, so <c>Clients.User(userName)</c> lines up with the
/// user name stored on the order's owner.
/// </summary>
public class UserNameUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirst(ClaimTypes.Name)?.Value
               ?? connection.User?.Identity?.Name;
    }
}
