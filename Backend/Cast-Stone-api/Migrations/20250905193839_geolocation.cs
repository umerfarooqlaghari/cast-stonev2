using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class geolocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GeoLocation",
                table: "WholesaleBuyers",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GeoLocation",
                table: "WholesaleBuyers");
        }
    }
}
