namespace PetHealthcare.Server.Core.DTOS.AppointmentDTOs
{
    public class RequestResAppListForCustomer
    {
        public string AppointmentId { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public double BookingPrice { get; set; }
        public string PetName { get; set; }
        public string VeterinarianName { get; set; }
        public string AccountId {  get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set;}

        public bool IsCancel {  get; set; }
        public bool IsCheckin { get; set; }
        public bool IsCheckUp { get; set;}

    }
}
