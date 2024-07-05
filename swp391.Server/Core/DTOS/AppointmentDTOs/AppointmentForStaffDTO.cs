namespace PetHealthcare.Server.Core.DTOS.AppointmentDTOs
{
    public class AppointmentForStaffDTO
    {
        public string appointmentId { get; set; }
        public string customerName { get; set; }
        public string phoneNumber { get; set; }
        public string petName { get; set; }
        public bool isCheckin {  get; set; }
        public bool isCancel {  get; set; }
        public bool isCheckup {  get; set; }

        public string VetName { get; set; }
        public DateOnly appointmentDate { get; set; }

    }
}
