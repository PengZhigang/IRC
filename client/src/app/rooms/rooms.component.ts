import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];

  selectedRoom: string;
  count: number;

  constructor(private chatService: ChatService) {
    this.count = 0;
  }

  getrooms() {
    this.chatService.socket.emit('getRooms');
    this.chatService.socket.on('getRoomsResponse', (rooms, length) => {
      this.rooms = rooms;
    });
  }

  roomClick(roomname) {
    if (!this.chatService.room) {
      this.joinRoom(roomname)
      this.selectedRoom = roomname;
    }
    else {
      if (roomname == this.chatService.room) {
        this.leaveRoom(roomname)
        this.selectedRoom = '';
      } else {
        this.leaveRoom(this.chatService.room)
        this.selectedRoom = roomname;
        this.joinRoom(roomname)
      }
    }
  }

  joinRoom(roomname) {
    // if (this.chatService.room) this.leaveRoom(this.chatService.room)
    this.chatService.socket.emit('joinRoom', roomname);
    this.chatService.joinRoom();
  }

  leaveRoom(roomname) {
    this.chatService.socket.emit('leaveRoom', roomname);
    this.chatService.socket.on('leaveRoomResponse', (response) => {
      // console.log('disconnected from ' + roomname)
      this.chatService.room = '';
    })
  }

  createRoom(roomname) {
    if (roomname == "") alert("choose a roomname")
    else if (roomname.length >15) alert("less than 16 caracters pls");
    
    else {
      var available = true;
      this.rooms.map((n) => { if (roomname == n.name) available = false; });
      if (available) {
        this.chatService.socket.emit('createRoom', roomname)
      } else
        alert("this roomname is already taken")
    }
    ((<HTMLInputElement>document.getElementById("input")).value) = '';
  }

  deleteRoom(roomname) {
    this.chatService.deleteRoom(roomname);
  }

  modifyRoom(roomname) {
    if (roomname == "") alert("choose a username")
    else {
        var newName :any  = prompt("enter a newname ")
        console.log(newName)
        var available = true;
        this.rooms.map((n) => { if (newName == n.name) available = false; });
        if (available) {
          var objet = {
            rn: roomname,
            nn: newName
            }
          this.chatService.socket.emit('modifyRoom', objet);
          console.log(objet);
          
        } else
            alert("this roomname is already taken")
      }
    } 


  ngOnInit(): void {
    this.getrooms();
    this.chatService
      .getNewRoom()
      .subscribe((room) => {
        if ('add' == room.type) {
          this.rooms.push({ name: room.name })
        }
        else if (room.type == 'modify') {
          let index;
          for (let i = 0; i < this.rooms.length; ++i) if (room.name == this.rooms[i].name) index = i;
          this.rooms[index].name = room.newName;
        }
        else {
          let index;
          for (let i = 0; i < this.rooms.length; ++i) if (room.name === this.rooms[i].name) index = i;
          this.rooms.splice(index, 1);
        }
      });
  }


}
