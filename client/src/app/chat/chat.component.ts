import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import {Message} from '../message'
import {formatDate } from '@angular/common';


@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	room: string ='';
	message: string;
	messages: Message[] = [];
	title: string = "chat";
	messageUser: string;
	username: string;
	o_message:Message ;
	time:string;
	constructor(private chatService: ChatService) {
		
		this.username = this.chatService.username;

	}

	sendMessage() {
		var object = {
			message: this.message,
			username: this.chatService.username,
			room: this.room
		};
		if (this.room == '')
			alert('join a room first');
		((<HTMLInputElement>document.getElementById("input")).value) = ''
		// console.log('ici ' + document.getElementById('textArea').innerText)
		// document.getElementById('textArea').innerText = 'salut';
		this.chatService.socket.emit('roomMessage', object);
		// console.log(this.message);
		
	}

	// createRoom(roomname) {
	// 	if (roomname == "") alert("choose a username")
	// 	else {
	// 		this.chatService.socket.emit('roomnameIsAvailable', roomname);
	// 		this.chatService.socket.on('roomnameIsAvailableResponse', (isAvailable) => {
	// 			if (isAvailable) this.chatService.socket.emit('createRoom', roomname);
	// 			else alert("this roomname is already taken")
	// 		})
	// 	} return;
	// }


	test() {
		// this.chatService.joinRoom();
	}

	test2() {
		this.chatService.test2();
	}

	onKey(event: any) { // without type info
		if(event.keycode == 13)
			event.target.value = '';
	  }
	ngOnInit() {
		this.chatService
			.getMessages()
			.subscribe((message) => {
				
				this.o_message = {username : message.username, message: message.message, time: message.time}
				this.messages.push(this.o_message);
				// this.messageUser = message.username;
				// console.log(this.username);
				// console.log(this.messageUser);
			});	
		this.chatService.joinRoom().subscribe(() =>{
			if(this.room != this.chatService.room)
				this.messages = [];
			this.room = this.chatService.room;
			console.log(this.room);
		})
	}
	
	

}
