# Online book store with .net core and angular

## Tech stack

- .Net core 8 (APIs)
- Entity Framework Core (ORM)
- PostgreSQL (Supabase Cloud Database) & Sqlite (Local fallback)
- xUnit for unit and integration tests
- Angular 18 (client side)
- Ngrx for state management

## How to run the project

This repository contains both .net core and angular appliction.

### Running .net application

- Open the root directory in vs code
- Open integrated terminal and change directory to `BookStoreFullStackNg.Data` and run the migration command `dotnet ef database update`
- Open a new integrated terminal and change the directory to the `BookStoreFullStackNg.Api` and run command `dotnet run`
- Open the new integrated terminal and change the directory to the `bookstore-fullstack-ng-client` and run the command `ng serve --open`

### Coupon discounts

After updating the project, apply the bookstore migration from the repository root:

```powershell
dotnet ef database update --project BookStoreFullStackNg.Data\BookStoreFullStackNg.Data.csproj --startup-project BookStoreFullStackNg.Api\BookStoreFullStackNg.Api.csproj --context BookStoreContext
```

An admin can create a coupon with `POST /api/coupons`, for example:

```json
{
  "code": "SAVE10",
  "discountPercent": 10,
  "maxDiscount": 25,
  "isActive": true,
  "maxUsageCount": 100,
  "expiryDate": "2026-12-31T23:59:59Z"
}
```

Signed-in users can preview it against their cart with `POST /api/coupons/apply` and body `{ "code": "SAVE10" }`. The checkout request includes the applied `couponCode`; the API checks validity and usage limits again before creating the order.

### Real-time order notifications

The API exposes a SignalR hub at `/hubs/notifications`. Customers connect with their JWT (sent as the `access_token` query string value, which is how browser WebSocket handshakes authenticate). When an admin changes an order status with `PUT /api/orders/{id}/status`, the API sends an `OrderStatusChanged` event to that order's owner only.

The Angular client keeps the connection open while a session is active, shows the update as a toast, adds it to the notification bell in the header, and refreshes the "My Orders" list when that page is open.


