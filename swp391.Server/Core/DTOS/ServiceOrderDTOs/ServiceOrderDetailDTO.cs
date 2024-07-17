namespace PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs
{
    public class ServiceOrderDetailDTO
    {
        public string OrderId {  get; set; }
        public double Price {  get; set; }
        public string ServiceName {  get; set; }
        public string AppointmentId {  get; set; }
    }
}
