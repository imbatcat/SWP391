using System.ComponentModel.DataAnnotations;

namespace PetHealthcare.Server.Core.DTOS.Auth
{
    public class LoginModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email_Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
}
