namespace PetHealthcare.Server.Core.DTOS
{
    public class CageWithPetDTO
    {
        public int CageId { get; set; }
        public bool IsOccupied { get; set; }
        public string? ImgUrl { get; set; }
        public string? PetName { get; set; }
        public string? PetBreed { get; set; }
        public DateOnly? PetAge { get; set; }
        public string? PetId {  get; set; }

        public string PetCurrentCondition {  get; set; }

    }
}
