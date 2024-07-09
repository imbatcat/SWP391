using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace PetHealthcare.Server.Models
{
    public class Appointment
    {
        [Key]
        [Column(TypeName = "char(11)")]
        public string AppointmentId { get; set; }

        [JsonConverter(typeof(DateOnlyConverter))]
        [DataType(DataType.Date)]
        public DateOnly AppointmentDate { get; set; }

        [StringLength(50)]
        public string AppointmentType { get; set; }

        [StringLength(200)]
        public string? AppointmentNotes { get; set; }

        [DataType(DataType.Currency)]
        public double BookingPrice { get; set; }

        public bool IsCancel { get; set; } = false;

        public bool IsCheckIn { get; set; } = false;
        public bool IsCheckUp { get; set; } = false;
        public TimeOnly CheckinTime { get; set; } = new TimeOnly(0, 0, 0);
        // Reference entities

        // Adding restrict behavior will restrain from accidental deletion from Account and Pet, avoiding the deletion cycle
        [ForeignKey("AccountId")]
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Account Account { get; set; }
        public string AccountId { get; set; }

        [ForeignKey("PetId")]
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Pet Pet { get; set; }
        public string PetId { get; set; }

        [ForeignKey("VeterinarianAccountId")]
        public Veterinarian Veterinarian { get; set; }
        public string VeterinarianAccountId { get; set; }

        [ForeignKey("TimeSlotId")]
        public TimeSlot TimeSlot { get; set; }
        public int TimeSlotId { get; set; }
        public string QRCodeImageUrl {  get; set; }
        public virtual ICollection<BookingPayment> BookingPayments { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
