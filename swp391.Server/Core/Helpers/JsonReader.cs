namespace PetHealthcare.Server.Core.Helpers
{
    public static class JsonReader
    {
        public static string readJson(string configPath)
        {
            IConfiguration config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("secrets.json", true, true)
                .Build();
            return config[configPath];
        }
    }
}
