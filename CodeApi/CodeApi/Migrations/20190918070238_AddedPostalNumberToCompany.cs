using Microsoft.EntityFrameworkCore.Migrations;

namespace CodeApi.Migrations
{
    public partial class AddedPostalNumberToCompany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PostalNumber",
                table: "Company",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PostalNumber",
                table: "Company");
        }
    }
}
