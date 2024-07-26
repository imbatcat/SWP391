namespace PetHealthcare.Server.Core.DTOS.AppointmentDTOs
{
    public class ResAppListForCustomer
    {
        public string AppointmentId { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public double BookingPrice { get; set; }
        public string PetName { get; set; }
        public string VeterinarianName { get; set; }

        public string TimeSlot { get; set; }
        public string AppointmentStatus { get; set; }
    }
}
