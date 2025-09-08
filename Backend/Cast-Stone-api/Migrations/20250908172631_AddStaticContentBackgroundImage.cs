using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class AddStaticContentBackgroundImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StaticContentBackgroundImage",
                table: "Collections",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StaticContentBackgroundImage",
                table: "Collections");
        }
    }
}
