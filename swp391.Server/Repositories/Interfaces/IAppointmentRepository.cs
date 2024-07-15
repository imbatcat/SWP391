using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Models;

namespace PetHealthcare.Server.Repositories.Interfaces
{
    public interface IAppointmentRepository : IRepositoryBase<Appointment>
    {
        bool isInputtedVetIdValid(string id);
        Task<IEnumerable<Appointment>> GetAppointmentsOfWeek(DateOnly startWeekDate, DateOnly endWeekDate);
        Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAppointments();

        Task<Account?> GetAccountById(string id);

        Task<IEnumerable<Appointment>> GetAllAppointmentListForVet(string vetId, DateOnly date);
        Task<IEnumerable<Appointment>> GetVetAppointmentList(string vetId);

        Task CheckUpAppointment(string appointmentId);
        Task<IEnumerable<Appointment>> GetAllAppointmentForStaff(DateOnly date, int timeslot);

        Task<IEnumerable<RequestResAppListForCustomer>> GetAllCustomerAppointment();
        string GetQRCodeByAppointmentId(string appointmentId);
    }
}
