using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateContactFormSubmissionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subject",
                table: "ContactFormSubmissions");

            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "ContactFormSubmissions",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Inquiry",
                table: "ContactFormSubmissions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ContactFormSubmissions",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "ContactFormSubmissions",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "ContactFormSubmissions",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Company",
                table: "ContactFormSubmissions");

            migrationBuilder.DropColumn(
                name: "Inquiry",
                table: "ContactFormSubmissions");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "ContactFormSubmissions");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "ContactFormSubmissions");

            migrationBuilder.DropColumn(
                name: "State",
                table: "ContactFormSubmissions");

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "ContactFormSubmissions",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
