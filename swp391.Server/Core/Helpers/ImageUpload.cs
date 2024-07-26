using NuGet.Protocol;
using PetHealthcare.Server.Core.DTOS;
using System.Net.Http.Headers;
using System.Text.Json;

namespace PetHealthcare.Server.Core.Helpers
{
    public static class ImageUpload
    {
        public static async Task<HttpResponseMessage> uploadImage(IFormFile file)
        {
            using var client = new HttpClient();
            var content = new MultipartFormDataContent();

            var fileContent = new StreamContent(file.OpenReadStream());
            fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
            {
                Name = "file",
                FileName = file.FileName
            };
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

            content.Add(fileContent);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"https://api.cloudflare.com/client/v4/accounts/{JsonReader.readJson("Cloudflare:account-id")}/images/v1"),
                Headers =
                {
                    { "Authorization", $"Bearer {JsonReader.readJson("Cloudflare:api-token")}" },
                },
                Content = content
            };

            // Debugging: Print out the request content
            var debugContent = await content.ReadAsStringAsync();
            Console.WriteLine("Request Content: " + debugContent);

            return await client.SendAsync(request);
        }

        public static async Task<string> uploadQrImage(string fileString)
        {
            using var client = new HttpClient();
            var content = new MultipartFormDataContent();

            if (fileString.StartsWith("data:image/png;base64,"))
            {
                fileString = fileString.Substring("data:image/png;base64,".Length);
            }
            byte[] fileBytes = Convert.FromBase64String(fileString);
            var fileContent = new ByteArrayContent(fileBytes);
            fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
            {
                Name = "file",
                FileName = "qrcode.png"
            };
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");

            content.Add(fileContent);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"https://api.cloudflare.com/client/v4/accounts/{JsonReader.readJson("Cloudflare:account-id")}/images/v1"),
                Headers =
                {
                    { "Authorization", $"Bearer {JsonReader.readJson("Cloudflare:api-token")}" },
                },
                Content = content
            };

            var debugContent = await content.ReadAsStringAsync();
            Console.WriteLine("Request Content: " + debugContent);

            var response = await client.SendAsync(request);
            var body = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<CloudflareResponseDTO>(body);
            if (data == null) return string.Empty;
            return data.result.variants[0];
        }
    }
}
