import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Chat, ChatPageResult, ChatSearchCriteria, ChatType, CreateChat, Message, MessageType, Participant, CreateMessage } from "src/app/shared/generated";
import { ChatComponentActions } from "./chat-component.actions";
import { KeycloakService } from "keycloak-angular";
import { Observable } from "rxjs";
import { selectChat, selectChatPageResults, selectMessages } from "./chat-component.selector";
import { WebSocketService } from "./web-socket.service";
import { WebSocketHelperDTO } from "./web-socket-helper-dto.model";

@Component({
    selector: 'app-chat-component',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class chatComponent implements OnInit{
    constructor(private store: Store, private keyCloakService: KeycloakService) {

    }
    userName!: string
    websocketService!: WebSocketService

    chatPageResult$?: Observable<ChatPageResult>;
    chatPageResult?: ChatPageResult;
    
    userManagementVisible: boolean = false    
    userSearchText = ""
    showSearchResults = false
    
    //Used to temporarily store changes to participants of chats until confirmed
    tempParticipants: Participant[] = []
    searchResult: Participant[] = []
    chats: Chat[] = []
    topics: string[] = []
    selectedTopic: string = ''
    
    selectedChat$!: Observable<Chat>
    selectedChat: Chat = {
        type: ChatType.AiChat
    }

    messages$!: Observable<Message[]>
    messages: Message[] = []

    autoResize: boolean = true
    messageText: string = ""

    ngOnInit(): void {
        // this.userName = this.keyCloakService.getUsername()
        this.userName = 'onecx'
        this.websocketService = new WebSocketService(this.userName)

        // this.websocketService.receiveStatus('').subscribe((message: WebSocketHelperDTO) => {
        //     if(this.selectedChat.id == message.chatId) {
        //         this.messages.push(message.message)
        //     }  
        // })

        this.chatPageResult$ = this.store.select(selectChatPageResults)
        this.selectedChat$ = this.store.select(selectChat);
        this.messages$ = this.store.select(selectMessages)
        
        this.chatPageResult$?.subscribe((chatPageResult) => {
            this.chatPageResult = chatPageResult
            this.chats = this.chatPageResult.stream!
        })

        this.selectedChat$.subscribe((chat) => {
            this.selectedChat = chat
        })

        this.messages$.subscribe((messages) => {
            this.messages = messages
        })

        let searchCriteria: ChatSearchCriteria = {
            pageNumber: 0,
            pageSize: 10,
            participant: this.userName
        }
        // this.store.dispatch(ChatComponentActions.chatPageOpened({searchCriteria: searchCriteria}))

        
        // this.selectChat('10a975a0-cd29-47e8-bd74-080f20351c64')
    }
    
    
    selectChat(id: string) {
        this.store.dispatch(ChatComponentActions.getChatById({id: id}))
        this.store.dispatch(ChatComponentActions.getMessagesById({id: id}))

    }

    sendMessage() {
        if (this.selectedChat.id == "NewChat") {
            //TODO Find a way to determine partcicipants by topric?
            let createChat: CreateChat = {
                type: ChatType.HumanChat,
                topic: this.selectedTopic,
                participants: this.tempParticipants
            }
            this.store.dispatch(ChatComponentActions.createChatClicked({createChat: createChat}))
        } else {
            let createMessage: CreateMessage = {
                type: MessageType.Human,
                userName: this.userName,
                text: this.messageText,
                version: 1
            }
            this.store.dispatch(ChatComponentActions.sendMessage({chatId: this.selectedChat.id!, createMessage: createMessage}))
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
        this.selectedChat!.participants!.forEach(p => {
            this.tempParticipants.push(p)
        })
    }

    addParticipant(participant: Participant) {
        this.tempParticipants.push(participant)
    }

    removeParticipant(participant: Participant) {
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
        // this.tempParticipants.forEach(p => this.selectedChat.participants.push(p))
        this.tempParticipants = []
        this.userManagementVisible = false
    }
}