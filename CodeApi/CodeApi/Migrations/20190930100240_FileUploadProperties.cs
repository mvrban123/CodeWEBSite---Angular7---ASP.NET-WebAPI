using Microsoft.EntityFrameworkCore.Migrations;

namespace CodeApi.Migrations
{
    public partial class FileUploadProperties : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InvoiceLocation",
                table: "Order",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WarrantyLocation",
                table: "Order",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InvoiceLocation",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "WarrantyLocation",
                table: "Order");
        }
    }
}
