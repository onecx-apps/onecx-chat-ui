import { bootstrapModule } from '@onecx/angular-webcomponents';
import { environment } from 'src/environments/environment';
import { OnecxChatUiModule } from './app/onecx-chat-ui-app.remote.module';

bootstrapModule(OnecxChatUiModule, 'microfrontend', environment.production);
