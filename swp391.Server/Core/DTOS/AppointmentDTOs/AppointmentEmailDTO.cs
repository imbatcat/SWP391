namespace PetHealthcare.Server.Core.DTOS.AppointmentDTOs
{
    public class AppointmentEmailDTO
    {
        public string Email { get; set; }
        public DateOnly appointmentDate {  get; set; }
        public string PetName {  get; set; }
        public string CustomerName {  get; set; }
        public string AppointmentTime {  get; set; }

        public string VeterinarianName {  get; set; }

        public string CheckinQr { get; set; }
        public string AppointmentType {  get; set; }
        public string AppointmentId {  get; set; }
    }
}
