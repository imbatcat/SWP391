using PetHealthcare.Server.Core.DTOS;
using PetHealthcare.Server.Models;
using PetHealthcare.Server.Repositories.Interfaces;
using PetHealthcare.Server.Services.Interfaces;
using System.Linq.Expressions;

namespace PetHealthcare.Server.Services
{
    public class CageService : ICageService
    {
        private readonly ICageRepository _cageService;
        private readonly IAdmissionRecordRepository _admissionRecordRepository;
        private readonly IPetRepository _petRepository;
        public CageService(ICageRepository cageService, IAdmissionRecordRepository admissionRecordRepository, IPetRepository petRepository)
        {
            _cageService = cageService;
            _admissionRecordRepository = admissionRecordRepository;
            _petRepository = petRepository;
        }

        public async Task CreateCage(CageDTO Cage)
        {
            var _cage = new Cage
            {
                CageNumber = Cage.CageNumber,
                IsOccupied = Cage.IsOccupied,

            };
            await _cageService.Create(_cage);
        }


        public void DeleteCage(Cage Cage)
        {
            throw new NotImplementedException();
        }

        public async Task<Cage?> GetCageByCondition(Expression<Func<Cage, bool>> expression)
        {
            return await _cageService.GetByCondition(expression);
        }

        public async Task<IEnumerable<Cage>> GetAllCages()
        {
            return await _cageService.GetAll();
        }

        public async Task<IEnumerable<CageWithPetDTO>> GetAllCagesWithPet()
        {
            //get list of all cages
            var cageAdMissionList = await _admissionRecordRepository.GetAll();
            var cageList = await _cageService.GetAll();
            List<CageWithPetDTO> cageWithPetDTOs = new List<CageWithPetDTO>();
            foreach (var item in cageList)
            {
                //check in admission record has this pet?
                var cageHasPet = cageAdMissionList.FirstOrDefault(ad => ad.CageId == item.CageId);
                if (cageHasPet != null)
                {
                    if (cageHasPet.IsDischarged == false)
                    {
                        var pet = await _petRepository.GetByCondition(p => p.PetId == cageHasPet.PetId);
                        cageWithPetDTOs.Add(new CageWithPetDTO
                        {
                            CageId = item.CageId,
                            IsOccupied = true,
                            ImgUrl = pet.ImgUrl,
                            PetName = pet.PetName,
                            PetAge = pet.PetAge,
                            PetBreed = pet.PetBreed,
                            PetId = pet.PetId,
                            PetCurrentCondition = cageHasPet.PetCurrentCondition
                        });
                    }
                    else
                    {
                        cageWithPetDTOs.Add(new CageWithPetDTO
                        {
                            CageId = item.CageId,
                            IsOccupied = false,
                        });
                    }
                }
                else
                {
                    cageWithPetDTOs.Add(new CageWithPetDTO
                    {
                        CageId = item.CageId,
                        IsOccupied = false,
                    });
                }
            }
            return cageWithPetDTOs;
        }
        public async Task UpdateCage(int id, CageDTO Cage)
        {
            var _cage = new Cage
            {
                CageId = id,
                CageNumber = Cage.CageNumber,
                IsOccupied = Cage.IsOccupied,
            };
            await _cageService.Update(_cage);
        }    
        public async Task DischargePet(string petId)
        {
            await _admissionRecordRepository.DischargePet(petId);
            await _cageService.DischargePet(petId);
        }
        public async Task UpdateCondition(string petId, UpdatePetConditionDTO updatePetConditionDTO)
        {
            await _admissionRecordRepository.UpdateCondition(petId, updatePetConditionDTO);
        }
    }
}
