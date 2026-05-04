using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireGate.Data.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeTokenNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_candidates_exams_exam_id",
                table: "candidates");

            migrationBuilder.AlterColumn<string>(
                name: "token",
                table: "candidates",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)");

            migrationBuilder.AlterColumn<int>(
                name: "exam_id",
                table: "candidates",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_candidates_exams_exam_id",
                table: "candidates",
                column: "exam_id",
                principalTable: "exams",
                principalColumn: "exam_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_candidates_exams_exam_id",
                table: "candidates");

            migrationBuilder.AlterColumn<string>(
                name: "token",
                table: "candidates",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "exam_id",
                table: "candidates",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_candidates_exams_exam_id",
                table: "candidates",
                column: "exam_id",
                principalTable: "exams",
                principalColumn: "exam_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
