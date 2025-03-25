// API configuration
export const API_BASE_URL = "http://localhost:8080";

// API endpoints
export const API_ENDPOINTS = {
  AUDIO: `${API_BASE_URL}/audio`,
  REPORT: (reportPath: string) => `${API_BASE_URL}/report/${reportPath}`,
  REPORT_DOWNLOAD: (reportPath: string) => `${API_BASE_URL}/report/${reportPath}?download=true`,
  PLOT: (plotPath: string) => `${API_BASE_URL}/plot/${plotPath}`,
}; 