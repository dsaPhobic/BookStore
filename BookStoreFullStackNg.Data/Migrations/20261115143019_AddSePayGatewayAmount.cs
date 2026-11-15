using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStoreFullStackNg.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSePayGatewayAmount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "GatewayAmountVnd",
                table: "Payment",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GatewayAmountVnd",
                table: "Payment");
        }
    }
}
