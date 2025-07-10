using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class AddProductIdsToCollections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageIds",
                table: "Collections",
                newName: "ProductIds");

            migrationBuilder.AddColumn<string>(
                name: "Images",
                table: "Collections",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Images",
                table: "Collections");

            migrationBuilder.RenameColumn(
                name: "ProductIds",
                table: "Collections",
                newName: "ImageIds");
        }
    }
}
