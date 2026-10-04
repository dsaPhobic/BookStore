using System.Reflection;
using System.Text;
using System.Linq.Dynamic.Core;

namespace BookStoreFullStackNg.Data.Helpers;

public class SortHelper<T> : ISortHelper<T>
{
    public IQueryable<T> ApplySort(IQueryable<T> entities, string sortByQueryString)
    {
        if (!entities.Any())
        {
            return entities;
        }
        if (string.IsNullOrWhiteSpace(sortByQueryString))
        {
            return entities;
        }
        var sortParams = sortByQueryString.Trim().Split(',');
        var propertyInfos = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var sortQueryBuilder = new StringBuilder();

        foreach (var param in sortParams)
        {
            if (string.IsNullOrWhiteSpace(param))
                continue;
            var propertyFromQueryName = param.Split(" ")[0];
            var objectProperty = propertyInfos.FirstOrDefault(pi => pi.Name.Equals(propertyFromQueryName, StringComparison.InvariantCultureIgnoreCase));

            if (objectProperty == null)
                continue;

            var sortingOrder = param.EndsWith(" desc") ? "descending" : "ascending";

            sortQueryBuilder.Append($"{objectProperty.Name} {sortingOrder}, ");
        }

        var sortQuery = sortQueryBuilder.ToString().TrimEnd(',', ' ');

        return entities.OrderBy(sortQuery);

    }
}
