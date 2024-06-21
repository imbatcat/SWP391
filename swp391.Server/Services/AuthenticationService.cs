﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.WebUtilities;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.Auth;
using PetHealthcare.Server.Models.ApplicationModels;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Net.Mail;
using System.Text;

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

        public async Task SendConfirmationEmail(string userId, string userEmail)
        {
            var user = await _userManager.FindByIdAsync(userId);
            var token = await GenerateConfirmationToken(user, userEmail);
            //Console.WriteLine(token);
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
