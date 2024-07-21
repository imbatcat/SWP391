using Microsoft.EntityFrameworkCore;
using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Repositories
{
    public class AdmissionRecordRepository : IAdmissionRecordRepository
    {
        private readonly PetHealthcareDbContext _context;
        public AdmissionRecordRepository(PetHealthcareDbContext context)
        {
            _context = context;
        }

        public async Task Create(AdmissionRecord entity)
        {
            await _context.AdmissionRecords.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public void Delete(AdmissionRecord entity)
        {
            _context.AdmissionRecords.Remove(entity);
        }

        public async Task<IEnumerable<AdmissionRecord>> GetAll()
        {
            return await _context.AdmissionRecords.Include("Pet.Account")
                .Select(ad => new AdmissionRecord
                {
                    AdmissionDate = ad.AdmissionDate,
                    AdmissionId = ad.AdmissionId,
                    CageId = ad.CageId,
                    VeterinarianAccountId = ad.VeterinarianAccountId,
                    PetId = ad.PetId,
                    CustomerEmail = ad.Pet.Account.Email,
                    CustomerName = ad.Pet.Account.FullName,
                    DischargeDate = ad.DischargeDate,
                    IsDischarged = ad.IsDischarged,
                    MedicalRecordId = ad.MedicalRecordId,
                    PetCurrentCondition = ad.PetCurrentCondition,
                    IsRemind = ad.IsRemind,
                    petName = ad.Pet.PetName
                })
                .OrderBy(x => x.AdmissionId).ToListAsync();
        }

        public async Task<AdmissionRecord?> GetByCondition(Expression<Func<AdmissionRecord, bool>> expression)
        {
            return await _context.AdmissionRecords.Include("Pet.Account")
                .Select(ad => new AdmissionRecord
                {
                    AdmissionDate = ad.AdmissionDate,
                    AdmissionId = ad.AdmissionId,
                    CageId = ad.CageId,
                    VeterinarianAccountId = ad.VeterinarianAccountId,
                    PetId = ad.PetId,
                    CustomerEmail = ad.Pet.Account.Email,
                    CustomerName = ad.Pet.Account.FullName,
                    DischargeDate = ad.DischargeDate,
                    IsDischarged = ad.IsDischarged,
                    MedicalRecordId = ad.MedicalRecordId,
                    PetCurrentCondition = ad.PetCurrentCondition,
                    IsRemind = ad.IsRemind,
                    petName = ad.Pet.PetName
                })
                .FirstOrDefaultAsync(expression);
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task Update(AdmissionRecord entity)
        {
            var toUpdateAdmission = await GetByCondition(x => x.AdmissionId == entity.AdmissionId);
            if (toUpdateAdmission != null)
            {
                _context.Entry(toUpdateAdmission).State = EntityState.Modified;
                toUpdateAdmission.DischargeDate = entity.DischargeDate;
                toUpdateAdmission.IsRemind = entity.IsRemind;
                await SaveChanges();
            }
        }

        public async Task DischargePet(string petId)
        {
            var existingRecord = _context.AdmissionRecords.Local
            .FirstOrDefault(ad => ad.PetId == petId && ad.IsDischarged == false);
            if (existingRecord != null)
            {
                _context.Entry(existingRecord).State = EntityState.Detached;
            }

            var admissionRecord = await GetByCondition(ad => ad.PetId == petId && ad.IsDischarged == false);
            if (admissionRecord != null)
            {
                if (admissionRecord.IsDischarged == false)
                {
                    _context.Entry(admissionRecord).State = EntityState.Modified;
                    admissionRecord.IsDischarged = true;
                    admissionRecord.PetCurrentCondition = "Is discharged";
                    admissionRecord.DischargeDate = DateOnly.FromDateTime(DateTime.Now);
                    await SaveChanges();
                }
            }
        }

        public async Task UpdateCondition(string petId, UpdatePetConditionDTO updatePetConditionDTO)
        {
            var admissionRecord = await GetByCondition(ad => ad.PetId == petId);
            if (admissionRecord != null)
            {
                if (admissionRecord.IsDischarged == false)
                {
                    _context.Entry(admissionRecord).State = EntityState.Modified;
                    admissionRecord.PetCurrentCondition = updatePetConditionDTO.PetCurrentCondition;
                    await SaveChanges();
                }
            }
        }

        public async Task<IEnumerable<AdmissionRecordForDoctorDTO>> GetAllAdmissionRecordForVet()
        {
            return await _context.AdmissionRecords
                .Include(a => a.Cage)
                .Include(a => a.Pet)
                .Include(a => a.Veterinarian)
                .Select(a => new AdmissionRecordForDoctorDTO
            {
                AdmissionDate = a.AdmissionDate,
                AdmissionId = a.AdmissionId,
                cageId = a.Cage.CageId,
                DischargeDate = a.DischargeDate,
                IsDischarged = a.IsDischarged,
                petId = a.Pet.PetId,
                petName = a.Pet.PetName,
                VeterinarianName = a.Veterinarian.FullName,
                VetId = a.VeterinarianAccountId,
                petImg = a.Pet.ImgUrl,
            }).ToListAsync();
        }
    }
}
