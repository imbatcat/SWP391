﻿using NanoidDotNet;
using PetHealthcare.Server.APIs.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Drawing;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services
{
    public class AdmissionRecordService : IAdmissionRecordService
    {
        private readonly IAdmissionRecordRepository _admissionRecordService;

        public AdmissionRecordService(IAdmissionRecordRepository AdmissionRecordService)
        {
            _admissionRecordService = AdmissionRecordService;
        }

        public async Task CreateAdmissionRecord(AdmissionRecordDTO entity)
        {
            //bool res = await ConfirmAdmissionRecordIdentity(entity.MedicalRecordId, entity);
            //var res1 = await ConfirmAdmissionRecordIdentity(entity.MedicalRecordId, entity);
            //var res2 = await ConfirmAdmissionRecordIdentity(entity.MedicalRecordId, entity);

            var obj = new AdmissionRecord() {
                AdmissionId = GenerateId(),
                AdmissionDate = DateOnly.FromDateTime(DateTime.Now),
                DischargeDate = entity.DischargeDate,
                IsDischarged = entity.IsDischarged,
                PetCurrentCondition = entity.PetCurrentCondition, 
                CageId = 2 ,//entity.CageId,
                PetId = "PE-00000005",//entity.PetId,   
                MedicalRecordId = "ME-00000005",//entity.MedicalRecordId,
                VeterinarianAccountId = "VE-00000004",
            };
            await _admissionRecordService.Create(obj);
        }

        public void DeleteAdmissionRecord(AdmissionRecord entity)
        {
            _admissionRecordService.Delete(entity);
        }

        public async Task<AdmissionRecord?> GetAdmissionRecordByCondition(Expression<Func<AdmissionRecord, bool>> expression)
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
            if (existingRecord != null)
            {
                existingRecord.DischargeDate = entity.DischargeDate;
                existingRecord.PetCurrentCondition = entity.PetCurrentCondition;
                existingRecord.IsDischarged = entity.IsDischarged;                
            }
            await _admissionRecordService.Update(existingRecord);
        }

        private string GenerateId()
        {
            var ac = new AdmissionRecord();
            var born  = ac.Prefix;
            string id = Nanoid.Generate(size: 8);
            return born + id;
        }

        //public async Task<bool> ConfirmAdmissionRecordIdentity(string Id, AdmissionRecordDTO newPet)
        //{
        //    // newPet's name, breed and isCat must not match any pets of this owner in the database

        //    //get list of pet by accound id, then check if theres any pet in the database matches the 
        //    //mentioned props of newPets, if yes then return false, true if otherwise. 
        //    return false;
        //}
    }
}
