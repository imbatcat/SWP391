using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetHealthcare.Server.Migrations
{
    /// <inheritdoc />
    public partial class addIsRemind : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRemind",
                table: "AdmissionRecords",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRemind",
                table: "AdmissionRecords");
        }
    }
}
