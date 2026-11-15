using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Order;
using Microsoft.Extensions.Options;

namespace BookStoreFullStackNg.Api.Services;

public sealed class SePayCheckoutService : ISePayCheckoutService
{
    public const string CheckoutUrl = "https://pay-sandbox.sepay.vn/v1/checkout/init";

    private const string InvoicePrefix = "BOOKSTORE-";
    private readonly SePayOptions _options;

    public SePayCheckoutService(IOptions<SePayOptions> options)
    {
        _options = options.Value;
    }

    public bool IsConfigured => _options.IsConfigured;

    public long ConvertUsdToVnd(double amountUsd)
    {
        EnsureConfigured();
        if (!double.IsFinite(amountUsd) || amountUsd <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amountUsd));
        }

        var amountVnd = decimal.Round(
            Convert.ToDecimal(amountUsd) * _options.UsdToVndRate,
            0,
            MidpointRounding.AwayFromZero);
        if (amountVnd < 1)
        {
            throw new ArgumentOutOfRangeException(
                nameof(amountUsd),
                "The converted SePay amount must be at least one VND.");
        }

        return decimal.ToInt64(amountVnd);
    }

    public SePayCheckoutSessionDto CreateCheckoutSession(Order order)
    {
        EnsureConfigured();
        if (order.Payment.GatewayAmountVnd is not long amountVnd || amountVnd <= 0)
        {
            throw new InvalidOperationException("The SePay VND amount has not been prepared.");
        }

        var fields = new List<SePayCheckoutFieldDto>
        {
            new("operation", "PURCHASE"),
            new("payment_method", "BANK_TRANSFER"),
            new("order_invoice_number", CreateInvoiceNumber(order.Id)),
            new("order_amount", amountVnd.ToString(CultureInfo.InvariantCulture)),
            new("currency", "VND"),
            new("order_description", $"BookStore order {order.Id}"),
            new("success_url", CreateReturnUrl(order.Id, "success")),
            new("error_url", CreateReturnUrl(order.Id, "error")),
            new("cancel_url", CreateReturnUrl(order.Id, "cancel")),
            new("merchant", _options.MerchantId)
        };

        var signaturePayload = string.Join(
            ",",
            fields.Select(field => $"{field.Name}={field.Value}"));
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_options.MerchantSecretKey));
        var signature = Convert.ToBase64String(
            hmac.ComputeHash(Encoding.UTF8.GetBytes(signaturePayload)));
        fields.Add(new SePayCheckoutFieldDto("signature", signature));

        return new SePayCheckoutSessionDto(order.Id, CheckoutUrl, amountVnd, fields);
    }

    public bool IsValidIpnSecret(string? suppliedSecret)
    {
        if (string.IsNullOrEmpty(_options.IpnSecretKey) ||
            string.IsNullOrEmpty(suppliedSecret))
        {
            return false;
        }

        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(_options.IpnSecretKey),
            Encoding.UTF8.GetBytes(suppliedSecret));
    }

    public bool TryGetOrderId(string? invoiceNumber, out int orderId)
    {
        orderId = 0;
        if (invoiceNumber is null ||
            !invoiceNumber.StartsWith(InvoicePrefix, StringComparison.Ordinal) ||
            !int.TryParse(
                invoiceNumber.AsSpan(InvoicePrefix.Length),
                NumberStyles.None,
                CultureInfo.InvariantCulture,
                out orderId) ||
            orderId <= 0)
        {
            return false;
        }

        return string.Equals(
            invoiceNumber,
            CreateInvoiceNumber(orderId),
            StringComparison.Ordinal);
    }

    private string CreateReturnUrl(int orderId, string result)
    {
        var baseUrl = _options.ClientBaseUrl.TrimEnd('/');
        return $"{baseUrl}/sepay-result?orderId={orderId}&result={result}";
    }

    private void EnsureConfigured()
    {
        if (!IsConfigured)
        {
            throw new InvalidOperationException(
                "SePay Sandbox is not configured. Set its credentials, IPN secret, and USD-to-VND rate.");
        }
    }

    private static string CreateInvoiceNumber(int orderId) =>
        $"{InvoicePrefix}{orderId.ToString("D8", CultureInfo.InvariantCulture)}";
}
