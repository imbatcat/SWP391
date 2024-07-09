using QRCoder;

namespace PetHealthcare.Server.Core.Helpers
{
    public static class QRCodeGeneratorHelper
    {
        public static string GenerateQRCode(string text)
        {
            string QRCodeUrlImage="";
            if (!string.IsNullOrEmpty(text))
            {
                QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
                QRCodeData data = qRCodeGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
                BitmapByteQRCode bitmap = new BitmapByteQRCode(data);
                byte[] QRCodeData = bitmap.GetGraphic(20);
                QRCodeUrlImage = $"data:image/png;base64,{Convert.ToBase64String(QRCodeData)}";
            }
            return QRCodeUrlImage;
        }
    }
}
