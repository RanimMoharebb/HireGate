using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireGate.Data.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDeletedAtToQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "deleted_at",
                table: "questions",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deleted_at",
                table: "questions");
        }
    }
}
