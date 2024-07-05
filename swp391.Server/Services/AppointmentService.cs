using NanoidDotNet;
using PetHealthcare.Server.Core.Constant;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;
using PetHealthcare.Server.Core.Helpers;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly ITimeslotRepository _timeSlotRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IPetRepository _petRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository, ITimeslotRepository timeSlotRepository, IAccountRepository accountRepository, IPetRepository petRepository)
        {
            _appointmentRepository = appointmentRepository;
            _timeSlotRepository = timeSlotRepository;
            _accountRepository = accountRepository;
            _petRepository = petRepository;
        }
        public string GenerateId()
        {
            var prefix = "AP-";
            string id = Nanoid.Generate(size: 8);
            return prefix + id;
        }
        
        public async Task CreateAppointment(CreateAppointmentDTO appointment, string id)
        {
            string CheckinQRCode = QRCodeGeneratorHelper.GenerateQRCode(id);
            Appointment toCreateAppointment = new Appointment
            {
                AppointmentType = appointment.AppointmentType,
                AppointmentDate = appointment.AppointmentDate,
                AppointmentNotes = appointment.AppointmentNotes,
                BookingPrice = ProjectConstant.DEPOSIT_COST,
                PetId = appointment.PetId,
                VeterinarianAccountId = appointment.VeterinarianAccountId,
                AppointmentId = id,
                AccountId = appointment.AccountId,
                TimeSlotId = appointment.TimeSlotId,
                IsCancel = false,
                IsCheckIn = false,
                IsCheckUp = false,
                QRCodeImageUrl = CheckinQRCode
            };
            await _appointmentRepository.Create(toCreateAppointment);
        }

        public void DeleteAppointment(Appointment appointment)
        {
            _appointmentRepository.Delete(appointment);
        }
        public async Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAllAppointment(string vetId)
        {
            IEnumerable<Appointment> appList = await _appointmentRepository.GetAll();
            List<GetAllAppointmentForAdminDTO> CAList = new List<GetAllAppointmentForAdminDTO>();
            foreach (Appointment app in appList)
            {
                if (app.VeterinarianAccountId == vetId)
                {
                    GetAllAppointmentForAdminDTO appointmentDTO = new GetAllAppointmentForAdminDTO
                    {
                        AppointmentId = app.AppointmentId,
                        AppointmentDate = app.AppointmentDate,
                        AppointmentNotes = app.AppointmentNotes,
                        VeterinarianName = app.Veterinarian.FullName,
                        PetName = app.Pet.PetName,
                        BookingPrice = app.BookingPrice,
                        AppointmentType = app.AppointmentType,
                        TimeSlot = app.TimeSlot.StartTime.ToString("H\\:mm") + " - " + app.TimeSlot.EndTime.ToString("H\\:mm"),
                        IsCancel = app.IsCancel,
                        IsCheckIn = app.IsCheckIn,
                        IsCheckUp = app.IsCheckUp,
                        CheckinTime = app.CheckinTime,
                        OwnerName = app.Account.FullName,
                        PhoneNumber = app.Account.PhoneNumber,
                        AccountId = app.AccountId,
                        PetId = app.PetId,
                        VeterinarianId = app.VeterinarianAccountId,
                    };
                    CAList.Add(appointmentDTO);
                }

            }
            return CAList;
        }

        public async Task<Appointment?> GetAppointmentByCondition(Expression<Func<Appointment, bool>> expression)
        {
            return await _appointmentRepository.GetByCondition(expression);
        }

        public bool isVetIdValid(string VetId)
        {
            return _appointmentRepository.isInputtedVetIdValid(VetId);
        }

        public async Task UpdateAppointment(string id, CustomerAppointmentDTO appointment, bool isUpdateDate)
        {
            if (await MaxTimeslotCheck.isMaxTimeslotReached(this, appointment.VeterinarianAccountId, appointment.AppointmentDate, appointment.TimeSlotId, isUpdateDate))
            {
                throw new Exception("Can't update appointment because that timeslot is full");
            }
            Appointment UpdateAppointment = new Appointment
            {
                AppointmentDate = appointment.AppointmentDate,
                AppointmentNotes = appointment.AppointmentNotes,
                VeterinarianAccountId = appointment.VeterinarianAccountId,
                TimeSlotId = appointment.TimeSlotId,
                AppointmentId = id
            };
            await _appointmentRepository.Update(UpdateAppointment);
        }

        public string GetAppointmentStatus(Appointment appointment)
        {
            string status = "Ongoing";
            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
            if (appointment.IsCancel == true)
            {
                status = "Cancel";
            }
            else if (appointment.IsCheckUp == true || appointment.AppointmentDate.CompareTo(currentDate) < 0)
            {
                status = "Finish";
            }
            return status;
        }
        public async Task<IEnumerable<ResAppListForCustomer>> getAllCustomerAppointment(string id, string listType)
        {
            var AccountCheck = await GetAccountById(id);
            if (AccountCheck == null)
            {
                throw new Exception("Can't find that Account");
            }
            IEnumerable<Appointment> appointmentsList = await _appointmentRepository.GetAll();
            List<ResAppListForCustomer> resAppListForCustomers = new List<ResAppListForCustomer>();
            foreach (Appointment appointment in appointmentsList)
            {
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
                if (listType.Equals("history", StringComparison.OrdinalIgnoreCase))
                {
                    if (appointment.AccountId.Equals(id) && appointment.AppointmentDate.CompareTo(currentDate) < 0)
                    {
                        resAppListForCustomers.Add(new ResAppListForCustomer
                        {
                            AppointmentId = appointment.AppointmentId,
                            AppointmentDate = appointment.AppointmentDate,
                            BookingPrice = appointment.BookingPrice,
                            PetName = appointment.Pet.PetName,
                            VeterinarianName = appointment.Veterinarian.FullName,
                            TimeSlot = appointment.TimeSlot.StartTime.ToString("h:mm") + " - " + appointment.TimeSlot.EndTime.ToString("h:mm"),
                            AppointmentStatus = GetAppointmentStatus(appointment)
                        });
                    }
                }
                else if (listType.Equals("current", StringComparison.OrdinalIgnoreCase))
                {
                    if (appointment.AccountId.Equals(id) && appointment.AppointmentDate.CompareTo(currentDate) >= 0)
                    {
                        resAppListForCustomers.Add(new ResAppListForCustomer
                        {
                            AppointmentId = appointment.AppointmentId,
                            AppointmentDate = appointment.AppointmentDate,
                            BookingPrice = appointment.BookingPrice,
                            PetName = appointment.Pet.PetName,
                            VeterinarianName = appointment.Veterinarian.FullName,
                            TimeSlot = appointment.TimeSlot.StartTime.ToString("h:mm") + " - " + appointment.TimeSlot.EndTime.ToString("h:mm"),
                            AppointmentStatus = GetAppointmentStatus(appointment)
                        });
                    }
                }

            }

            //catch error
            if (resAppListForCustomers.Count() == 0 && listType.Equals("current", StringComparison.OrdinalIgnoreCase))
            {
                throw new Exception("The current list is empty");
            }
            else if (resAppListForCustomers.Count() == 0 && listType.Equals("history", StringComparison.OrdinalIgnoreCase))
            {
                throw new Exception("The history list is empty");
            }
            resAppListForCustomers = resAppListForCustomers.OrderBy(a => a.AppointmentDate).ToList();
            return resAppListForCustomers;
        }

        public async Task<IEnumerable<ResAppListForCustomer>> SortAppointmentByDate(string id, string SortList, string SortOrder)
        {
            IEnumerable<ResAppListForCustomer> SortedList = new List<ResAppListForCustomer>();
            IEnumerable<ResAppListForCustomer> allAppointment = await getAllCustomerAppointment(id, SortList);
            if (SortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase))
            {
                SortedList = allAppointment.OrderBy(a => a.AppointmentDate);

            }
            else if (SortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase))
            {
                SortedList = allAppointment.OrderByDescending(a => a.AppointmentDate);
            }
            return SortedList;
        }

        public async Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAllAppointmentByAccountId(string acId)
        {
            IEnumerable<Appointment> AppList = await _appointmentRepository.GetAll();
            List<GetAllAppointmentForAdminDTO> appointmentList = new List<GetAllAppointmentForAdminDTO>();
            if (AppList != null)
            {
                foreach (Appointment app in AppList)
                {
                    if (app.AccountId.Equals(acId))
                    {
                        appointmentList.Add(new GetAllAppointmentForAdminDTO
                        {
                            AccountId = app.AccountId,
                            AppointmentDate = app.AppointmentDate,
                            AppointmentId = app.AppointmentId,
                            AppointmentNotes = app.AppointmentNotes,
                            AppointmentType = app.AppointmentType,
                            BookingPrice = app.BookingPrice,
                            TimeSlot = app.TimeSlot.StartTime.ToString("h:mm") + " - " + app.TimeSlot.EndTime.ToString("h:mm"),
                            IsCancel = app.IsCancel,
                            IsCheckIn = app.IsCheckIn,
                            IsCheckUp = app.IsCheckUp,
                            CheckinTime = app.CheckinTime,
                        });
                    }
                }
            }
            return appointmentList;
        }

        public async Task<IEnumerable<AppointmentForVetDTO>> GetAppointmentsByTimeDate(DateOnly startWeekDate, DateOnly endWeekDate, TimeslotDTO timeSlot)
        {
            var startTime = TimeOnly.Parse(timeSlot.StartTime);
            var endTime = TimeOnly.Parse(timeSlot.EndTime);

            var timeslot = await _timeSlotRepository.GetByCondition(t => t.StartTime == startTime & t.EndTime == endTime);
            var list = await _appointmentRepository.GetAppointmentsOfWeek(startWeekDate, endWeekDate);
            var resList = new List<AppointmentForVetDTO>();
            foreach (Appointment appointment in list)
            {
                var account = await _accountRepository.GetByCondition(a => a.AccountId == appointment.AccountId);
                var pet = await _petRepository.GetByCondition(a => a.PetId == appointment.PetId);
                resList.Add(new AppointmentForVetDTO
                {
                    AppointmentNotes = appointment.AppointmentNotes ?? "",
                    CustomerName = account.FullName,
                    CustomerPhoneNumber = account.PhoneNumber,
                    PetName = pet.PetName,
                    Status = appointment.IsCancel ? "Cancelled" : appointment.IsCheckUp ? "Checked up" : appointment.IsCheckIn ? "Checked in" : "Pending",
                });
            }
            return resList;
        }

        public async Task<Account?> GetAccountById(string id)
        {
            return await _appointmentRepository.GetAccountById(id);
        }

        public async Task<IEnumerable<AppointmentListForVetDTO?>> ViewAppointmentListForVet(string id, DateOnly date)
        {
            IEnumerable<Appointment> appointmentList = await _appointmentRepository.GetAllAppointmentListForVet(id, date);

            List<AppointmentListForVetDTO> appointmentListForVetDTO = new List<AppointmentListForVetDTO>();
            foreach (Appointment app in appointmentList)
            {
                appointmentListForVetDTO.Add(new AppointmentListForVetDTO
                {
                    AppointmentDate = app.AppointmentDate,
                    AppointmentNotes = app.AppointmentNotes,
                    CustomerName = app.Account.FullName,
                    CustomerPhone = app.Account.PhoneNumber,
                    PetName = app.Pet.PetName,
                });
            }
            return appointmentListForVetDTO;
        }

        public async Task<IEnumerable<VetAppointment?>> ViewVetAppointmentList(string id)
        {
            IEnumerable<Appointment> appointmentList = await _appointmentRepository.GetVetAppointmentList(id);
            List<VetAppointment> vetAppointmentList = new List<VetAppointment>();
            foreach (Appointment appointment in appointmentList)
            {
                if (appointment.IsCancel != true && appointment.IsCheckUp != true)
                {
                    string _status = "Waiting";
                    string _petType = "Cat";
                    if (appointment.Pet.IsCat == false)
                    {
                        _petType = "Dog";
                    }
                    if (appointment.IsCheckIn == false)
                    {
                        _status = "Haven't come";
                    }
                    TimeOnly time = appointment.CheckinTime;
                    vetAppointmentList.Add(new VetAppointment
                    {

                        AppointmentId = appointment.AppointmentId,
                        OwnerName = appointment.Account.FullName,
                        PetName = appointment.Pet.PetName,
                        PetBreed = appointment.Pet.PetBreed,
                        TimeSlot = appointment.TimeSlot.StartTime.ToString("h:mm") + " - " + appointment.TimeSlot.EndTime.ToString("h:mm"),
                        AppointmentDate = appointment.AppointmentDate,
                        PhoneNumber = appointment.Account.PhoneNumber,
                        status = _status,
                        AccountId = appointment.AccountId,
                        PetId = appointment.PetId,
                        CheckinTime = appointment.CheckinTime,
                        PetType = _petType,
                    });
                }
            }
            return vetAppointmentList;
        }

        public async Task<bool> UpdateCheckinStatus(string appointmentId)
        {
            Appointment? toCheckInAppointment = await _appointmentRepository.GetByCondition(a => a.AppointmentId == appointmentId);
            if (toCheckInAppointment == null)
            {
                return false;
            }
            else if(toCheckInAppointment.AppointmentDate.CompareTo(DateOnly.FromDateTime(DateTime.Today)) == 0)
            {
                toCheckInAppointment.IsCheckIn = true;
                toCheckInAppointment.CheckinTime = TimeOnly.FromDateTime(DateTime.Now);
                await _appointmentRepository.SaveChanges();
            }
            else
            {
                throw new Exception("Wrong checkin day");
            }
            return true;
        }

        public async Task<IEnumerable<AppointmentForStaffDTO>> GetAllAppointmentForStaff(DateOnly date, int timeslot)
        {
            IEnumerable<Appointment> listAppointments = new List<Appointment>();
            listAppointments = await _appointmentRepository.GetAllAppointmentForStaff(date, timeslot);
            List<AppointmentForStaffDTO> appointmentForStaffDTOs = new List<AppointmentForStaffDTO>();
            foreach (Appointment app in listAppointments)
            {
                if (!app.IsCancel && !app.IsCheckIn && !app.IsCheckUp)
                {
                    appointmentForStaffDTOs.Add(new AppointmentForStaffDTO
                    {

                        //        string appointmentId { get; set;
                        //}
                        //string customerName { get; set; }
                        //string phoneNumber { get; set; }
                        //string petName { get; set; }
                        //string status { get; set; }
                        appointmentId = app.AppointmentId,
                        customerName = app.Account.FullName,
                        phoneNumber = app.Account.PhoneNumber,
                        petName = app.Pet.PetName,
                        status = "Uncheck in",
                        VetName = app.Veterinarian.FullName,
                    });
                }

            }
            return appointmentForStaffDTOs;
        }

        public async Task<IEnumerable<AppointmentForStaffDTO>> GetStaffHistoryAppointment()
        {

            DateOnly curDate = DateOnly.FromDateTime(DateTime.Today);
            IEnumerable<Appointment> appointments = await _appointmentRepository.GetAllAppointmentForStaff(curDate, 0);
            if (appointments.Count() > 0)
            {
                appointments = appointments.OrderByDescending(a => a.IsCancel).OrderByDescending(a => a.CheckinTime).ToList();
            }
            List<AppointmentForStaffDTO> appointmentForStaffDTOs = new List<AppointmentForStaffDTO>();
            foreach (Appointment app in appointments)
            {
                if (app.IsCheckIn)
                {
                    string _status = "Checked in";
                    if (app.IsCancel)
                    {
                        _status = "Cancelled";
                    }
                    else if (app.IsCheckIn)
                    {
                        _status = "Checked in";
                    }
                    appointmentForStaffDTOs.Add(new AppointmentForStaffDTO
                    {
                        appointmentId = app.AppointmentId,
                        customerName = app.Account.FullName,
                        phoneNumber = app.Account.PhoneNumber,
                        petName = app.Pet.PetName,
                        status = _status,
                        VetName = app.Veterinarian.FullName,
                    });
                }


            }
            return appointmentForStaffDTOs;
        }

        public async Task<IEnumerable<Appointment>> GetAll()
        {
            return await _appointmentRepository.GetAll();
        }

        public string GetQRCodeByAppointmentId(string appointmentId)
        {
            return _appointmentRepository.GetQRCodeByAppointmentId(appointmentId);
        }
    }
}

