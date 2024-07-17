using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
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
        public async Task<IEnumerable<GetAllAppointmentForAdminDTO>> GetAllAppointment()
        {
            IEnumerable<GetAllAppointmentForAdminDTO> appList = await _appointmentRepository.GetAppointments();
            var CAList = appList.AsParallel().Select(app => new GetAllAppointmentForAdminDTO
            {
                AppointmentId = app.AppointmentId,
                AppointmentDate = app.AppointmentDate,
                AppointmentNotes = app.AppointmentNotes,
                VeterinarianName = app.VeterinarianName,
                PetName = app.PetName,
                BookingPrice = app.BookingPrice,
                AppointmentType = app.AppointmentType,
                TimeSlot = app.TimeSlot,
                TimeSlotId = app.TimeSlotId,
                IsCancel = app.IsCancel,
                IsCheckIn = app.IsCheckIn,
                IsCheckUp = app.IsCheckUp,
                CheckinTime = app.CheckinTime,
                OwnerName = app.OwnerName,
                PhoneNumber = app.PhoneNumber,
                AccountId = app.AccountId,
                PetId = app.PetId,
                VeterinarianId = app.VeterinarianId
                
            }).ToList();
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

        public string GetAppointmentStatus(GetAllAppointmentForAdminDTO appointment)
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
            var appointmentsList = await _appointmentRepository.GetAppointments();
            appointmentsList = appointmentsList.Where(appointment =>
            {
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
                if (listType.Equals("history", StringComparison.OrdinalIgnoreCase))
                {
                    return appointment.AccountId.Equals(id) && appointment.AppointmentDate.CompareTo(currentDate) < 0;
                }
                else 
                {
                    return appointment.AccountId.Equals(id) && appointment.AppointmentDate.CompareTo(currentDate) >= 0;
                }
            });
            var resAppListForCustomers = appointmentsList.Select(appointment =>
            {
                DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
                if (appointment.AccountId.Equals(id))
                {
                    if (listType.Equals("history", StringComparison.OrdinalIgnoreCase))
                    {
                        if (appointment.AppointmentDate.CompareTo(currentDate) < 0)
                        {
                            return new ResAppListForCustomer
                            {
                                AppointmentId = appointment.AppointmentId,
                                AppointmentDate = appointment.AppointmentDate,
                                BookingPrice = appointment.BookingPrice,
                                PetName = appointment.PetName,
                                VeterinarianName = appointment.VeterinarianName,
                                TimeSlot = appointment.TimeSlot,
                                AppointmentStatus = GetAppointmentStatus(appointment)
                            };
                        }
                    }
                    else 
                    {
                        if ( appointment.AppointmentDate.CompareTo(currentDate) >= 0)
                        {
                            return new ResAppListForCustomer
                            {
                                AppointmentId = appointment.AppointmentId,
                                AppointmentDate = appointment.AppointmentDate,
                                BookingPrice = appointment.BookingPrice,
                                PetName = appointment.PetName,
                                VeterinarianName = appointment.VeterinarianName,
                                TimeSlot = appointment.TimeSlot,
                                AppointmentStatus = GetAppointmentStatus(appointment)
                            };
                        }
                    }
                }
                //this line exists for preventing compile error
                return null; 
            }).OrderBy(a => a.AppointmentStatus).ToList();
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

        public async Task<IEnumerable<GetAllAppointmentForAdminDTO?>> ViewAppointmentListForVet(string vetId)
        {
            var appList = await _appointmentRepository.GetAppointments();
            appList = appList.Where(a => a.VeterinarianId.Equals(vetId)).ToList();
            var CAList = appList.Select(app => new GetAllAppointmentForAdminDTO
            {
                AppointmentId = app.AppointmentId,
                AppointmentDate = app.AppointmentDate,
                AppointmentNotes = app.AppointmentNotes,
                VeterinarianName = app.VeterinarianName,
                PetName = app.PetName,
                BookingPrice = app.BookingPrice,
                AppointmentType = app.AppointmentType,
                TimeSlot = app.TimeSlot,
                IsCancel = app.IsCancel,
                IsCheckIn = app.IsCheckIn,
                IsCheckUp = app.IsCheckUp,
                CheckinTime = app.CheckinTime,
                OwnerName = app.OwnerName,
                PhoneNumber = app.PhoneNumber,
                AccountId = app.AccountId,
                PetId = app.PetId,
                VeterinarianId = app.VeterinarianId
            }).ToList();

            return CAList;
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

        public async Task<int> getNearestFreeTimeSlot(string vetId, DateOnly date, int timeslotId)
        {
            int currentTimeSlot = CurrentTimeSlotCheck.getCurrentTimeSlot();
            if(currentTimeSlot == 6)
            {
                throw new Exception("Customer checkin after slot 6, the hospital is closed");
            }
            int freeTimeSlot = 0;
            for(int i=currentTimeSlot; i<=6; i++) // 1 to 6 is the timeslot id
            {
                if (!await MaxTimeslotCheck.isMaxTimeslotReached(this, vetId, date, i, true))
                {
                    freeTimeSlot = i;
                    break;
                }
            }
            return freeTimeSlot;
        }
        public async Task<bool> UpdateCheckinStatus(string appointmentId)
        {
            Appointment? toCheckInAppointment = await _appointmentRepository.GetByCondition(a => a.AppointmentId == appointmentId);
            if (toCheckInAppointment == null)
            {
                return false;
            }
            //if (toCheckInAppointment.TimeSlot.EndTime <TimeOnly.FromDateTime(DateTime.Now))
            //{
            //    int newTimeSlot = await getNearestFreeTimeSlot(toCheckInAppointment.VeterinarianAccountId, DateOnly.FromDateTime(DateTime.Today), toCheckInAppointment.TimeSlotId);
            //    if (newTimeSlot == 0)
            //    {
            //        throw new Exception("There is an error with getting nearest free timeslot");
            //    }
            //    else
            //    {
            //        toCheckInAppointment.TimeSlotId = newTimeSlot;
            //        await _appointmentRepository.SaveChanges();
            //    }   
            //}
            if(toCheckInAppointment.AppointmentDate.CompareTo(DateOnly.FromDateTime(DateTime.Today)) == 0)
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
                        isCheckin = app.IsCheckIn,
                        isCheckup = app.IsCheckUp,
                        isCancel = app.IsCancel,
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
                        isCancel = app.IsCancel,
                        isCheckup = app.IsCheckUp,
                        isCheckin = app.IsCheckIn,
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

        public async Task<IEnumerable<AppointmentForStaffDTO>> GetAllAppointmentsForStaff()
        {
            var appointmentList = await _appointmentRepository.GetAll();
            List<AppointmentForStaffDTO> appList = new List<AppointmentForStaffDTO>();
            foreach (Appointment app in appointmentList)
            {
                if (app.AppointmentDate.CompareTo(DateOnly.FromDateTime(DateTime.Today)) < 0 && app.IsCheckUp == false)
                {
                    app.IsCancel = true;
                }
            }
            await _appointmentRepository.SaveChanges();
            foreach (Appointment app in appointmentList)
            {
                appList.Add(new AppointmentForStaffDTO
                {
                    appointmentId = app.AppointmentId,
                    customerName = app.Account.FullName,
                    petName = app.Pet.PetName,
                    phoneNumber = app.Account.PhoneNumber,
                    appointmentDate = app.AppointmentDate,
                    isCancel = app.IsCancel,
                    isCheckin = app.IsCheckIn,
                    isCheckup = app.IsCheckUp,
                });
            }
            return appList;
        }

        public async Task<AppointmentEmailDTO> CreateAppointmentEmail(string appointmentId)
        {
            AppointmentEmailDTO appointmentEmail = new AppointmentEmailDTO();
            try
            {
                Appointment app = await _appointmentRepository.GetByCondition(a => a.AppointmentId == appointmentId);
                AppointmentEmailDTO appointment = new AppointmentEmailDTO
                {
                    CustomerName = app.Account.FullName,
                    Email = app.Account.Email,
                    AppointmentTime = Convert.ToString(app.TimeSlot.StartTime) +"  -  " + Convert.ToString(app.TimeSlot.EndTime),
                    PetName = app.Pet.PetName,
                    VeterinarianName = app.Veterinarian.FullName,
                    CheckinQr = app.QRCodeImageUrl,
                    appointmentDate = app.AppointmentDate,
                    AppointmentType = app.AppointmentType,
                    AppointmentId = appointmentId,
                };
                appointmentEmail = appointment;
            }
            catch (Exception ex)
            {
                throw new Exception("Error with creating appointment email");
            }
            return appointmentEmail;
        }
    }
}

