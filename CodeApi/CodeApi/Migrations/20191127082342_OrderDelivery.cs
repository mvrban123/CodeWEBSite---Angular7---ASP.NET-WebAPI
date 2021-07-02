using Microsoft.EntityFrameworkCore.Migrations;

namespace CodeApi.Migrations
{
    public partial class OrderDelivery : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Delivery",
                table: "Order",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Delivery",
                table: "Order");
        }
    }
}
