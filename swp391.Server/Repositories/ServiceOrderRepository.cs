using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using NanoidDotNet;
using PetHealthcare.Server.Core.DTOS.ServiceOrderDTOs;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using SQLitePCL;
using System.Linq.Expressions;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Diagnostics;

namespace PetHealthcare.Server.Repositories
{
    public class ServiceOrderRepository : IServiceOrderRepository
    {
        private readonly PetHealthcareDbContext context;
        public ServiceOrderRepository(PetHealthcareDbContext context)
        {
            this.context = context;
        }

        public string GenerateId()
        {
            string prefix = "SR-";
            string id = Nanoid.Generate(size: 8);
            return prefix + id;
        }
        public Task Create(ServiceOrder entity)
        {
            throw new NotImplementedException();
        }

        public async Task CreateServiceOrder(ServiceOrderDTO order)
        {
            string SoId = GenerateId();
            bool isHospitalBill = false;
            try
            {
                foreach (int serviceId in order.ServiceId) 
                {
                    if(serviceId == 9)
                    {
                        isHospitalBill = true;
                    }
                    context.ServiceOrderDetails.Add(new ServiceOrderDetails
                    {
                        ServiceId = serviceId,
                        ServiceOrderId = SoId,
                    });
                }
                if(isHospitalBill) //calculating hospital fees
                {
                    AdmissionRecord adms = await context.AdmissionRecords.FirstOrDefaultAsync(ad => ad.MedicalRecordId.Equals(order.MedicalRecordId));
                    DateOnly dischargeDate = new DateOnly(adms.DischargeDate.Value.Year, adms.DischargeDate.Value.Month, adms.DischargeDate.Value.Day);
                    DateOnly admissionDate = new DateOnly(adms.AdmissionDate.Value.Year, adms.AdmissionDate.Value.Month, adms.AdmissionDate.Value.Day);
                    // Subtracting two DateOnly instances to get the difference in days
                    int daysDifference = (dischargeDate.ToDateTime(TimeOnly.MinValue) - admissionDate.ToDateTime(TimeOnly.MinValue)).Days;
                    double hospitalFees = context.Services.FirstOrDefault(s => s.ServiceId == 9).ServicePrice;

                    ServiceOrder toCreateServiceOrder = new ServiceOrder
                    {
                        ServiceOrderId = SoId,
                        OrderDate = DateOnly.FromDateTime(DateTime.Today),
                        OrderStatus = "Pending",
                        MedicalRecordId = order.MedicalRecordId,
                        Price = hospitalFees * daysDifference,
                    };
                    context.ServiceOrders.Add(toCreateServiceOrder);
                } else
                {

                    ServiceOrder toCreateServiceOrder = new ServiceOrder
                    {
                        ServiceOrderId = SoId,
                        OrderDate = DateOnly.FromDateTime(DateTime.Today),
                        OrderStatus = "Pending",
                        MedicalRecordId = order.MedicalRecordId,
                        Price = context.Services.Where(s => order.ServiceId.Contains(s.ServiceId)).Sum(s => s.ServicePrice),
                    };
                    context.ServiceOrders.Add(toCreateServiceOrder);
                }
                
                await SaveChanges();
            } catch(NullReferenceException)
            {
                Debug.WriteLine("Null exception");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                Console.WriteLine("Error");
            }

        }



        public void Delete(ServiceOrder entity)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<ServiceOrder>> GetAll()
        {
            return await context.ServiceOrders.Include(s => s.MedicalRecord).Include(s => s.ServiceOrderDetails).ToListAsync();
        }

        public async Task<ServiceOrder?> GetByCondition(Expression<Func<ServiceOrder, bool>> expression)
        {
            return await context.ServiceOrders.FirstOrDefaultAsync(expression);
        }

        public async Task SaveChanges()
        {

            await context.SaveChangesAsync();
        }

        public async Task Update(ServiceOrder entity)
        {

        }
        public async Task UpdateServiceOrder(string serviceOrderId, List<int> ServiceId)
        {
            ServiceOrder? toUpdateServiceOrder = await context.ServiceOrders.FirstOrDefaultAsync(s => s.ServiceOrderId.Equals(serviceOrderId));
            if (toUpdateServiceOrder == null)
            {
                return;
            }
            else
            {
                //remove old ServiceOrderDetail than replace it by the new ones
                var toRemoveOrderDetails = context.ServiceOrderDetails.Where(s => s.ServiceOrderId.Equals(toUpdateServiceOrder.ServiceOrderId)).ToList();
                context.ServiceOrderDetails.RemoveRange(toRemoveOrderDetails);
                //Add new ones
                double newPrice = 0;
                foreach (int serviceId in ServiceId)
                {
                    context.ServiceOrderDetails.Add(new ServiceOrderDetails
                    {
                        ServiceId = serviceId,
                        ServiceOrderId = serviceOrderId,
                    });
                    newPrice += context.Services.Find(serviceId).ServicePrice;
                }
                toUpdateServiceOrder.Price = newPrice; //new Price
                await SaveChanges();
            }
        }

