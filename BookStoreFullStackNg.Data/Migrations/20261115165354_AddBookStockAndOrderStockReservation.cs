using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookStoreFullStackNg.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookStockAndOrderStockReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "StockReservedAt",
                table: "Order",
                type: migrationBuilder.ActiveProvider == "Microsoft.EntityFrameworkCore.Sqlite"
                    ? "TEXT"
                    : "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StockRestoredAt",
                table: "Order",
                type: migrationBuilder.ActiveProvider == "Microsoft.EntityFrameworkCore.Sqlite"
                    ? "TEXT"
                    : "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StockQuantity",
                table: "Book",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddCheckConstraint(
                name: "CK_Book_StockQuantity_NonNegative",
                table: "Book",
                sql: "\"StockQuantity\" >= 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Book_StockQuantity_NonNegative",
                table: "Book");

            migrationBuilder.DropColumn(
                name: "StockReservedAt",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "StockRestoredAt",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "StockQuantity",
                table: "Book");
        }
    }
}
