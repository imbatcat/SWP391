﻿using Microsoft.EntityFrameworkCore;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Repositories
{
    public class MedicalRecordRepository : IMedicalRecordRepository
    {
        private readonly PetHealthcareDbContext _medRec;
        public MedicalRecordRepository(PetHealthcareDbContext medRec)
        {
            this._medRec = medRec;
        }
        public async Task Create(MedicalRecord entity)
        {
            await _medRec.MedicalRecords.AddAsync(entity);
            await _medRec.SaveChangesAsync();
        }

        public void Delete(MedicalRecord entity)
        {
            _medRec.MedicalRecords.Remove(entity);
        }

        public async Task<IEnumerable<MedicalRecord>> GetAll()
        {
            return await _medRec.MedicalRecords.ToListAsync();
        }

        public async Task<MedicalRecord?> GetByCondition(Expression<Func<MedicalRecord, bool>> expression)
        {
            return await _medRec.MedicalRecords.FirstOrDefaultAsync(expression);
        }

        public async Task SaveChanges()
        {
            await _medRec.SaveChangesAsync();
        }

        public async Task Update(MedicalRecord entity)
        {
            var medicalRecord= await GetByCondition(e=>e.MedicalRecordId==entity.MedicalRecordId);
            if(medicalRecord != null)
            {
                _medRec.Entry(medicalRecord).State = EntityState.Modified;
                medicalRecord.PetWeight = entity.PetWeight;
                medicalRecord.Symptoms = entity.Symptoms;
                medicalRecord.Allergies = entity.Allergies;
                medicalRecord.Diagnosis = entity.Diagnosis;
                medicalRecord.AdditionalNotes = entity.AdditionalNotes;
                medicalRecord.FollowUpAppointmentDate = entity.FollowUpAppointmentDate;
                medicalRecord.FollowUpAppointmentNotes = entity.FollowUpAppointmentNotes;
                medicalRecord.DrugPrescriptions = entity.DrugPrescriptions;
                medicalRecord.AppointmentId = entity.AppointmentId;
                medicalRecord.PetId = entity.PetId;
            }
            await SaveChanges();
        }
    }
}