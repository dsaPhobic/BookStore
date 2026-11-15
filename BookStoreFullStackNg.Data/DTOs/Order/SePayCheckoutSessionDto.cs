namespace BookStoreFullStackNg.Data.DTOs.Order;

public sealed record SePayCheckoutSessionDto(
    int OrderId,
    string CheckoutUrl,
    long AmountVnd,
    IReadOnlyList<SePayCheckoutFieldDto> Fields);
