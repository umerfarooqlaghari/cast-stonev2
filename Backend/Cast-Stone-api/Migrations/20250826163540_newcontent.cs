using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class newcontent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop old geolocation columns only if they exist (to be idempotent across environments)
            migrationBuilder.Sql("ALTER TABLE \"WholesaleBuyers\" DROP COLUMN IF EXISTS \"Latitude\";");
            migrationBuilder.Sql("ALTER TABLE \"WholesaleBuyers\" DROP COLUMN IF EXISTS \"Longitude\";");

            migrationBuilder.AddColumn<string>(
                name: "CollageImageSection",
                table: "Collections",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ElegantDescription",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ElegantHeader",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section3Content",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section3Header",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section3Image",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section4Content",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section4Header",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Section4Image",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StaticContentHeader",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StaticContentParagraph1",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StaticContentParagraph2",
                table: "Collections",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StaticContentParagraph3",
                table: "Collections",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CollageImageSection",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ElegantDescription",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ElegantHeader",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section3Content",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section3Header",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section3Image",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section4Content",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section4Header",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "Section4Image",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "StaticContentHeader",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "StaticContentParagraph1",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "StaticContentParagraph2",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "StaticContentParagraph3",
                table: "Collections");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "WholesaleBuyers",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "WholesaleBuyers",
                type: "double precision",
                nullable: true);
        }
    }
}
