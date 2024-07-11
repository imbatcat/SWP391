namespace PetHealthcare.Server.Core.DTOS
{
    public class AdmissionRecordEmailDTO
    {
        public string Email { get; set; }
        public DateOnly? OldDischargeDate {  get; set; }
        public DateOnly NewDischargeDate { get;set; }
        public string CustomerName {  get; set; }
        public string PetName {  get; set; }
    }
}
