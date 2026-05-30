// Invoice service - API-ready with mock data fallback
// import axios from 'axios';
// const API_URL = '/api/invoices';
// export const getInvoices = () => axios.get<Invoice[]>(API_URL);
// export const createInvoice = (data: Omit<Invoice, 'id' | 'createdAt'>) => axios.post<Invoice>(API_URL, data);
export {};
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const dataUrl = reader.result as string;

      // Remove "data:application/pdf;base64,"
      const base64 = dataUrl.split(',')[1];

      resolve(base64);
    };

    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}