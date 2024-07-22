
using PetHealthcare.Server.Services.Interfaces;

namespace PetHealthcare.Server.Services.BackgroundServices
{
    public class CancelOverdueAppointmentService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public CancelOverdueAppointmentService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            //await CancelOverdueAppointment();
            //await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }

        private async Task CancelOverdueAppointment()
        {
            using(var scope = _scopeFactory.CreateScope())
            {
                IAppointmentService appointmentService = scope.ServiceProvider.GetRequiredService<IAppointmentService>();
                await appointmentService.CancelOverdueAppointment();
            }
        }
    }
}
