import { NextFunction, Request, Response } from "express";
import { ErrorCode } from "../../exceptions/root.js";
import { UnprocessableEntity } from "../../exceptions/validation.js";
import { prisma } from "../../config/prisma.js";
import { ChatEventEnum, emitSocketEvent } from "../../socket/index.js";


const messageController = {
   sendMessage: async (req: Request, res:Response,next: NextFunction) => {
      req.chatId = +req.params.id;
      const { content } = req.body;
      // Check if content or attachments are provided
      if (!content && (!req.files?.attachments || req.files.attachments.length === 0)) {
          return next(new UnprocessableEntity('Content or attachments are required', 422, ErrorCode.CONTENT_AND_ATTACHMENTS_REQUIRED, null));
      }
      // Find the chat
      const chat = await prisma.chats.findFirstOrThrow({
          where: {
              id: +req.chatId
          },
          include: {
              participants: true,
          }
      });

      if (!chat) {
          return next(new UnprocessableEntity('No chat found with this id', 404, ErrorCode.CHAT_NOT_FOUND, null));
      }
      // Prepare attachments
      const messageFiles = req.files?.attachments?.map((attachment: any) => ({ url: attachment.url }));
      
      // Create a new message instance with appropriate metadata
      const newMessage = await prisma.messages.create({
          data: {
              chatId: +req.chatId,
              senderId: req.user!.id,
              sentTime: new Date(),
              content: content
          }
      });
    //   console.log(newMessage);
      // Update the chat's last message
      await prisma.chats.update({
          where: {
              id: +req.chatId
          },
          data: {
              lastMessage: {
                  connect: {
                      id: newMessage.id
                  }
              }
          }
      });

      // Emit socket event about the new message created to the other participants
      chat.participants.forEach((participantObjectId: any) => {
          // Avoid emitting event to the user who is sending the message
          if (participantObjectId.toString() === req.user?.id.toString()) return;

          // Emit the receive message event to the other participants with received message as the payload
          emitSocketEvent(
              req,
              participantObjectId.toString(),
              ChatEventEnum.MESSAGE_RECEIVED_EVENT,
              newMessage
          );
      });

      return res.status(201).json({
          message: "Message saved successfully",
          success: true
      });
   },

   getMessages: async (req: Request, res:Response,next: NextFunction) => {
      req.chatId = +req.params.id;
      //check if the user is participant of the chat
      const chat = await prisma.chats.findFirstOrThrow({
         where: {
            id: +req.chatId
         },
         include:{
            participants: true,
         }
      });
      if(!chat){
         return next(new UnprocessableEntity('no chat found in this id',404,ErrorCode.CHAT_NOT_FOUND,null));
      }
       // Check if the participant being added is already a part of the group
     if(chat.participants.find((participant: any) => participant.id === req.user?.id) === undefined){
         return next(new UnprocessableEntity('you are not a participant of this chat',404,ErrorCode.CHAT_NOT_FOUND,null));
      }
      const messages = await prisma.messages.findMany({
         where: {
            chatId: +req.chatId
         },
         include:{
            _count:true,
            attachments: true,
            chat: true,
            sender:true
         }
      });
      return res.status(200).json({
         message: "sucessfully fetched",
         sucess: true,
         data: messages
      });
   },
   

}
export default messageController;