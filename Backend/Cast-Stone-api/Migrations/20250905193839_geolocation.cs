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
            // Ensure column exists and is nullable
            migrationBuilder.Sql("ALTER TABLE \"WholesaleBuyers\" ADD COLUMN IF NOT EXISTS \"GeoLocation\" character varying(500);");
            // Also enforce nullability and length if column pre-existed as NOT NULL or with different type/length
            migrationBuilder.Sql("ALTER TABLE \"WholesaleBuyers\" ALTER COLUMN \"GeoLocation\" TYPE character varying(500);");
            migrationBuilder.Sql("ALTER TABLE \"WholesaleBuyers\" ALTER COLUMN \"GeoLocation\" DROP NOT NULL;");
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
