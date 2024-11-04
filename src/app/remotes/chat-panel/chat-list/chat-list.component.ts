import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkspaceService } from '@onecx/angular-integration-interface';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss',
})
export class BookmarkLinksComponent {
  urls: Record<string, Observable<string>> = {};
  // @Input() public bookmarks: Bookmark[] | undefined

  constructor(private readonly workspaceService: WorkspaceService) {}

  // getUrl(bookmark: Bookmark) {
  //   if (bookmark.id && bookmark.productName && bookmark.appId) {
  //     if (!this.urls[bookmark.id]) {
  //       this.urls[bookmark.id] = this.workspaceService.getUrl(
  //         bookmark.productName,
  //         bookmark.appId,
  //         bookmark.endpointName,
  //         bookmark.endpointParameters
  //       )
  //     }
  //     return this.urls[bookmark.id]
  //   }
  //   return undefined
  // }
}
