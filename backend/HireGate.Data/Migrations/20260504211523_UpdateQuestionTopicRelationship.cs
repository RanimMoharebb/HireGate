using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireGate.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateQuestionTopicRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_questions_topics_topic_id",
                table: "questions");

            migrationBuilder.AlterColumn<int>(
                name: "topic_id",
                table: "questions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_questions_topics_topic_id",
                table: "questions",
                column: "topic_id",
                principalTable: "topics",
                principalColumn: "topic_id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_questions_topics_topic_id",
                table: "questions");

            migrationBuilder.AlterColumn<int>(
                name: "topic_id",
                table: "questions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_questions_topics_topic_id",
                table: "questions",
                column: "topic_id",
                principalTable: "topics",
                principalColumn: "topic_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
