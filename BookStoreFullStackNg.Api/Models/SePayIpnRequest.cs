using System.Text.Json.Serialization;

namespace BookStoreFullStackNg.Api.Models;

public sealed class SePayIpnRequest
{
    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }

    [JsonPropertyName("notification_type")]
    public string? NotificationType { get; set; }

    [JsonPropertyName("order")]
    public SePayIpnOrder? Order { get; set; }

    [JsonPropertyName("transaction")]
    public SePayIpnTransaction? Transaction { get; set; }
}

public sealed class SePayIpnOrder
{
    [JsonPropertyName("order_status")]
    public string? Status { get; set; }

    [JsonPropertyName("order_currency")]
    public string? Currency { get; set; }

    [JsonPropertyName("order_amount")]
    public string? Amount { get; set; }

    [JsonPropertyName("order_invoice_number")]
    public string? InvoiceNumber { get; set; }
}

public sealed class SePayIpnTransaction
{
    [JsonPropertyName("transaction_type")]
    public string? Type { get; set; }

    [JsonPropertyName("transaction_status")]
    public string? Status { get; set; }

    [JsonPropertyName("transaction_currency")]
    public string? Currency { get; set; }

    [JsonPropertyName("transaction_amount")]
    public string? Amount { get; set; }
}
