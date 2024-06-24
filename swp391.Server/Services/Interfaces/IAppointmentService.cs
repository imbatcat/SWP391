﻿using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Models;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAllAppointment();
        Task<Appointment?> GetAppointmentByCondition(Expression<Func<Appointment, bool>> expression);
        Task CreateAppointment(CreateAppointmentDTO appointment, string id);
        Task UpdateAppointment(string id, CustomerAppointmentDTO appointment);
        void DeleteAppointment(Appointment appointment);

        Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAllAppointmentByAccountId(string acId);
        Task<IEnumerable<AppointmentForVetDTO>> GetAppointmentsByTimeDate(DateOnly startWeekDate, DateOnly endWeekDate, TimeslotDTO timeSlot);
        Task<IEnumerable<ResAppListForCustomer>> getAllCustomerAppointment(string id, string listType);
        Task<IEnumerable<ResAppListForCustomer>> SortAppointmentByDate(string id, string SortList, string SortOrder);

        bool isVetIdValid(string id);
        string GenerateId();

        Task<Account?> GetAccountById(string id);
        Task<IEnumerable<AppointmentListForVetDTO?>> ViewAppointmentListForVet(string id);
        Task<IEnumerable<VetAppointment?>> ViewVetAppointmentList(string id, int timeSlot, DateOnly date);
        Task<bool> UpdateCheckinStatus(string appointmentId);

        Task<IEnumerable<AppointmentForStaffDTO>> GetAllAppointmentForStaff(DateOnly date, int timeslot);

        Task<IEnumerable<AppointmentForStaffDTO>> GetStaffHistoryAppointment();
    }
}
