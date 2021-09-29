const express = require('express')
const router = express.Router()
const chatRoom = require('../controller/chatRoom.controller')
const auth = require('../../users/auth')

// //FOR SELLER
router.get('/seller/chat/conversations/:roomType', auth.seller ,chatRoom.getRecentConversation)
router.post('/seller/chat/initiate', auth.seller ,chatRoom.initiate)
// router.post('/seller/chat/:roomId/message', auth.seller ,chatRoom.postMessage)
router.get('/seller/chat/:roomId', auth.seller ,chatRoom.getConversationByRoomId)
router.patch('/seller/chat/:roomId/markRead', auth.seller , chatRoom.markConversationReadByRoomId)
router.delete('/seller/chat/room/:roomId' , auth.seller , chatRoom.deleteRoomById)
router.delete('/seller/chat/message/:messageId', auth.seller , chatRoom.deleteMessageById)

// //FOR ADMIN
// router.get('/superAdmin/chat/conversations/:roomType', auth.superAdmin ,chatRoom.getRecentConversation)
// router.post('/superAdmin/chat/initiate', auth.superAdmin ,chatRoom.initiate)
// router.post('/superAdmin/chat/:roomId/message', auth.superAdmin ,chatRoom.postMessage)
// router.get('/superAdmin/chat/:roomId', auth.superAdmin ,chatRoom.getConversationByRoomId)
// router.patch('/superAdmin/chat/:roomId/mark-read', auth.superAdmin , auth.superAdmin , chatRoom.markConversationReadByRoomId)
// router.delete('/superAdmin/chat/room/:roomId', auth.superAdmin , chatRoom.deleteRoomById)
// router.delete('/superAdmin/chat/message/:messageId', auth.superAdmin , chatRoom.deleteMessageById)

// //FOR BUYER
router.get('/buyer/chat/conversations/:roomType', auth.buyer ,chatRoom.getRecentConversation)
router.post('/buyer/chat/initiate', auth.buyer ,chatRoom.initiate)
// router.post('/buyer/chat/:roomId/message', auth.buyer ,chatRoom.postMessage)
router.get('/buyer/chat/:roomId', auth.buyer ,chatRoom.getConversationByRoomId)
router.patch('/buyer/chat/:roomId/mark-read', auth.buyer , chatRoom.markConversationReadByRoomId)
router.delete('/buyer/chat/room/:roomId', auth.buyer , chatRoom.deleteRoomById)
router.delete('/buyer/chat/message/:messageId', auth.buyer , chatRoom.deleteMessageById)

module.exports = router