using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cast_Stone_api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWorkerMessageCollectionIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkerMessages_Collections_CollectionId",
                table: "WorkerMessages");

            migrationBuilder.DropIndex(
                name: "IX_WorkerMessages_CollectionId",
                table: "WorkerMessages");

            migrationBuilder.DropColumn(
                name: "CollectionId",
                table: "WorkerMessages");

            migrationBuilder.AddColumn<string>(
                name: "CollectionIds",
                table: "WorkerMessages",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CollectionIds",
                table: "WorkerMessages");

            migrationBuilder.AddColumn<int>(
                name: "CollectionId",
                table: "WorkerMessages",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkerMessages_CollectionId",
                table: "WorkerMessages",
                column: "CollectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkerMessages_Collections_CollectionId",
                table: "WorkerMessages",
                column: "CollectionId",
                principalTable: "Collections",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
