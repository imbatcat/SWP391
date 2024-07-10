namespace PetHealthcare.Server.Core.DTOS
{
    public class MedicalRecordBlankResDTO
    {
        public string MedicalRecordId { get; set; }
        public string AppointmentId { get; set; }
        public string PetId { get; set; }
        public int PetWeight { get; set; }
        public string Allergies { get; set; } = "";
        public DateOnly FollowUpAppointmentDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public string FollowUpAppointmentNotes { get; set; } = "";
        public string AdditionalNotes { get; set; } = "";
        public string Diagnosis { get; set; } = "";
        public string Symptoms { get; set; } = "";
        public string DrugPrescriptions { get; set; } = "";
    }
}
