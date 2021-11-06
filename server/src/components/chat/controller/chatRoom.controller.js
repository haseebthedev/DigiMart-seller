const makeValidation = require('@withvoid/make-validation');
const { CHAT_ROOM_TYPES, ChatRoomModel }  = require('../model/chatRoom.model')
const ChatMessageModel = require('../model/chatMessage.model');
const SuperAdmin = require('../../users/super-admin/models/superAdmin.model');
const Seller = require('../../users/seller/models/seller.model');
const Buyer = require('../../users/buyer/models/buyer.model');

const initiate = async (req, res, next) => {
    try {
        let newConversationCreated = ""
        const validation = makeValidation(types => ({
          payload: req.body,
          checks: {
            userIds: { 
              type: types.array, 
              options: { unique: true, empty: false, stringOnly: true } 
            },
            type: { type: types.enum, options: { enum: CHAT_ROOM_TYPES } },
          }
        }));
        if (!validation.success) return res.status(400).json({ ...validation });
    
        const { type } = req.body;
        const chatInitiator = req.user._id;
        //at 0 index we have _id of chatInitiator
        let allUserIds = [chatInitiator];
        //at 1 index we have _id of msg reciever
        allUserIds = [...allUserIds, req.body.userIds];
        const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type, chatInitiator);
        const messagePayload = {
            messageText: `${req.user.name} started a new chat !`,
        };
        // if some other use created new chat then send new chat conversations with it
        let recentConversations = await getMyConversations(req.user,'seller-to-buyer')
        
        if(chatRoom.isNew){
            const post = await ChatMessageModel.createPostInChatRoom(chatRoom.chatRoomId, messagePayload, req.user._id);
            recentConversations = await getMyConversations(req.user,'seller-to-buyer')
            // recentConversations.forEach((item) => console.log(item._id))
            global.io.sockets.emit('newConversation', {recentConversations,
            chatInitiatorId: req.user._id, chatRecieverId: req.body.userIds[0]});
            global.io.sockets.in(chatRoom._id).emit('message', {message: post});
        }
        //get new conversation initaited and send it with response
        recentConversations.forEach((conversation) =>{
            if(conversation.chatRoomId == chatRoom.chatRoomId){
                newConversationCreated = conversation
            }
        })
        
        return res.status(200).json({
            success: true,
            message:`Chat Created !`,
            data:{
                chatRoom,
                newConversationInitiated: newConversationCreated
            }
        })
    }
    catch (err){
        err.status = 500
        err.success = false
        next(err)
    }
}

const postMessage = async ( currentLoggedUser, roomId, message) => {
    try {
        // const { roomId } = req.params;
        
        const validation = makeValidation(types => ({
          payload: message,
          checks: {
            message: { type: types.string },
          }
        }));
        //if (!validation.success) throw new Error('Not Valid message!');
    
        const messagePayload = {
          messageText: message,
        };
        const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
        global.io.sockets.in(roomId).emit('message', {message: post});
        // console.log("messageEmitted")
        //return res.status(200).json({ success: true, post });
      } 
    catch (err){
        console.log(err)
    }
}

const getMyConversations = async (currentLoggedUser, roomType, page, limit) => {
    let RECIEVER_TYPE = ""
    const options = {
        page: parseInt(page) || 0,
        limit: parseInt(limit) || 100,
      };
      //get all chatRooms of (seller-to-admin)
      if(roomType == 'seller-to-admin'){
          //if seller is logged in then recieverType is superAdmin
          if(currentLoggedUser.userType == 'sellers'){
              RECIEVER_TYPE = 'superadmins'
          }
          //if superAdmin is logged in then recieverType is seller
          if(currentLoggedUser.userType == 'superadmins'){
              RECIEVER_TYPE = 'sellers'
          }
      }

      //get all chatRooms of (seller-to-buyer)
      if(roomType == 'seller-to-buyer'){
          //if seller is logged in then recieverType is buyer
          if(currentLoggedUser.userType == 'sellers'){
              RECIEVER_TYPE = 'buyers'
          }
          //if buyer is logged in then recieverType is seller
          if(currentLoggedUser.userType == 'buyers'){
              RECIEVER_TYPE = 'sellers'
          }
      }
      
      const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
      let roomIds = []
      rooms.forEach((room) => {roomIds.push(room._id)});
      const recentConversation = await ChatMessageModel.getRecentConversation(
        roomIds, options, currentLoggedUser, RECIEVER_TYPE
      );
    //   console.log("inside func", recentConversation)
      let conversationUsers = []
      for(const conversation of recentConversation){
          let conversationUser = ""
          for(const roomUserId of conversation.roomUsers){
              //getting user profile with whom conversation is generated
              if(roomUserId.toString() != currentLoggedUser.toString()){
                  if(RECIEVER_TYPE == 'sellers'){
                      conversationUser = await Seller.findById(roomUserId)
                  }
                  if(RECIEVER_TYPE == 'superadmins'){
                      conversationUser = await SuperAdmin.findById(roomUserId)
                  }
                  if(RECIEVER_TYPE == 'buyers'){
                      conversationUser = await Buyer.findById(roomUserId)
                  }
              }
          }
          conversation.conversationUser = conversationUser;
          let countOfUnReadMessages = await ChatMessageModel.getUnreadMessages(conversation.chatRoomId, currentLoggedUser._id);
          conversation.countOfUnReadMessages = countOfUnReadMessages

      }
      return recentConversation;
}

