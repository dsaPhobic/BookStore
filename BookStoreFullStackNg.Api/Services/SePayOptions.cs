namespace BookStoreFullStackNg.Api.Services;

public sealed class SePayOptions
{
    public const string SectionName = "SePay";

    public string MerchantId { get; set; } = string.Empty;
    public string MerchantSecretKey { get; set; } = string.Empty;
    public string IpnSecretKey { get; set; } = string.Empty;
    public decimal UsdToVndRate { get; set; }
    public string ClientBaseUrl { get; set; } = "http://localhost:4200";

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(MerchantId) &&
        !string.IsNullOrWhiteSpace(MerchantSecretKey) &&
        !string.IsNullOrWhiteSpace(IpnSecretKey) &&
        UsdToVndRate > 0 &&
        Uri.TryCreate(ClientBaseUrl, UriKind.Absolute, out var clientUri) &&
        (clientUri.Scheme == Uri.UriSchemeHttp ||
         clientUri.Scheme == Uri.UriSchemeHttps);
}
