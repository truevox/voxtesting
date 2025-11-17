import QRCode from 'qrcode';

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(data: string): Promise<string> {
  try {
    const qrCodeSVG = await QRCode.toString(data, {
      errorCorrectionLevel: 'H',
      type: 'svg',
      width: 512,
      margin: 2,
    });
    return qrCodeSVG;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw error;
  }
}

/**
 * Generate verification URL for a hash
 */
export function generateVerificationURL(hashId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/verify/${hashId}`;
}

/**
 * Generate QR code for hash verification
 */
export async function generateHashQRCode(hashId: string): Promise<{
  url: string;
  qrCodeDataURL: string;
  qrCodeSVG: string;
}> {
  const verificationURL = generateVerificationURL(hashId);
  const qrCodeDataURL = await generateQRCode(verificationURL);
  const qrCodeSVG = await generateQRCodeSVG(verificationURL);

  return {
    url: verificationURL,
    qrCodeDataURL,
    qrCodeSVG,
  };
}
