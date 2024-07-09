import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Chat, ChatPageResult, ChatSearchCriteria, ChatType, CreateChat, Message, MessageType, Participant, CreateMessage, WebsocketHelper } from "src/app/shared/generated";
import { ChatComponentActions } from "./chat-component.actions";
import { KeycloakService } from "keycloak-angular";
import { Observable } from "rxjs";
import { selectChat, selectChatPageResults, selectChatParticipants, selectMessages } from "./chat-component.selector";
import { WebSocketService } from "./web-socket.service";
import { MessageService } from "primeng/api";

@Component({
    selector: 'app-chat-component',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class chatComponent implements OnInit{
    constructor(private store: Store, private keyCloakService: KeycloakService, private messageService: MessageService) {

    }

    
    userName: string = "onecx"
    websocketService!: WebSocketService
    
    searchCriteria: ChatSearchCriteria = {
        pageNumber: 0,
        pageSize: 10,
        participant: this.userName
    }

    chatPageResult$?: Observable<ChatPageResult>;
    chatPageResult?: ChatPageResult;
    
    userManagementVisible: boolean = false    
    userSearchText = ""
    showSearchResults = false
    
    chatParticipants: Participant[] = []
    chatParticipants$?: Observable<Participant[]>
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

        this.websocketService.receivedMessage$.subscribe((websocketHelper: WebsocketHelper) => {
            if(websocketHelper != undefined) {
                if(this.selectedChat.id == websocketHelper.chatId) {
                    this.messages = [...this.messages, websocketHelper.messageDTO]
                    this.scrollToBottom()
                } else{
                    this.messageService.add({severity:'info', summary:'Received new Message in chat' + websocketHelper.chatId, detail:'Via MessageService'});
                }
            }
        })
        

        this.chatPageResult$ = this.store.select(selectChatPageResults)
        this.selectedChat$ = this.store.select(selectChat);
        this.messages$ = this.store.select(selectMessages)
        this.chatParticipants$ = this.store.select(selectChatParticipants)
        
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

        this.chatParticipants$.subscribe((participants) => {
            this.chatParticipants = participants
        })
        
        this.store.dispatch(ChatComponentActions.chatPageOpened({searchCriteria: this.searchCriteria}))

        
        // this.selectChat('54dfd4ab-7072-4acc-b7f8-2ee3986144dd')
    }
    
    selectChat(id: string) {
        if(id != "NewChat") {
            this.store.dispatch(ChatComponentActions.getChatById({id: id}))
            this.store.dispatch(ChatComponentActions.getMessagesById({id: id}))
        }
    }

    sendMessage() {
        if (this.selectedChat.id == "NewChat") {
            //TODO Find a way to determine partcicipants by topric?
            let createChat: CreateChat = {
                type: ChatType.HumanChat,
                topic: this.selectedTopic,
                creationUser: this.userName,
                summary: "TEST CREATE",
                participants: [{
                    type: "HUMAN",
                    userId: "onecx",
                    email: "onecx@onecx.com",
                    userName: "onecx",
                    creationUser: "onecx"
                }]
            }
            this.store.dispatch(ChatComponentActions.createChatClicked({createChat: createChat}))
            this.store.dispatch(ChatComponentActions.chatPageOpened({ searchCriteria: this.searchCriteria }))
        } else {
            let createMessage: CreateMessage = {
                type: MessageType.Human,
                userName: this.userName,
                text: this.messageText,
                version: 1
            }
            this.store.dispatch(ChatComponentActions.sendMessage({chatId: this.selectedChat.id!, createMessage: createMessage}))
            }
        this.scrollToBottom()
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
        this.tempParticipants = [...this.tempParticipants, participant]
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
        this.store.dispatch(ChatComponentActions.updateChat(
            {        
                chatId: this.selectedChat.id!,
                updateChat: {
                    participants: this.tempParticipants
                }
            })
        )
        this.tempParticipants = []
        this.userManagementVisible = false
    }

    scrollToBottom() {
        // Get the div element
        let divElement = document.getElementById('selectedChat');
        // Scroll to the bottom of the div
        divElement!.scrollTop = divElement!.scrollHeight;
    }
}