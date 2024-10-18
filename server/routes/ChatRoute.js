import express from 'express';
import { createChat, userChats, findChat } from '../controllers/chatController.js';

const router = express.Router();

// Create chat
router.post('/createChat', createChat); // This matches the fetch URL

// Get user chats
router.get('/userChats/:userId', userChats);

// Find specific chat
router.get('/findChat/:firstId/:secondId', findChat);

export default router;
