import { storeDoc } from "../services/docsService";

export async function storeDocInDb(data: any) {
  try {
    const response = storeDoc(data);
    return response;
  } catch (error: any) {
    return error.message;
  }
}
