namespace PetHealthcare.Server.Core.DTOS
{
    public class MedicalRecordDTO
    {
        public string MedicalRecordId { get; set; }
        public DateOnly DataCreated { get; set; }
        public int PetWeight { get; set; }
        public string? Symptoms { get; set; }
        public string? Allergies { get; set; }
        public string? Diagnosis { get; set; }
        public string? AdditionalNotes { get; set; }
        public DateOnly? FollowUpAppointmentDate { get; set; }
        public string? FollowUpAppointmentNotes { get; set; }
        public string? DrugPrescriptions { get; set; }
        public string AppointmentId { get; set; }
        public string PetId { get; set; }
    }
}