const getRecentConversation = async (req, res, next) => {
    try {
        const currentLoggedUser = req.user;
        const roomType = req.params.roomType
        const recentConversation = await getMyConversations(currentLoggedUser, roomType, req.query.page, req.query.limit)
        return res.status(200).json({ success: true, recentConversation });
    }
    catch (err){
        err.status = 500
        err.success = false
        next(err)
    }
}

const getConversationByRoomId = async (req, res, next) => {
    try {
        let chatReciever = ''
        let chatRecieverId = ''
        const { roomId } = req.params;
        const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
        if (!room) {
          return res.status(400).json({
            success: false,
            message: 'No room exists for this id',
          })
        }
        if(room.type == 'seller-to-admin'){
            room.userIds.forEach((userId) =>{
                if(userId.toString() != req.user._id.toString()){
                    chatRecieverId = userId
                    return;
                }
            })
            if(req.user.userType == 'sellers'){
                chatReciever = await SuperAdmin.findById(chatRecieverId)
            }
            if(req.user.userType == 'superadmins'){
                chatReciever = await Seller.findById(chatRecieverId)
            }
        }

        if(room.type == 'seller-to-buyer'){
            room.userIds.forEach((userId) =>{
                if(userId.toString() != req.user._id.toString()){
                    chatRecieverId = userId
                    return;
                }
            })
            if(req.user.userType == 'sellers'){
                chatReciever = await Buyer.findById(chatRecieverId)
            }
            if(req.user.userType == 'buyers'){
                chatReciever = await Seller.findById(chatRecieverId)
            }
        }
        const chatInitiator = req.user
        const options = {
          page: parseInt(req.query.page) || 0,
          limit: parseInt(req.query.limit) || 10,
        };
        const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
        return res.status(200).json({
          success: true,
          conversation,
          chatReciever,
          chatInitiator
        });
    } 
    catch (err){
        err.status = 500
        err.success = false
        next(err)
    }
}

const markConversationReadByRoomId = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
        if (!room) {
          return res.status(400).json({
            success: false,
            message: 'No room exists for this id',
          })
        }
    
        const currentLoggedUser = req.user._id;
        const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser);
        return res.status(200).json({ success: true, data: result });
    }
    catch (err){
        err.status = 404
        err.success = false
        next(err)
    }
}

const deleteRoomById = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const room = await ChatRoomModel.deleteMany({ _id: roomId });
        const messages = await ChatMessageModel.deleteMany({ chatRoomId: roomId })
        return res.status(200).json({ 
          success: true, 
          message: "Operation performed succesfully",
          deletedRoomsCount: room.deletedCount,
          deletedMessagesCount: messages.deletedCount,
        });
      } 
      catch (err){
        err.status = 404
        err.success = false
        next(err)
      }
}

const deleteMessageById = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const message = await ChatMessageModel.remove({ _id: messageId });
        return res.status(200).json({ 
          success: true, 
          deletedMessagesCount: message.deletedCount,
        });
      } 
      catch (err){
        err.status = 404
        err.success = false
        next(err)
      }
}

module.exports = {
    initiate,
    postMessage,
    getConversationByRoomId,
    getRecentConversation,
    markConversationReadByRoomId,
    deleteRoomById,
    deleteMessageById
}