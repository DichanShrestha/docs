import { DocsModel } from "../../../shared/model/docs.model";
import dbConnect from "../../../shared/dbConnect";

export const storeDoc = async (data: any) => {
  await dbConnect();
  try {
    const { id, content } = data;
    const doc = await DocsModel.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    return doc;
  } catch (error) {
    throw error;
  }
};
