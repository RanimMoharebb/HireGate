using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireGate.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCandidateConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_candidates_exams_exam_id",
                table: "candidates");

            migrationBuilder.AddForeignKey(
                name: "FK_candidates_exams_exam_id",
                table: "candidates",
                column: "exam_id",
                principalTable: "exams",
                principalColumn: "exam_id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_candidates_exams_exam_id",
                table: "candidates");

            migrationBuilder.AddForeignKey(
                name: "FK_candidates_exams_exam_id",
                table: "candidates",
                column: "exam_id",
                principalTable: "exams",
                principalColumn: "exam_id");
        }
    }
}
