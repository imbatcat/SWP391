using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace PetHealthcare.Server.Core.DTOS
{
    public class AdmissionRecordForDoctorDTO
    {
        public string petName { get; set; }
        public string AdmissionId { get; set; }
        public DateOnly? AdmissionDate { get; set; }

        public DateOnly? DischargeDate { get; set; }
        public bool IsDischarged { get; set; }
        public string petId {  get; set; }

        public string VeterinarianName {  get; set; }
        public string VetId {  get; set; }
        public int cageId {  get; set; }
    }
}
