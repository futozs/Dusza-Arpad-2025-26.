import { headers } from 'next/headers';

interface RequestInfo {
  ipAddress: string;
  userAgent: string;
  device: string;
  browser: string;
}

/**
 * Extract request information from Next.js headers
 * This helps identify the device/location for security alerts
 */
export async function getRequestInfo(): Promise<RequestInfo> {
  try {
    const headersList = await headers();
    
    // Get IP address (with proxy support)
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'Ismeretlen';
    
    // Get user agent
    const userAgent = headersList.get('user-agent') || 'Ismeretlen';
    
    // Parse device and browser from user agent
    const { device, browser } = parseUserAgent(userAgent);
    
    return {
      ipAddress,
      userAgent,
      device,
      browser,
    };
  } catch (error) {
    console.error('Error getting request info:', error);
    return {
      ipAddress: 'Ismeretlen',
      userAgent: 'Ismeretlen',
      device: 'Ismeretlen eszköz',
      browser: 'Ismeretlen böngésző',
    };
  }
}

/**
 * Parse user agent string to extract device and browser info
 */
function parseUserAgent(userAgent: string): { device: string; browser: string } {
  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = 'Ismeretlen böngésző';
  if (ua.includes('edg/')) {
    browser = 'Microsoft Edge';
  } else if (ua.includes('chrome/')) {
    browser = 'Google Chrome';
  } else if (ua.includes('firefox/')) {
    browser = 'Mozilla Firefox';
  } else if (ua.includes('safari/') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('opera/') || ua.includes('opr/')) {
    browser = 'Opera';
  }
  
  // Detect device/OS
  let device = 'Ismeretlen eszköz';
  if (ua.includes('windows')) {
    device = 'Windows PC';
  } else if (ua.includes('mac os x')) {
    device = 'macOS';
  } else if (ua.includes('linux')) {
    device = 'Linux';
  } else if (ua.includes('iphone')) {
    device = 'iPhone';
  } else if (ua.includes('ipad')) {
    device = 'iPad';
  } else if (ua.includes('android')) {
    device = 'Android';
  }
  
  return { device, browser };
}

/**
 * Get approximate location from IP address
 * For now returns a placeholder - can be extended with IP geolocation API
 */
export async function getLocationFromIP(ipAddress: string): Promise<string> {
  // TODO: Implement IP geolocation (e.g., using ipapi.co or similar service)
  // For now, return a placeholder
  if (ipAddress === 'Ismeretlen' || ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.')) {
    return 'Helyi hálózat';
  }
  return 'Magyarország'; // Default placeholder
}
