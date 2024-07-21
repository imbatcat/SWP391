namespace PetHealthcare.Server.Core.DTOS
{
    public class CustomerUpdateDTO
    {
        public string? PhoneNumber { get; set; }
        public string? FullName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
    }
}
