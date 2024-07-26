namespace PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs
{
    public class ServiceOrderDTO
    {
        public List<int>? ServiceId { get; set; } = new List<int>();
        public string MedicalRecordId { get; set; }
    }
}
