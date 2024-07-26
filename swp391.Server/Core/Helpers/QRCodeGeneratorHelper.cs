using QRCoder;
using System.Drawing.Imaging;
using System.Drawing;

namespace PetHealthcare.Server.Core.Helpers
{
    public static class QRCodeGeneratorHelper
    {
        public static async Task<string> GenerateQRCode(string text)
        {
            string QRCodeUrlImage= string.Empty;
            if (string.IsNullOrEmpty(text)) return string.Empty;

            QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
            QRCodeData data = qRCodeGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
            BitmapByteQRCode bitmap = new BitmapByteQRCode(data);
            byte[] QRCodeData = bitmap.GetGraphic(20);

            using var ms = new MemoryStream(QRCodeData);
            using Bitmap _bitmap = new Bitmap(ms);

            // Convert Bitmap to base64 string
            using var base64Stream = new MemoryStream();
            _bitmap.Save(base64Stream, ImageFormat.Png);
            string base64String = Convert.ToBase64String(base64Stream.ToArray());

            QRCodeUrlImage = $"data:image/png;base64,{base64String}";

            return await ImageUpload.uploadQrImage(QRCodeUrlImage);
        }
    }
}
