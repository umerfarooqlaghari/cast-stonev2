using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class AddProductSpecificationsDetailsAndDownloadableContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductCode",
                table: "Products",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DownloadableContents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Care = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ProductInstructions = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CAD = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ProductId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DownloadableContents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DownloadableContents_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UPC = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    IndoorUseOnly = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    AssemblyRequired = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    EaseOfAssembly = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    AssistanceRequired = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    SplashLevel = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    SoundLevel = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    SoundType = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ReplacementPumpKit = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ElectricalCordLength = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PumpSize = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ShipMethod = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CatalogPage = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ProductId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductDetails_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductSpecifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Material = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Dimensions = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    TotalWeight = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    WeightWithWater = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    WaterVolume = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ProductId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSpecifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductSpecifications_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DownloadableContents_ProductId",
                table: "DownloadableContents",
                column: "ProductId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductDetails_ProductId",
                table: "ProductDetails",
                column: "ProductId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductSpecifications_ProductId",
                table: "ProductSpecifications",
                column: "ProductId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DownloadableContents");

            migrationBuilder.DropTable(
                name: "ProductDetails");

            migrationBuilder.DropTable(
                name: "ProductSpecifications");

            migrationBuilder.DropColumn(
                name: "ProductCode",
                table: "Products");
        }
    }
}
