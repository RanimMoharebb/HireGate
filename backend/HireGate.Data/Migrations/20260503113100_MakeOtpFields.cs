using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HireGate.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeOtpFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOtpVerified",
                table: "admins",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetOtpExpiry",
                table: "admins",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResetOtpHash",
                table: "admins",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOtpVerified",
                table: "admins");

            migrationBuilder.DropColumn(
                name: "ResetOtpExpiry",
                table: "admins");

            migrationBuilder.DropColumn(
                name: "ResetOtpHash",
                table: "admins");
        }
    }
}
