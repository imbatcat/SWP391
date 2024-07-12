using Microsoft.EntityFrameworkCore;
using NanoidDotNet;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using System.Diagnostics;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly PetHealthcareDbContext context;
        public AppointmentRepository(PetHealthcareDbContext context)
        {
            this.context = context;
        }
        public AppointmentRepository() { }
        public async Task Create(Appointment entity)
        {
            await context.Appointments.AddAsync(entity);
            await SaveChanges();
        }
        public bool isInputtedVetIdValid(string id)
        {
            if (context.Accounts.Find(id) != null)
            {
                if (id.StartsWith('V'))
                { return true; }
            }
            return false;
        }
        public void Delete(Appointment entity)
        {
            context.Appointments.Remove(entity);
            context.SaveChanges();
        }

        public async Task<IEnumerable<Appointment>> GetAll()
        {
            return await context.Appointments
                .Include(a => a.Account)
                .Include(a => a.Pet)
                .Include(a => a.Veterinarian)
                .Include(a => a.TimeSlot)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAppointments()
        {
            return await context.Appointments
                .Include(a => a.Account)
                .Include(a => a.Pet)
                .Include(a => a.Veterinarian)
                .Include(a => a.TimeSlot)
                .AsNoTracking()
                .Select(a => new GetAllAppointmentForAdminDTO {
                    AppointmentId =  a.AppointmentId,
                    AppointmentDate =  a.AppointmentDate,
                    AppointmentNotes = a.AppointmentNotes,
                    AppointmentType = a.AppointmentType,
                    OwnerName = a.Account.FullName,
                    AccountId = a.AccountId,
                    PhoneNumber = a.Account.PhoneNumber,
                    PetName = a.Pet.PetName,
                    PetId = a.PetId,
                    VeterinarianId = a.Veterinarian.AccountId,
                    VeterinarianName = a.Veterinarian.FullName,
                    TimeSlot = $"{a.TimeSlot.StartTime:H\\:mm} - {a.TimeSlot.EndTime:H\\:mm}",
                    BookingPrice = a.BookingPrice,
                    IsCancel = a.IsCancel,
                    IsCheckIn = a.IsCheckIn,
                    IsCheckUp = a.IsCheckUp,
                    CheckinTime = a.CheckinTime
                })
                .ToListAsync();

        }

        public async Task<Appointment?> GetByCondition(Expression<Func<Appointment, bool>> expression)
        {
            return await context.Appointments.Include(a => a.TimeSlot).Include(a => a.Pet).Include(a => a.Veterinarian).Include(a => a.Account).FirstOrDefaultAsync(expression);
        }

        public async Task SaveChanges()
        {
            await context.SaveChangesAsync();
        }

        public async Task Update(Appointment entity)
        {
            var appointment = await GetByCondition(a => a.AppointmentId == entity.AppointmentId);
            if (appointment != null)
            {
                // this line ensures efcore to update the table.
                context.Entry(appointment).State = EntityState.Modified;

                appointment.AppointmentDate = entity.AppointmentDate;
                appointment.AppointmentNotes = entity.AppointmentNotes;
                appointment.VeterinarianAccountId = entity.VeterinarianAccountId;
                appointment.TimeSlotId = entity.TimeSlotId;
                await SaveChanges();
            }
        }

        //public async Task<IEnumerable<Appointment>> GetAppointmentsByDate(TimeSlot timeslot)
        //{
        //    return await context.Appointments.Where(app => app.TimeSlot == timeslot).ToListAsync();
        //}

        public async Task<IEnumerable<Appointment>> GetAppointmentsOfWeek(DateOnly startWeekDate, DateOnly endWeekDate)
        {
            return await context.Appointments
                .Where(app => app.AppointmentDate.CompareTo(startWeekDate) >= 0 &
                        app.AppointmentDate.CompareTo(endWeekDate) <= 0 &
                        app.IsCancel == false)
                .ToListAsync();
        }
        public async Task<Account?> GetAccountById(string id)
        {
            return await context.Accounts.FindAsync(id);
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentListForVet(string vetId, DateOnly date)
        {
            IEnumerable<Appointment> appointmentListForVetDTOs = await context.Appointments.Where(a => a.VeterinarianAccountId.Equals(vetId) && a.AppointmentDate.CompareTo(date) == 0 && a.IsCancel == false).Include("Account").Include("Pet").ToListAsync();
            return appointmentListForVetDTOs;
        }

        public async Task<IEnumerable<Appointment>> GetVetAppointmentList(string vetId)
        {
            IEnumerable<Appointment> appointmentList = new List<Appointment>();
            appointmentList = await context.Appointments.Include("Account").Include("Pet").Include("TimeSlot").ToListAsync();
            return appointmentList;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentForStaff(DateOnly date, int timeslot)
        {
            IEnumerable<Appointment> appList = new List<Appointment>();
            if (timeslot == 0)
            {
                appList = context.Appointments.Where(a => a.AppointmentDate.CompareTo(date) == 0).Include("Account").Include("Pet").Include("Veterinarian");
            }
            else
            {
                appList = context.Appointments.Where(a => a.AppointmentDate.CompareTo(date) == 0 && a.TimeSlotId == timeslot).Include("Account").Include("Pet").Include("Veterinarian");
            }
            Debug.WriteLine(appList.Count());
            return appList;
        }

        public string GetQRCodeByAppointmentId(string appointmentId)
        {
            return context.Appointments.Find(appointmentId).QRCodeImageUrl;
        }

    }
}
