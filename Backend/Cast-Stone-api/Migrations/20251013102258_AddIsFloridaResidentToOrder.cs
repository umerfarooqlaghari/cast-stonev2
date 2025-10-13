using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsFloridaResidentToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFloridaResident",
                table: "Orders",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFloridaResident",
                table: "Orders");
        }
    }
}
