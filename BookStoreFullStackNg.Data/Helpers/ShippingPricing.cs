using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.DTOs.Order;

namespace BookStoreFullStackNg.Data.Helpers;

public static class ShippingPricing
{
    public static IReadOnlyList<ShippingRateDto> Rates { get; } =
    [
        new() { Zone = ShippingZone.HoChiMinhCity, Label = "Ho Chi Minh City", Fee = 1.00 },
        new() { Zone = ShippingZone.SouthernVietnam, Label = "Southern Vietnam (outside HCMC)", Fee = 1.50 },
        new() { Zone = ShippingZone.OtherVietnam, Label = "Other provinces", Fee = 2.30 }
    ];

    public static double GetFee(ShippingZone zone) =>
        zone switch
        {
            ShippingZone.HoChiMinhCity => 1.00,
            ShippingZone.SouthernVietnam => 1.50,
            ShippingZone.OtherVietnam => 2.30,
            _ => throw new ArgumentOutOfRangeException(nameof(zone), zone, "Unsupported shipping zone.")
        };
}
