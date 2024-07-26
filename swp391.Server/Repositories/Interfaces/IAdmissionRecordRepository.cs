using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;

namespace PetHealthcare.Server.Repositories.Interfaces
{
    public interface IAdmissionRecordRepository : IRepositoryBase<AdmissionRecord>
    {
        Task DischargePet(string petId);
        Task UpdateCondition(string petId,UpdatePetConditionDTO updatePetConditionDTO);

        Task<IEnumerable<AdmissionRecordForDoctorDTO>> GetAllAdmissionRecordForVet();
    }
}
