using System.ComponentModel.DataAnnotations;

namespace PetHealthcare.Server.Core.DTOS
{
    public class AccountUpdateDTO
    {
        public string Position {  get; set; }
        public string Department { get; set; }
        public int Experience {  get; set; }
        public string PhoneNumber {  get; set; }
        public string Description {  get; set; }
    }
}
