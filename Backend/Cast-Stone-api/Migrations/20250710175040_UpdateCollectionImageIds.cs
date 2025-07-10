using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCollectionImageIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Images",
                table: "Collections");

            migrationBuilder.AddColumn<string>(
                name: "ImageIds",
                table: "Collections",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageIds",
                table: "Collections");

            migrationBuilder.AddColumn<string>(
                name: "Images",
                table: "Collections",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }
    }
}
