import dbConnect from "../lib/dbConnect";

import { Request, Response } from "express";
import { sendErrorResponse, sendResponse } from "../utils/responseHelper";
import { ApiStatus } from "../enums/status";
import { DocsModel } from "../model/docs.model";
import { checkUserExists } from "../utils/userValidation";

interface CreateCollabLinkRequest extends Request {
  body: {
    docId: string;
    userId: string;
  };
}

export async function addCollaborator(
  req: CreateCollabLinkRequest,
  res: Response
) {
  await dbConnect();
  try {
    const { docId, userId } = req.query;
    console.log("docId", docId);
    console.log("userId", userId);
    if (!docId || !userId) {
      sendErrorResponse(400, {
        res,
        status: ApiStatus.FAILED,
        message: "Doc ID and User ID are required",
        error: "Validation error",
      });
      return;
    }

    const userExists = await checkUserExists(userId as string);

    if (!userExists) {
      sendErrorResponse(404, {
        res,
        status: ApiStatus.FAILED,
        message: "User not found",
        error: "User not found",
      });
      return;
    }

    const docExists = await DocsModel.findById(docId);

    if (!docExists) {
      sendErrorResponse(404, {
        res,
        status: ApiStatus.FAILED,
        message: "Document not found",
        error: "Document not found",
      });
      return;
    }

    const collaborators = docExists.collaborators || [];

    const updatedDoc = await DocsModel.findByIdAndUpdate(
      docId,
      { $addToSet: { collaborators: [...collaborators, userId] } },
      { new: true }
    );

    if (!updatedDoc) {
      sendErrorResponse(404, {
        res,
        status: ApiStatus.FAILED,
        message: "Document not found",
        error: "Document not found",
      });
      return;
    }

    sendResponse({
      res,
      status: ApiStatus.SUCCESS,
      message: "Collaborator added successfully",
      data: updatedDoc,
    });
  } catch (error: any) {
    sendErrorResponse(500, {
      res,
      status: ApiStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function generateCollaborateLink(req: Request, res: Response) {
  await dbConnect();
  try {
    const { docId } = req.params;
    const { userId } = req.body;

    if (!docId || !userId) {
      sendErrorResponse(400, {
        res,
        status: ApiStatus.FAILED,
        message: "Doc ID and User ID is required",
        error: "Validation error",
      });
      return;
    }

    const userExists = await checkUserExists(userId as string);

    if (!userExists) {
      sendErrorResponse(404, {
        res,
        status: ApiStatus.FAILED,
        message: "User not found",
        error: "User not found",
      });
      return;
    }

    sendResponse({
      res,
      status: ApiStatus.SUCCESS,
      message: "Collaborator added successfully",
      data: `${process.env.FRONTEND_URL}/collaboration?docId=${docId}&userId=${userId}`,
    });
  } catch (error: any) {
    sendErrorResponse(500, {
      res,
      status: ApiStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function healthCheck(req: Request, res: Response) {
  await dbConnect();
  try {
    sendResponse({
      res,
      status: ApiStatus.SUCCESS,
      message: "Server is running",
      data: null,
    });
  } catch (error: any) {
    sendErrorResponse(500, {
      res,
      status: ApiStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      error: error.message,
    });
  }
}
