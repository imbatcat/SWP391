namespace PetHealthcare.Server.Core.Helpers
{
    public static class CurrentTimeSlotCheck
    {
        public static int getCurrentTimeSlot()
        {
            int currentTimeSlot = 0;
            TimeOnly currentTime = TimeOnly.FromDateTime(DateTime.Now);
            if (currentTime >= new TimeOnly(7) && currentTime < new TimeOnly(8, 30))
            {
                currentTimeSlot = 1;
            }
            else if (currentTime >= new TimeOnly(8, 30) && currentTime < new TimeOnly(10))
            {
                currentTimeSlot = 2;
            }
            else if (currentTime >= new TimeOnly(10) && currentTime < new TimeOnly(11, 30))
            {
                currentTimeSlot = 3;
            }
            else if (currentTime >= new TimeOnly(13) && currentTime < new TimeOnly(14, 30))
            {
                currentTimeSlot = 4;
            } else if (currentTime >= new TimeOnly(14,30) && currentTime <= new TimeOnly(16))
            {
                currentTimeSlot = 5;
            } else if(currentTime >= new TimeOnly(16) && currentTime <= new TimeOnly(17,30))
            {
                currentTimeSlot = 6;
            }
            return currentTimeSlot;
        }
    }
}
