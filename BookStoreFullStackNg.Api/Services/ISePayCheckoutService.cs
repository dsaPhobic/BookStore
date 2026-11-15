using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Order;

namespace BookStoreFullStackNg.Api.Services;

public interface ISePayCheckoutService
{
    bool IsConfigured { get; }
    long ConvertUsdToVnd(double amountUsd);
    SePayCheckoutSessionDto CreateCheckoutSession(Order order);
    bool IsValidIpnSecret(string? suppliedSecret);
    bool TryGetOrderId(string? invoiceNumber, out int orderId);
}
