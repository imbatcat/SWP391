﻿using Microsoft.AspNetCore.Authentication;
using Microsoft.CodeAnalysis.FlowAnalysis.DataFlow;
using NanoidDotNet;
using PetHealthcare.Server.Core.Constant;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services.AuthInterfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Diagnostics;
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
            var admission = await _admissionRecordService.GetByCondition(a => a.PetId.Equals(entity.PetId));
            if (admission != null)
            {
                throw new BadHttpRequestException("Pet has already been hospitalized");
            }
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

        public async Task<IEnumerable<AdmissionRecord>> GetAdmissionToRemind()
        {
            IEnumerable<AdmissionRecord> admissionRecord = await _admissionRecordService.GetAll();
            List<AdmissionRecord> remindAdmissionList = new List<AdmissionRecord>();
            foreach(AdmissionRecord entity in admissionRecord)
            {
                DateOnly ToCompareDate = DateOnly.FromDateTime(DateTime.Today).AddDays(ProjectConstant.DischargeRemindPeriod);
                if (entity.DischargeDate == ToCompareDate && entity.IsRemind == false)
                {
                    remindAdmissionList.Add(entity);
                }
            }
            remindAdmissionList.Count();
            return remindAdmissionList;
        }

        public async Task SetAdmissionIsRemindStatus(IEnumerable<AdmissionRecord> ToUpdateAdmissionRecordList)
        {
            if(ToUpdateAdmissionRecordList.Count() > 0)
            {
                IEnumerable<AdmissionRecord> admissionRecordList = await _admissionRecordService.GetAll();
                foreach (AdmissionRecord updateStatus in ToUpdateAdmissionRecordList)
                {
                    updateStatus.IsRemind = true;
                    await _admissionRecordService.Update(updateStatus);
                }
            } else
            {
                Debug.WriteLine("No appointment to update");
            }
        }
        public async Task UpdateAdmissionRecord(string id, AdmissionRecordDTO entity)
        {
            var existingRecord = await _admissionRecordService.GetByCondition(a => a.AdmissionId == id);
            if(entity.DischargeDate != existingRecord.DischargeDate)
            {
                existingRecord.IsRemind = false;
            }
            AdmissionRecordEmailDTO adr = new AdmissionRecordEmailDTO();
            if (existingRecord != null)
            {
                //
                adr.CustomerName = existingRecord.CustomerName;
                adr.Email = existingRecord.CustomerEmail;
                adr.OldDischargeDate = existingRecord.DischargeDate;
                adr.NewDischargeDate = entity.DischargeDate;
                adr.PetName = existingRecord.petName;
                await _authenticationService.SendUpdateDischargeDateEmail(adr);
                //

                existingRecord.DischargeDate = entity.DischargeDate;
                if(existingRecord.DischargeDate <= DateOnly.FromDateTime(DateTime.Today).AddDays(ProjectConstant.DischargeRemindPeriod))
                {
                    await _authenticationService.SendReminderEmail(adr.Email, adr.CustomerName, adr.PetName, adr.NewDischargeDate);
                }
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

        public async Task<IEnumerable<AdmissionRecordForDoctorDTO>> GetAllAdmissionRecordForVet(string vetId)
        {
            List<AdmissionRecordForDoctorDTO> admissionRecordList = new List<AdmissionRecordForDoctorDTO>();
            IEnumerable<AdmissionRecordForDoctorDTO> admissionRecordForDoctorsList = await _admissionRecordService.GetAllAdmissionRecordForVet();
            foreach(AdmissionRecordForDoctorDTO admission in  admissionRecordForDoctorsList)
            {
                if(admission.VetId == vetId && !admission.IsDischarged)
                {
                    admissionRecordList.Add(admission);
                }
            }
            return admissionRecordList;
        }
    }
}
