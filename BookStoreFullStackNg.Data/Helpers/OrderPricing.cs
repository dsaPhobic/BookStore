namespace BookStoreFullStackNg.Data.Helpers;

public static class OrderPricing
{
    public static (double Tax, double DiscountAmount, double Total) Calculate(
        double subtotal,
        double taxPercent,
        double discountPercent,
        double? maxDiscount)
    {
        var tax = Round(subtotal * taxPercent / 100);
        var beforeDiscount = subtotal + tax;
        var discountAmount = Round(Math.Min(beforeDiscount * discountPercent / 100, maxDiscount ?? double.MaxValue));
        var total = Round(beforeDiscount - discountAmount);
        return (tax, discountAmount, total);
    }

    public static double[] AllocatePaidLineTotals(IReadOnlyList<double> lineSubtotals, double total)
    {
        if (lineSubtotals.Count == 0)
        {
            return [];
        }

        var subtotal = lineSubtotals.Sum();
        if (subtotal <= 0)
        {
            return lineSubtotals.Select(_ => 0d).ToArray();
        }

        var totalCents = decimal.ToInt64(decimal.Round((decimal)total * 100, 0, MidpointRounding.AwayFromZero));
        var allocations = lineSubtotals
            .Select((lineSubtotal, index) =>
            {
                var exactCents = totalCents * (decimal)lineSubtotal / (decimal)subtotal;
                var wholeCents = decimal.ToInt64(decimal.Floor(exactCents));
                return (Index: index, Cents: wholeCents, Remainder: exactCents - wholeCents);
            })
            .ToArray();

        var remainingCents = totalCents - allocations.Sum(allocation => allocation.Cents);
        foreach (var allocation in allocations
                     .OrderByDescending(allocation => allocation.Remainder)
                     .ThenBy(allocation => allocation.Index)
                     .Take((int)remainingCents))
        {
            allocations[allocation.Index].Cents++;
        }

        return allocations
            .OrderBy(allocation => allocation.Index)
            .Select(allocation => allocation.Cents / 100d)
            .ToArray();
    }

    private static double Round(double amount) =>
        Math.Round(amount, 2, MidpointRounding.AwayFromZero);
}
