import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Consultation, ChatMessage

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time chat in consultations.
    Handles message sending, receiving, and typing indicators.
    """
    
    async def connect(self):
        """Handle WebSocket connection."""
        self.consultation_id = self.scope['url_route']['kwargs']['consultation_id']
        self.room_group_name = f'chat_{self.consultation_id}'
        self.user = self.scope['user']
        
        # Verify user is part of this consultation
        is_participant = await self.is_user_participant()
        if not is_participant:
            await self.close()
            return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send connection success message
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to chat'
        }))
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages."""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'chat_message':
                await self.handle_chat_message(data)
            elif message_type == 'typing':
                await self.handle_typing_indicator(data)
        except json.JSONDecodeError:
            await self.send_error('Invalid message format')
    
    async def handle_chat_message(self, data):
        """Handle and broadcast chat messages."""
        message_text = data.get('message', '').strip()
        if not message_text:
            return
        
        # Save message to database
        message_obj = await self.save_message(message_text)
        
        # Broadcast to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message_broadcast',
                'message': {
                    'id': message_obj['id'],
                    'message': message_obj['message'],
                    'sender': message_obj['sender'],
                    'created_at': message_obj['created_at'],
                    'is_from_customer': message_obj['is_from_customer'],
                }
            }
        )
    
    async def handle_typing_indicator(self, data):
        """Handle typing indicator."""
        is_typing = data.get('is_typing', False)
        
        # Broadcast typing status to others in room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'typing_indicator_broadcast',
                'user_id': self.user.id,
                'is_typing': is_typing
            }
        )
    
    async def chat_message_broadcast(self, event):
        """Broadcast chat message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))
    
    async def typing_indicator_broadcast(self, event):
        """Broadcast typing indicator to WebSocket."""
        # Don't send typing indicator to the user who is typing
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing_indicator',
                'is_typing': event['is_typing']
            }))
    
    async def send_error(self, error_message):
        """Send error message to client."""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message
        }))
    
    @database_sync_to_async
    def is_user_participant(self):
        """Check if user is participant in consultation."""
        try:
            consultation = Consultation.objects.get(id=self.consultation_id)
            return self.user in [consultation.customer, consultation.astrologer]
        except Consultation.DoesNotExist:
            return False
    
    @database_sync_to_async
    def save_message(self, message_text):
        """Save chat message to database."""
        consultation = Consultation.objects.get(id=self.consultation_id)
        message = ChatMessage.objects.create(
            consultation=consultation,
            sender=self.user,
            message=message_text
        )
        
        return {
            'id': message.id,
            'message': message.message,
            'sender': {
                'id': message.sender.id,
                'phone_number': message.sender.phone_number,
                'first_name': message.sender.first_name,
            },
            'created_at': message.created_at.isoformat(),
            'is_from_customer': message.is_from_customer,
        }
