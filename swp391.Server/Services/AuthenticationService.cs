using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.WebUtilities;
using NanoidDotNet;
using Newtonsoft.Json.Linq;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Core.DTOS.Auth;
using PetHealthcare.Server.Core.Helpers;
using PetHealthcare.Server.Models.ApplicationModels;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Net.Mail;
using System.Text;
using QRCoder;
using System.Net.Mime;
using System.Net;
using static System.Runtime.InteropServices.JavaScript.JSType;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Core.Constant;

namespace PetHealthcare.Server.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IAccountService _accountService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IEmailSender _emailService;

        public AuthenticationService(IAccountService accountService, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, RoleManager<ApplicationRole> roleManager, IEmailSender emailService)
        {
            _accountService = accountService;
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _emailService = emailService;
        }

        public async Task<string> GenerateConfirmationToken(ApplicationUser user, string email, bool isChange = false)
        {
            var code = isChange
                ? await _userManager.GenerateChangeEmailTokenAsync(user, email)
                : await _userManager.GenerateEmailConfirmationTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            return code;
        }

        public async Task<string> GenerateForgotPasswordToken(ApplicationUser user, string email)
        {
            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
            return code;
        }

        public async Task<string?> GetUserRole(ApplicationUser user)
        {
            var role = await _userManager.GetRolesAsync(user);
            return role.FirstOrDefault().ToString();
        }

        public async Task SendAccountEmail(string userEmail, string userPassword, string username)
        {
            MailMessage message = new MailMessage();
            try
            {
                await _emailService.SendEmailAsync(
                    userEmail,
                    "Pet-ternary credentials",
                    $"<p>Hello,</p> <p>This is your account:</p> Username: {username} </br> Password: {userPassword}");
            }
            catch (Exception ex)
            {
                throw new BadHttpRequestException(ex.Message);
            }
        }

        public async Task SendConfirmationEmail(string userId, string userEmail)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var token = await GenerateConfirmationToken(user, userEmail);
            var confirmationLink = $"https://localhost:5173/account-confirm?userId={userId}&token={token}";
            MailMessage message = new MailMessage();
            try
            {
                await _emailService.SendEmailAsync(
                    userEmail,
                    "Confirm Your Email Address",
                    $"<p>Please confirm your email address by clicking <a href='{confirmationLink}'>here</a>. 100% reliable no scam.</p>");
            }
            catch (Exception ex)
            {
                throw new BadHttpRequestException(ex.Message);
            }
        }
        public async Task SendReminderEmail(string email, string customerName, string petName, DateOnly? dischargeDate)
        {
            
            string subject = "Reminder: Upcoming Pet Discharge Date";
            string messageBody = $@"
        <html style='color: black !important;'>
        <body style='font-family: Arial, sans-serif; color: black;'>
            <div style='width: 80%; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); color: black !important;'>
                <div style='font-size: 24px; font-weight: bold; margin-bottom: 20px; color: black !important;'>
                    Dear <strong style='color: black !important;'>{customerName}</strong>,
                </div>
                <div style='font-size: 18px; color: black !important;'>
                    <p>This is a friendly reminder that your pet, <strong style='color: black !important;'>{petName}</strong>, is scheduled to be discharged in <strong style='color: black !important;'>{ProjectConstant.DischargeRemindPeriod}</strong> days on <strong style='color: black !important;'>{dischargeDate}</strong>.</p>
                    <p>Please make the necessary arrangements to pick up <strong style='color: black !important;'>{petName}</strong> on the scheduled date.</p>
                    <p>If you have any questions or need to reschedule, feel free to contact us.</p>
                    <p>Thank you for choosing our services.</p>
                </div>
                <div style='margin-top: 20px; font-size: 14px; color: black !important;'>
                    <p>Best regards,</p>
                    <p>Your Pet Care Team</p>
                </div>
            </div>
        </body>
        </html>";

            try
            {
                await _emailService.SendEmailAsync(email, subject, messageBody);
            }
            catch (Exception ex)
            {
                throw new BadHttpRequestException(ex.Message);
            }
        }

        public async Task SendAppointmentEmail(AppointmentEmailDTO appointmentInfor)
        {
            MailMessage message = new MailMessage();
            string emailBody = $@"
            <h2 style='color: #000000;'>Appointment Confirmation</h2>
            <p style='color: #000000;'>Dear {appointmentInfor.CustomerName},</p>
            <p style='color: #000000;'>Thank you for scheduling an appointment with our veterinary hospital. Here are the details of your appointment:</p>
            <ul>
                <li style='color: #000000;'><strong>Appointment Id:</strong> {appointmentInfor.AppointmentId}</li>
                <li style='color: #000000;'><strong>Appointment Date:</strong> {appointmentInfor.appointmentDate}</li>
                <li style='color: #000000;'><strong>Appointment Type:</strong> {appointmentInfor.AppointmentType}</li>
                <li style='color: #000000;'><strong>Veterinarian name:</strong> {appointmentInfor.VeterinarianName}</li>
                <li style='color: #000000;'><strong>Pet name:</strong> {appointmentInfor.PetName}</li>
                <li style='color: #000000;'><strong>Time Slot:</strong> {appointmentInfor.AppointmentTime}</li>
            </ul>
            <p style='color: #000000;'>Pleas go to profile --> Appoinment --> Click on an appointment to get your check in QrCode or show this email to staff to check in</p>
            <p style='color: #000000;'>Best regards,</p>
            <p style='color: #000000;'>Your Veterinary Hospital Team</p>";
            try
            {
                await _emailService.SendEmailAsync(
                    appointmentInfor.Email,
                    "Here is your appointment information:",
                    emailBody);
            }
            catch (Exception ex)
            {
                throw new BadHttpRequestException(ex.Message);
            }
        }

        public async Task SendUpdateDischargeDateEmail(AdmissionRecordEmailDTO adr)
        {
            MailMessage message = new MailMessage();
            string emailBody = $@"
            <h2 style='color: #000000;'>Update pet dischage date</h2>
            <p style='color: #000000;'>Dear {adr.CustomerName},</p>
            <p style='color: #000000;'>This email is to inform you that there is an update for your pet discharge date:</p>
            <ul>
                <li style='color: #000000;'><strong>Pet name:</strong> {adr.PetName}</li>
                <li style='color: #000000;'><strong>Old discharge date:</strong> {adr.OldDischargeDate}</li>
                <li style='color: #000000;'><strong>New discharge date:</strong> {adr.NewDischargeDate}</li>
            </ul>
            <p style='color: #000000;'>Please pick up your pet on the discharge date.</p>
            <p style='color: #000000;'>Note: Pets not picked up within 10 days from the discharge date will be under the management of the hospital.</p>
            <p style='color: #000000;'>Best regards,</p>
            <p style='color: #000000;'>Your Veterinary Hospital Team</p>";
            try
            {
                await _emailService.SendEmailAsync(
                    adr.Email,
                    "Update pet discharge date:",
                    emailBody);
            }
            catch (Exception ex)
            {
                throw new BadHttpRequestException(ex.Message);
            }
        }


        public async Task SendForgotPasswordEmail(ApplicationUser user, string userEmail)
        {
            if (await _userManager.GetEmailAsync(user) != userEmail)
                throw new BadHttpRequestException("Input email does not match with user's");
            var token = await GenerateForgotPasswordToken(user, userEmail);

            //Console.WriteLine(token);
            var confirmationLink = $"https://localhost:5173/reset-password?userId={user.Id}&token={token}";
            MailMessage message = new MailMessage();
            try
            {
                await _emailService.SendEmailAsync(
                    userEmail,
                    "Password reset",
                    $"<p>Reset your password by clicking <a href='{confirmationLink}'>here</a>. 100% reliable no scam.</p>");
            }
            catch (Exception ex)
            {
                throw new BadHttpRequestException(ex.Message);
            }

        }

        public async Task<ResponseUserDTO> SignInGoogle(GoogleLoginModel model)
        {
            var httpClient = new HttpClient();
            var response = await httpClient.GetAsync($"https://oauth2.googleapis.com/tokeninfo?id_token={model.token}");
            if (!response.IsSuccessStatusCode)
            {
                throw new BadHttpRequestException("Failed to verify token.");
            }

            var content = await response.Content.ReadAsStringAsync();
            JObject userInfo = JObject.Parse(content);

            var name = userInfo["given_name"]?.ToString();
            var fullName = userInfo["name"]?.ToString();
            var email = userInfo["email"]?.ToString();

            if (string.IsNullOrEmpty(email))
            {
                throw new BadHttpRequestException("Email not found in token.");
            }

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                AccountDTO newAccount = new AccountDTO
                {
                    FullName = fullName,
                    Email = email,
                    UserName = name + "_" + Nanoid.Generate(size: 5),
                    Password = null,
                    IsMale = false,
                    RoleId = 1,
                    PhoneNumber = null,
                    DateOfBirth = null,

                };
                var acc = await _accountService.CreateAccount(newAccount, true);
                user = new ApplicationUser
                {
                    UserName = acc.AccountId,
                    Email = email,
                    AccountFullname = fullName,
                    EmailConfirmed = true,
                };

                var role = Helpers.GetRole(acc.RoleId);
                var result = await _userManager.CreateAsync(user);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, role);
                }
            }

            if (user.LockoutEnd != null)
            {
                throw new BadHttpRequestException("User account is locked until " + user.LockoutEnd.ToString());
            }

            await _signInManager.SignInAsync(user, true);
            return new ResponseUserDTO
            {
                id = user.UserName,
                role = "Customer"
            };

        }

        public async Task<RegisterErrorDTO?> ValidateUniqueFields(AccountDTO accountDTO)
        {

            RegisterErrorDTO dto = new RegisterErrorDTO();
            bool flag = false;
            // Check if the username is unique
            if (await _accountService.Any(a => a.Username == accountDTO.UserName & !a.IsDisabled))
            {
                dto.username = "Username is already taken";
                flag = true;
            }

            // Check if the email is unique
            if (await _accountService.Any(a => a.Email == accountDTO.Email & !a.IsDisabled))
            {
                dto.email = "Email is already in use";
                flag = true;
            }

            // Check if the phone is unique
            if (await _accountService.Any(a => a.PhoneNumber == accountDTO.PhoneNumber & !a.IsDisabled))
            {
                dto.phonenumber = "Phone number is already in use";
                flag = true;
            }

            return flag ? dto : null;
        }
    }
}
