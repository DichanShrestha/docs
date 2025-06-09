import { Request, Response } from "express";
import { DocsModel } from "../model/docs.model";
import dbConnect from "../lib/dbConnect";
import { sendErrorResponse, sendResponse } from "../utils/responseHelper";
import { ApiStatus } from "../enums/status";
// import { redisClient } from "../../../shared/redis";

interface CreateDocRequest extends Request {
  body: {
    title: string;
    content: string;
    userId: string;
  };
}

export const createDoc = async (req: CreateDocRequest, res: Response) => {
  await dbConnect();
  try {
    const { title, content, userId } = req.body;

    console.log("Received title:", title);
    if (!title) {
      sendErrorResponse(400, {
        res,
        status: ApiStatus.FAILED,
        error: "Title is required",
        message: "Validation error",
      });
    }

    const doc = await DocsModel.create({
      title,
      content,
      collaborators: [userId],
      owner: userId,
    });
    res.cookie("docId", doc._id);
    sendResponse({
      res,
      status: ApiStatus.SUCCESS,
      message: "Document created successfully",
      data: doc,
    });
  } catch (error: any) {
    sendErrorResponse(500, {
      res,
      status: ApiStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getSingleDoc = async (req: Request, res: Response) => {
  await dbConnect();
  try {
    const { id } = req.params;
    const doc = await DocsModel.findById(id);
    // const cacheKey = `doc-id: ${id}`;
    // const docs = await redisClient.get(cacheKey);

    // if (docs) {
    //   sendResponse({
    //     res,
    //     status: ApiStatus.SUCCESS,
    //     message: "Document retrieved successfully",
    //     data: JSON.parse(docs),
    //   });
    // }

    if (!doc) {
      sendErrorResponse(404, {
        res,
        status: ApiStatus.FAILED,
        message: "Document not found",
      });
    }

    sendResponse({
      res,
      status: ApiStatus.SUCCESS,
      message: "Document retrieved successfully",
      data: doc,
    });
  } catch (error: any) {
    sendErrorResponse(500, {
      res,
      status: ApiStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      error: error.message,
    });
  }
};
