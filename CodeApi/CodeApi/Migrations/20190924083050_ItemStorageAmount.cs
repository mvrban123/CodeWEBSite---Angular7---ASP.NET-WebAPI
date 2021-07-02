using Microsoft.EntityFrameworkCore.Migrations;

namespace CodeApi.Migrations
{
    public partial class ItemStorageAmount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StorageAmount",
                table: "Item",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StorageAmount",
                table: "Item");
        }
    }
}
