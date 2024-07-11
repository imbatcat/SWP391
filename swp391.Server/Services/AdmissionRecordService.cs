using Microsoft.AspNetCore.Authentication;
using NanoidDotNet;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services
{
    public class AdmissionRecordService : IAdmissionRecordService
    {
        private readonly IAdmissionRecordRepository _admissionRecordService;
        private readonly AuthInterfaces.IAuthenticationService _authenticationService;

        public AdmissionRecordService(IAdmissionRecordRepository AdmissionRecordService,  AuthInterfaces.IAuthenticationService authenticationService)
        {
            _admissionRecordService = AdmissionRecordService;
            _authenticationService = authenticationService;
        }

        public async Task CreateAdmissionRecord(AdmissionRecordRegisterDTO entity)
        {

            var obj = new AdmissionRecord()
            {
                AdmissionId = GenerateId(),
                AdmissionDate = DateOnly.FromDateTime(DateTime.Now),
                DischargeDate = entity.DischargeDate,
                IsDischarged = entity.IsDischarged,
                PetCurrentCondition = entity.PetCurrentCondition,
                CageId = Convert.ToInt32(entity.CageId),
                PetId = entity.PetId,
                MedicalRecordId = entity.MedicalRecordId,
                VeterinarianAccountId = entity.VeterinarianId,
            };
            await _admissionRecordService.Create(obj);
        }

        public void DeleteAdmissionRecord(AdmissionRecord entity)
        {
            _admissionRecordService.Delete(entity);
        }

        public async Task<AdmissionRecord?> GetAdmissionRecordByPetName(Expression<Func<AdmissionRecord, bool>> expression)
        {
            return await _admissionRecordService.GetByCondition(expression);
        }

        public async Task<IEnumerable<AdmissionRecord>> GetAll()
        {
            return await _admissionRecordService.GetAll();
        }

        public async Task UpdateAdmissionRecord(string id, AdmissionRecordDTO entity)
        {
            var existingRecord = await _admissionRecordService.GetByCondition(a => a.AdmissionId == id);
            AdmissionRecordEmailDTO adr = new AdmissionRecordEmailDTO();
            if (existingRecord != null)
            {
                //
                adr.CustomerName = existingRecord.Pet.Account.FullName;
                adr.Email = existingRecord.Pet.Account.Email;
                adr.OldDischargeDate = existingRecord.DischargeDate;
                adr.NewDischargeDate = entity.DischargeDate;
                adr.PetName = existingRecord.Pet.PetName;
                await _authenticationService.SendUpdateDischargeDateEmail(adr);
                //

                existingRecord.DischargeDate = entity.DischargeDate;
                existingRecord.PetCurrentCondition = entity.PetCurrentCondition;
                existingRecord.IsDischarged = entity.IsDischarged;
            }
            
            await _admissionRecordService.Update(existingRecord);
            
        }

        private string GenerateId()
        {
            var ac = new AdmissionRecord();
            var born = ac.Prefix;
            string id = Nanoid.Generate(size: 8);
            return born + id;
        }
    }
}
