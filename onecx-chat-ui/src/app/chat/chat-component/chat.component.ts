import { Component, Input, OnInit } from "@angular/core";
import { ChatDTO } from "./models/chatDTO.model";
import { date } from "zod";
import { MessageDTO } from "./models/messageDTO.model";
import { ParticipantDTO } from "./models/participantDTO.model";

@Component({
    selector: 'app-chat-component',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class chatComponent implements OnInit{
    
    //Toggle visibility of user management
    userManagementVisible: boolean = false
    
    userSearchText = ""
    
    showSearchResults = false
    
    //Used to temporarily store changes to participants of chats until confirmed
    tempParticipants: ParticipantDTO[] = []
    
    searchResult: ParticipantDTO[] = []

    chats: ChatDTO[] = []

    topics: string[] = []
    
    selectedChat = {
        type: '',
        topic: '',
        id: '-1',
        summary:'',
        messages: [] as MessageDTO[],
        tenantId: '',
        appId: '',
        participants: [] as ParticipantDTO[],
        chatRef: ''
    }

    autoResize: boolean = true
    messageText: string = ""

    ngOnInit(): void {
        
    }

    selectChat(id: string) {
        if(id == '-1') {
            this.selectedChat = {
                type: '',
                topic: '',
                id: '-1',
                summary:'',
                messages: [] as MessageDTO[],
                tenantId: '',
                appId: '',
                participants: [] as ParticipantDTO[],
                chatRef: ''
            }
        } else {

        }
    }

    sendMessage() {
        if (this.selectedChat.id != "-1") {
            let message = {
                id: '',
                text: this.messageText,
                creationDate: new Date(),
                userName: "mjanen", //TODO get username from Keycloak?,
                reliability: 1,
                tenantId: "2"
            }
            // this.selectedChat.messages.push(message)

        } else {
            //start new chat
        }
        this.messageText = ""
    }

    keyDownFunction(event: KeyboardEvent) {
        //Enable sending messages with 'Enter' press unless shift key is also pressed
        if (event.key == 'Enter' && !event.shiftKey) {
            //Prevent new line from being added after sending
            event.preventDefault()
            this.sendMessage()
        }
    }

    showUserManagement() {
        this.userManagementVisible = !this.userManagementVisible
        this.selectedChat.participants.forEach(p => {
            this.tempParticipants.push(p)
        })
    }

    addParticipant(participant: ParticipantDTO) {
        this.tempParticipants.push(participant)
    }

    removeParticipant(participant: ParticipantDTO) {
       let index = this.tempParticipants.findIndex(p => p == participant)
       this.tempParticipants.splice(index, 1)
    }

    searchUser() {
        //Timeout is necessary as otherwise searchText is not updated in time when search is happening
        setTimeout(() => {
            this.showSearchResults = true
            // this.searchResult = this.users.filter(user => user.name.includes(this.userSearchText) && !this.tempParticipants.includes(user))
        }, 100)
    } 

    hideSearchResults() {
        this.showSearchResults = false
    }

    cancel() {
        this.userManagementVisible = false
        //Clear temp participant without updating the chat object
        this.tempParticipants = []
    }

    confirm() {
        //Clear participants to avoid duplication
        this.selectedChat.participants = []
        //Copy updated participants into chat object
        this.tempParticipants.forEach(p => this.selectedChat.participants.push(p))
        this.tempParticipants = []
        this.userManagementVisible = false
    }
}