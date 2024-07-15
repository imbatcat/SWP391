
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Diagnostics;

namespace PetHealthcare.Server.Services.BackgroundServices
{
    public class DischargeEmailReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public DischargeEmailReminderService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await SendRemindersEmailAsync();
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }

        private async Task SendRemindersEmailAsync()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                IAuthenticationService authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
                IAdmissionRecordService admissionRecordService = scope.ServiceProvider.GetRequiredService<IAdmissionRecordService>();
                try
                {
                    IEnumerable<AdmissionRecord> toSendEmailAdmissionRecord = await admissionRecordService.GetAdmissionToRemind();
                    foreach(AdmissionRecord admissionToSend in toSendEmailAdmissionRecord)
                    {
                        await authenticationService.SendReminderEmailTest(admissionToSend.CustomerEmail, admissionToSend.CustomerName, admissionToSend.petName, admissionToSend.DischargeDate);
                    }
                    await admissionRecordService.SetAdmissionIsRemindStatus(toSendEmailAdmissionRecord);
                    Debug.WriteLine("Reminder email sent successfully.");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine(ex, "Failed to send reminder email.");
                }
            }
        }
    }
}
