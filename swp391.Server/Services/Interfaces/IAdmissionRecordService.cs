using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services.Interfaces
{
    public interface IAdmissionRecordService
    {
        Task<IEnumerable<AdmissionRecord>> GetAll();
        Task<AdmissionRecord?> GetAdmissionRecordByPetName(Expression<Func<AdmissionRecord, bool>> expression);
        Task CreateAdmissionRecord(AdmissionRecordRegisterDTO entity);
        Task UpdateAdmissionRecord(string id, AdmissionRecordDTO entity);
        void DeleteAdmissionRecord(AdmissionRecord entity);
        Task<IEnumerable<AdmissionRecord>> GetAdmissionToRemind();
        Task SetAdmissionIsRemindStatus(IEnumerable<AdmissionRecord> ToUpdateAdmissionRecordList);

        Task<IEnumerable<AdmissionRecordForDoctorDTO>> GetAllAdmissionRecordForVet(string vetId);
        //Task<bool> ConfirmAdmissionRecordIdentity(string Id, AdmissionRecordDTO newPet);
    }
}
