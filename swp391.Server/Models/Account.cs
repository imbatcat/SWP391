using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using IndexAttribute = Microsoft.EntityFrameworkCore.IndexAttribute;

namespace PetHealthcare.Server.Models
{
    [Index(nameof(Username), IsUnique = true)]
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(PhoneNumber), IsUnique = true)]
    public class Account
    {
        [NotMapped]
        public string prefix { get; set; } = "AC-";

        [Key]
        [Column(TypeName = "char(11)")]
        public string AccountId { get; set; }

        [StringLength(20)]
        public string? Username { get; set; }

        [StringLength(50)]
        [Required]
        public string FullName { get; set; }

        [StringLength(16)]
        [DataType(DataType.Password)]
        public string? Password { get; set; }

        [Required]
        public bool IsMale { get; set; }

        [DataType(DataType.PhoneNumber, ErrorMessage = "Not a valid phone number")]
        public string? PhoneNumber { get; set; }

        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string? Email { get; set; }

        [DataType(DataType.Date)]
        public DateOnly? DateOfBirth { get; set; }

        [JsonConverter(typeof(DateOnlyConverter))]
        [DataType(DataType.Date)]
        [Required]
        public DateOnly JoinDate { get; set; }

        [DefaultValue(false)]
        public bool IsDisabled { get; set; }

        // Reference entities 
        [DefaultValue(1)]
        public int RoleId { get; set; } = 1;
        public Role AccountRole { get; set; }

        [InverseProperty(nameof(Appointment.Account))]
        public virtual ICollection<Appointment>? Appointments { get; set; }

        public virtual ICollection<Feedback>? Feedbacks { get; set; }

        [InverseProperty(nameof(Pet.Account))]
        public virtual ICollection<Pet>? Pets { get; set; }
    }
}
