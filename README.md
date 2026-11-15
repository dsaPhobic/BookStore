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

### SePay Sandbox checkout

The NetBanking option uses SePay's Sandbox checkout in the Development environment. Configure credentials with .NET user-secrets; do not put merchant keys in `appsettings.json` or commit them:

```powershell
dotnet user-secrets set "SePay:MerchantId" "<sandbox merchant id>" --project BookStoreFullStackNg.Api\BookStoreFullStackNg.Api.csproj
dotnet user-secrets set "SePay:MerchantSecretKey" "<sandbox merchant secret key>" --project BookStoreFullStackNg.Api\BookStoreFullStackNg.Api.csproj
dotnet user-secrets set "SePay:IpnSecretKey" "<the secret configured for SePay IPN authentication>" --project BookStoreFullStackNg.Api\BookStoreFullStackNg.Api.csproj
dotnet user-secrets set "SePay:UsdToVndRate" "<your VND per USD conversion rate>" --project BookStoreFullStackNg.Api\BookStoreFullStackNg.Api.csproj
dotnet user-secrets set "SePay:ClientBaseUrl" "http://localhost:4200" --project BookStoreFullStackNg.Api\BookStoreFullStackNg.Api.csproj
```

In the SePay merchant portal, configure IPN authentication as `SECRET_KEY` using the same IPN secret, and set the IPN URL to the public HTTPS URL for `/api/orders/sepay-ipn`. SePay cannot call `localhost`; use an HTTPS tunnel or deployed API while testing. The API stores the expected VND amount on the pending payment and only marks it paid after a valid IPN; the browser return URL alone does not confirm payment. Sandbox credentials and the checkout URL are separate from Production.

## Screenshots

