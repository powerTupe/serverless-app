import db from "./db.js";
import { GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const getPost = async (event) => {
    const response = { statusCode: 200};

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ postId: event.pathParameters.postId})
        }

        const { Item } = await db.send(new GetItemCommand(params));
        console.log({Item});

        response.body = JSON.stringify({
            message: "Successfully get post",
            data: (Item) ? unmarshall(Item) : {},
            rawData: Item
        })
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to get post.",
            errorMsg: e.message,
            errorStack: e.stack,
        })
    }

    return response;
}

export const createPost = async (event) => {
    const response = { statusCode: 200};

    try {
        const body = JSON.parse(event.body);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(body || {})
        }

        const createResult = await db.send(new PutItemCommand(params));
        response.body = JSON.stringify({
            message: "Successfully get post",
            createResult,
        })
    } catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create post.",
            errorMsg: e.message,
            errorStack: e.stack,
        })
    }

    return response;
}

