using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatingSubProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Base_Dimensions",
                table: "ProductSpecifications",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Photographed_In",
                table: "ProductSpecifications",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Pieces",
                table: "ProductSpecifications",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Drainage_Info",
                table: "ProductDetails",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Factory_Code",
                table: "ProductDetails",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Inside_Bottom",
                table: "ProductDetails",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Inside_Height",
                table: "ProductDetails",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Inside_Top",
                table: "ProductDetails",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Base_Dimensions",
                table: "ProductSpecifications");

            migrationBuilder.DropColumn(
                name: "Photographed_In",
                table: "ProductSpecifications");

            migrationBuilder.DropColumn(
                name: "Pieces",
                table: "ProductSpecifications");

            migrationBuilder.DropColumn(
                name: "Drainage_Info",
                table: "ProductDetails");

            migrationBuilder.DropColumn(
                name: "Factory_Code",
                table: "ProductDetails");

            migrationBuilder.DropColumn(
                name: "Inside_Bottom",
                table: "ProductDetails");

            migrationBuilder.DropColumn(
                name: "Inside_Height",
                table: "ProductDetails");

            migrationBuilder.DropColumn(
                name: "Inside_Top",
                table: "ProductDetails");
        }
    }
}
