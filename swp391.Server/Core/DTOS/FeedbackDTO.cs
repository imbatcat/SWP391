﻿namespace PetHealthcare.Server.Core.DTOS
{
    public class FeedbackDTO
    {
        public int Rating { get; set; }
        public string? FeedbackDetails { get; set; }
        public string AccountId { get; set; }
    }
}