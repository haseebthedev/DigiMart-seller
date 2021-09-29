const mongoose = require("mongoose");
const { v4:uuidv4 } = require("uuid");
const { ChatRoomModel } = require("./chatRoom.model");
//const Seller = require('../../users/seller/models/seller.model')

const MESSAGE_TYPES = {
  TYPE_TEXT: "text",
};

const readByRecipientSchema = new mongoose.Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const chatMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    chatRoomId: String,
    message: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      default: () => MESSAGE_TYPES.TYPE_TEXT,
    },
    postedByUser: mongoose.Schema.Types.ObjectId,
    readByRecipients: [readByRecipientSchema],
  },
  {
    timestamps: true,
    collection: "chatmessages",
  }
);

chatMessageSchema.statics.createPostInChatRoom = async function (chatRoomId, message, postedByUser) {
  try {
    const post = await this.create({
      chatRoomId,
      message,
      postedByUser,
      readByRecipients: { readByUserId: postedByUser }
    });

    // //if postedByUser is a seller and recievedByUser is admin
    // let POSTED_BY_USER_TYPE = ""
    // let RECIEVED_BY_USER_TYPE = ""
    // //check type of chatRoom
    // const chatRoom = await ChatRoomModel.findOne({_id: chatRoomId}) 
    // if(chatRoom.type == "seller-to-admin"){
    //     POSTED_BY_USER_TYPE = "sellers"
    //     RECIEVED_BY_USER_TYPE = "superadmins"
    // }
    // if(chatRoom.type == "admin-to-seller"){
    //     POSTED_BY_USER_TYPE = "superadmins"
    //     RECIEVED_BY_USER_TYPE = "sellers"
    // }
    const aggregate = await this.aggregate([
      // get post where _id = post._id
      { $match: { _id: post._id } },
      // do a join on another table called users, and 
      // get me a user whose _id = postedByUser
    //   {
    //     $lookup: {
    //       from: POSTED_BY_USER_TYPE,
    //       localField: 'postedByUser',
    //       foreignField: '_id',
    //       as: 'postedByUser',
    //     }
    //   },
    //   { $unwind: '$postedByUser' },
      // do a join on another table called chatrooms, and 
      // get me a chatroom whose _id = chatRoomId
      {
        $lookup: {
          from: 'chatrooms',
          localField: 'chatRoomId',
          foreignField: '_id',
          as: 'chatRoomInfo',
        }
      },
      { $unwind: '$chatRoomInfo' },
      { $unwind: {path:'$chatRoomInfo.userIds', includeArrayIndex: "arrayIndex"} },
      // do a join on another table called superadmins, and 
      // get me a user whose _id = userIds
    //   {
    //     $lookup: {
    //       from: RECIEVED_BY_USER_TYPE,
    //       localField: 'chatRoomInfo.userIds',
    //       foreignField: '_id',
    //       as: 'chatRoomInfo.adminProfile',
    //     }
    //   },
    //   { $unwind: '$chatRoomInfo.adminProfile' },
    //   { $unwind: '$chatRoomInfo.sellerProfile' },
      // group data
      {
        $group: {
          _id: '$chatRoomInfo._id',
          postId: { $last: '$_id' },
          chatRoomId: { $last: '$chatRoomInfo._id' },
          message: { $last: '$message' },
          type: { $last: '$type' },
          postedByUser: { $last: '$postedByUser' },
          //recievedByUser: { $last: '$chatRoomInfo.adminProfile' },
          readByRecipients: { $last: '$readByRecipients' },
          createdAt: { $last: '$createdAt' },
          updatedAt: { $last: '$updatedAt' },
        }
      }
    ]);
    //console.log(aggregate)
    return aggregate[0];
  } catch (error) {
    throw error;
  }
}

