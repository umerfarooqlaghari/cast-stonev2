using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class AddSectionVisibilityToggles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowCollage",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowCtaSection",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowElegantDescription",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowSection3",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowSection4",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowWorkerMessage",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowCollage",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ShowCtaSection",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ShowElegantDescription",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ShowSection3",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ShowSection4",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ShowWorkerMessage",
                table: "Collections");
        }
    }
}
