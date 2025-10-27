import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatOptionButtonComponent } from '../chat-option-button/chat-option-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { AppStateService } from '@onecx/portal-integration-angular';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-chat-initial-screen',
  standalone: true,
  imports: [CommonModule, ChatHeaderComponent, ChatOptionButtonComponent, TranslateModule, CardModule],
  templateUrl: './chat-initial-screen.component.html',
  styleUrls: ['./chat-initial-screen.component.scss']
})
export class ChatInitialScreenComponent {
  @Output() selectMode = new EventEmitter<string>();
  logoUrl = '';

  constructor(private appState: AppStateService) {
    this.appState.currentMfe$
      .pipe(
        map((mfe) => {
          const baseUrl = mfe.remoteBaseUrl.replace('workspace', 'onecxChatUi');
          this.logoUrl = Location.joinWithSlash(baseUrl, environment.DEFAULT_LOGO_PATH);
        })
      )
      .subscribe();
  }
}
