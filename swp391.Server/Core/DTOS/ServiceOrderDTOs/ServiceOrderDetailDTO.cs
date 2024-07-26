namespace PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs
{
    public class ServiceOrderDetailDTO
    {
        public string OrderId {  get; set; }
        public double Price {  get; set; }
        public string ServiceName {  get; set; }
        public string AppointmentId {  get; set; }
        public string PhoneNumber { get; set; }
        public string OwnerName { get; set; }
        public string PetName { get; set; }
    }
}