chatMessageSchema.statics.getConversationByRoomId = async function (chatRoomId, options = {}) {
    try {
      return this.aggregate([
        { $match: { chatRoomId } },
        { $sort: { createdAt: -1 } },
        // do a join on another table called users, and 
        // get me a user whose _id = postedByUser
        // {
        //   $lookup: {
        //     from: POSTED_BY_USER_TYPE,
        //     localField: 'postedByUser',
        //     foreignField: '_id',
        //     as: 'postedByUser',
        //   }
        // },
        // { $unwind: "$postedByUser" },
        //If msg was posted by reciever so this condition runs
        // {
        //     $lookup: {
        //       from: RECIEVED_BY_USER_TYPE,
        //       localField: 'postedByUser',
        //       foreignField: '_id',
        //       as: 'postedByUser',
        //     }
        // },
        // { $unwind: "$postedByUser" },
        // apply pagination
        { $skip: options.page * options.limit },
        { $limit: options.limit },
        { $sort: { createdAt: 1 } },
      ]);
    } catch (error) {
      throw error;
    }
  }

  chatMessageSchema.statics.getRecentConversation = async function (chatRoomIds, options, currentUserOnlineId, RECIEVER_TYPE) {
    try {
    //   const conversations = await this.find({ chatRoomId: { $in: chatRoomIds } })
    //   conversations.forEach(conversation => {
          
    //   });
      return this.aggregate([
        { $match: { chatRoomId: { $in: chatRoomIds } } },
        {
          $group: {
            _id: '$chatRoomId',
            messageId: { $last: '$_id' },
            chatRoomId: { $last: '$chatRoomId' },
            message: { $last: '$message' },
            type: { $last: '$type' },
            postedByUser: { $last: '$postedByUser' },
            createdAt: { $last: '$createdAt' },
            readByRecipients: { $last: '$readByRecipients' },
          }
        },
        { $sort: { createdAt: -1 } },
        // do a join on another table called users, and 
        // get me a user whose _id = postedByUser
        // {
        //   $lookup: {
        //     from: RECIEVER_TYPE,
        //     localField: 'postedByUser',
        //     foreignField: '_id',
        //     as: 'postedByUser',
        //   }
        // },
        // { $unwind: "$postedByUser" },
        // do a join on another table called chatrooms, and 
        // get me room details
        {
          $lookup: {
            from: 'chatrooms',
            localField: '_id',
            foreignField: '_id',
            as: 'roomInfo',
          }
        },
        { $unwind: "$roomInfo" },
        
        // do a join on another table called users 
        // {
        //   $lookup: {
        //     from: RECIEVER_TYPE,
        //     localField: 'roomInfo.userIds',
        //     foreignField: '_id',
        //     as: 'roomInfo.userProfile',
        //   }
        // },
        // { $unwind: "$readByRecipients" },
        // // do a join on another table called users 
        // {
        //   $lookup: {
        //     from: RECIEVER_TYPE,
        //     localField: 'readByRecipients.readByUserId',
        //     foreignField: '_id',
        //     as: 'readByRecipients.readByUser',
        //   }
        // },
  
        {
          $group: {
            _id: '$roomInfo._id',
            messageId: { $last: '$messageId' },
            chatRoomId: { $last: '$chatRoomId' },
            message: { $last: '$message' },
            type: { $last: '$type' },
            postedByUser: { $last: '$postedByUser' },
            readByRecipients: { $addToSet: '$readByRecipients' },
            roomUsers: { $addToSet: '$roomInfo.userIds' },
            createdAt: { $last: '$createdAt' },
          },
        },
        // apply pagination
        { $sort: { createdAt: -1 } },
        { $skip: options.page * options.limit },
        { $limit: options.limit },
      ]);
    } catch (error) {
      throw error;
    }
  }

  chatMessageSchema.statics.getUnreadMessages = async function (chatRoomId, currentUserOnlineId) {
    try {
      return this.countDocuments(
        {
          chatRoomId,
          'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  chatMessageSchema.statics.markMessageRead = async function (chatRoomId, currentUserOnlineId) {
    try {
      return this.updateMany(
        {
          chatRoomId,
          'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
        },
        {
          $addToSet: {
            readByRecipients: { readByUserId: currentUserOnlineId }
          }
        },
        {
          multi: true
        }
      );
    } catch (error) {
      throw error;
    }
  }

const ChatMessage = mongoose.model('ChatMessage',chatMessageSchema)
module.exports = ChatMessage