        public async Task<IEnumerable<GetAllServiceOrderForStaff>> GetServiceOrderListForStaff(DateOnly date, bool isUnpaidList)
        {
            //    public string ServiceOrderId { get; set; }
            //public double Price { get; set; }
            //public DateOnly OrderDate { get; set; }
            //public string OrderStatus { get; set; }
            //public string customerName { get; set; }
            var orderServiceList = context.ServiceOrders.Include("MedicalRecord.Appointment.Account");

            List<GetAllServiceOrderForStaff> ServiceOrderForStaff = new List<GetAllServiceOrderForStaff>();
            if(isUnpaidList)
            {
                foreach (ServiceOrder order in orderServiceList)
                {
                    if(order.OrderStatus.Equals("Pending", StringComparison.OrdinalIgnoreCase) && date.CompareTo(order.OrderDate) == 0)
                    {
                        ServiceOrderForStaff.Add(new GetAllServiceOrderForStaff
                        {
                            ServiceOrderId = order.ServiceOrderId,
                            Price = order.Price,
                            OrderDate = order.OrderDate,
                            OrderStatus = order.OrderStatus,
                            customerName = order.MedicalRecord.Appointment.Account.FullName,
                            customerPhone = order.MedicalRecord.Appointment.Account.PhoneNumber
                        });
                    }
                }
            } else
            {
                
                foreach (ServiceOrder order in orderServiceList)
                {
                    if (date.CompareTo(order.OrderDate) == 0)
                    {
                        ServiceOrderForStaff.Add(new GetAllServiceOrderForStaff
                        {
                            ServiceOrderId = order.ServiceOrderId,
                            Price = order.Price,
                            OrderDate = order.OrderDate,
                            OrderStatus = order.OrderStatus,
                            customerName = order.MedicalRecord.Appointment.Account.FullName,
                            customerPhone = order.MedicalRecord.Appointment.Account.PhoneNumber
                        });
                    }
                }
            }
            
            return ServiceOrderForStaff;
        }

        public async Task<bool> UpdateServiceOrderStatus(string serviceOrderId)
        {
            string servicePaymentId = "SP-" + Nanoid.Generate(size: 8);
            ServiceOrder? serviceOrder = await context.ServiceOrders.FindAsync(serviceOrderId);
            if (serviceOrder != null)
            {
                serviceOrder.OrderStatus = "Paid";
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<GetAllServiceOrderForStaff>> getAllServiceOrderForStaff()
        {
            var orderServiceList = context.ServiceOrders.Include("MedicalRecord.Appointment.Account");

            List<GetAllServiceOrderForStaff> ServiceOrderForStaff = new List<GetAllServiceOrderForStaff>();
            foreach (ServiceOrder order in orderServiceList)
            {
                    ServiceOrderForStaff.Add(new GetAllServiceOrderForStaff
                    {
                        ServiceOrderId = order.ServiceOrderId,
                        Price = order.Price,
                        OrderDate = order.OrderDate,
                        OrderStatus = order.OrderStatus,
                        customerName = order.MedicalRecord.Appointment.Account.FullName,
                        customerPhone = order.MedicalRecord.Appointment.Account.PhoneNumber
                    });
            }
            return ServiceOrderForStaff;
        }

        public async Task<ServiceOrderInfor> getServiceOrderInforByServiceId(string serviceOrderId)
        {
            ServiceOrder? serviceOrder = await context.ServiceOrders.Include("MedicalRecord.Appointment.Account").Include("MedicalRecord.Pet").FirstOrDefaultAsync(o => o.ServiceOrderId.Equals(serviceOrderId));
            string PetGender = "Female";
            if (serviceOrder.MedicalRecord.Pet.IsMale)
            {
                PetGender = "Male";
            }
            ServiceOrderInfor serviceOrderInfor = new ServiceOrderInfor 
            {
                ServiceOrderId = serviceOrderId,
                CreatedDate = serviceOrder.OrderDate,
                diagnosis = serviceOrder.MedicalRecord.Diagnosis,
                OwnerName = serviceOrder.MedicalRecord.Appointment.Account.FullName,
                PetAge = DateOnly.FromDateTime(DateTime.Today).Year - serviceOrder.MedicalRecord.Pet.PetAge.Year,
                PetGender = PetGender,
                PetName = serviceOrder.MedicalRecord.Pet.PetName,
            };
            return serviceOrderInfor;
        }
    }
}
