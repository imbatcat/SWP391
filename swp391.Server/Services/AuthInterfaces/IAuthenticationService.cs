﻿using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Core.DTOS.Auth;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Models.ApplicationModels;

namespace PetHealthcare.Server.Services.AuthInterfaces
{
    public interface IAuthenticationService
    {
        Task SendConfirmationEmail(string userId, string userEmail);
        Task SendForgotPasswordEmail(ApplicationUser userId, string userEmail);
        Task SendAccountEmail(string userEmail, string userPassword, string username);
        Task<string> GenerateConfirmationToken(ApplicationUser user, string email, bool isChange = false);
        Task<string> GenerateForgotPasswordToken(ApplicationUser user, string email);
        Task<string?> GetUserRole(ApplicationUser user);
        Task<ResponseUserDTO> SignInGoogle(GoogleLoginModel model);

        bool ValidateUserStatus(ApplicationUser user);
        Task<RegisterErrorDTO?> ValidateUniqueFields(AccountDTO accountDTO);
        Task SendUpdateDischargeDateEmail(AdmissionRecordEmailDTO adr);
        Task SendAppointmentEmail(AppointmentEmailDTO appointmentInfor);
        Task SendReminderEmail(string email, string customerName, string petName, DateOnly? dischargeDate);
    }
}
