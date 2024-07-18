namespace PetHealthcare.Server.Core.DTOS.AppointmentDTOs
{
    public class GetAllAppointmentForAdminDTO
    {
        public string AppointmentId { get; set; }
        public string AccountId {  get; set; }
        public string PetId {  get; set; }
        public string VeterinarianId {  get; set; }
        public DateOnly AppointmentDate { get; set; }
        public string AppointmentType { get; set; }
        public string? AppointmentNotes { get; set; }
        public double BookingPrice { get; set; }
        public string PetName { get; set; }
        public string VeterinarianName { get; set; }
        public string TimeSlot { get; set; }
        public int TimeSlotId {  get; set; }
        
        public bool IsCancel { get; set; }
        public bool IsCheckIn { get; set; }
        public bool IsCheckUp { get; set; }
        public string PhoneNumber {  get; set; }
        public string OwnerName {  get; set; }
        public TimeOnly CheckinTime { get; set; }
        
    }
}
