using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireGate.Data.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionCountToExamTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "question_count",
                table: "exams",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "question_count",
                table: "exams");
        }
    }
}
