using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class AddSection5And6Fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Section5Content",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section5Header",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section5Image",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section6Content",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section6Header",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section6Image",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowSection5",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowSection6",
                table: "Collections",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Section5Content",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section5Header",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section5Image",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section6Content",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section6Header",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section6Image",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ShowSection5",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ShowSection6",
                table: "Collections");
        }
    }
}
