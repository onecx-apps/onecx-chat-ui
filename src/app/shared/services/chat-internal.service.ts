import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChatsInternal, Configuration } from '../generated';

@Injectable({ providedIn: 'root' })
export class ChatInternalService {
  constructor(private chatInternalService: ChatsInternal) {}

  overwriteBaseURL(baseUrl: string) {
    this.chatInternalService.configuration = new Configuration({
      basePath: Location.joinWithSlash(baseUrl, environment.apiPrefix),
    });
  }

  getService() {
    return this.chatInternalService;
  }
}
