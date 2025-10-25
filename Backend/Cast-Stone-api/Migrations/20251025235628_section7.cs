using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class section7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Section3CtaButtonLink",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section3CtaButtonText",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section4CtaButtonLink",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section4CtaButtonText",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section5CtaButtonLink",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section5CtaButtonText",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section6CtaButtonLink",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section6CtaButtonText",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section7Content",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section7CtaButtonLink",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section7CtaButtonText",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section7Header",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section7Image",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowSection7",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Section3CtaButtonLink",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section3CtaButtonText",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section4CtaButtonLink",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section4CtaButtonText",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section5CtaButtonLink",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section5CtaButtonText",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section6CtaButtonLink",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section6CtaButtonText",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section7Content",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section7CtaButtonLink",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section7CtaButtonText",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section7Header",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section7Image",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ShowSection7",
                table: "Collections");
        }
    }
}
