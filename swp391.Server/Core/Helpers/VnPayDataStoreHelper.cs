using PetHealthcare.Server.Core.DTOS.AppointmentDTOs;

namespace PetHealthcare.Server.Core.Helpers
{
    public static class VnPayDataStoreHelper
    {
        public static CreateAppointmentDTO toCreateAppointment;
        public static void SaveAppointmentData(CreateAppointmentDTO toSaveCreateAppointment)
        {
            toCreateAppointment = toSaveCreateAppointment;
        }

        public static CreateAppointmentDTO getAppointment()
        {
            return toCreateAppointment;
        }
    }
}
