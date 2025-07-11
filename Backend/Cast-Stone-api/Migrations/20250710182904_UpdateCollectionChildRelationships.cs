using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCollectionChildRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_Collections_ChildCollectionId",
                table: "Collections");

            migrationBuilder.DropIndex(
                name: "IX_Collections_ChildCollectionId",
                table: "Collections");

            migrationBuilder.DropColumn(
                name: "ChildCollectionId",
                table: "Collections");

            migrationBuilder.AddColumn<string>(
                name: "ChildCollectionIds",
                table: "Collections",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChildCollectionIds",
                table: "Collections");

            migrationBuilder.AddColumn<int>(
                name: "ChildCollectionId",
                table: "Collections",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Collections_ChildCollectionId",
                table: "Collections",
                column: "ChildCollectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_Collections_ChildCollectionId",
                table: "Collections",
                column: "ChildCollectionId",
                principalTable: "Collections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
