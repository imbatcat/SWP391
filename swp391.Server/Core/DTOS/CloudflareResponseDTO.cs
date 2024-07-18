namespace PetHealthcare.Server.Core.DTOS
{
    public class CloudflareResponseDTO 
    {
        public List<object> errors { get; set; }
        public List<object> messages { get; set; }
        public Result result { get; set; }
        public bool success { get; set; }
    }
    public class Result 
    {
        public string filename { get; set; }
        public string id { get; set; }
        public Meta meta { get; set; }
        public bool requireSignedURLs { get; set; }
        public DateTime uploaded { get; set; }
        public List<string> variants { get; set; }
    }
    public class Meta
    {
        public string key { get; set; }
    }
}
