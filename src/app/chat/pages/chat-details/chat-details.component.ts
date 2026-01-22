import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import {
  Action,
  BreadcrumbService,
  ObjectDetailItem,
} from '@onecx/portal-integration-angular';
import { Observable, map } from 'rxjs';

import { PrimeIcons } from 'primeng/api';
import { ChatDetailsActions } from './chat-details.actions';
import { selectChatDetailsViewModel } from './chat-details.selectors';
import { ChatDetailsViewModel } from './chat-details.viewmodel';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss'],
})
export class ChatDetailsComponent implements OnInit {
  viewModel$: Observable<ChatDetailsViewModel> = this.store.select(
    selectChatDetailsViewModel,
  );

  headerLabels$: Observable<ObjectDetailItem[]> = this.viewModel$.pipe(
    map((vm) => {
      const labels: ObjectDetailItem[] = [
        {
          label: 'CHAT_DETAILS.FORM.ID',
          labelPipe: TranslatePipe,
          value: vm.details?.id,
        },
        {
          label: 'CHAT_DETAILS.FORM.TOPIC',
          labelPipe: TranslatePipe,
          value: vm.details?.topic,
        }
      ];
      return labels;
    }),
  );

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          titleKey: 'CHAT_DETAILS.GENERAL.BACK',
          labelKey: 'CHAT_DETAILS.GENERAL.BACK',
          show: 'always',
          disabled: !vm.backNavigationPossible,
          permission: 'CHAT#BACK',
          actionCallback: () => {
            this.store.dispatch(ChatDetailsActions.navigateBackButtonClicked());
          },
        },
        {
          titleKey: 'CHAT_DETAILS.GENERAL.DELETE',
          labelKey: 'CHAT_DETAILS.GENERAL.DELETE',
          icon: PrimeIcons.TRASH,
          show: 'asOverflow',
          btnClass: '',
          conditional: true,
          actionCallback: () => {
            this.delete();
          },
        },
        {
          titleKey: 'CHAT_DETAILS.GENERAL.MORE',
          icon: PrimeIcons.ELLIPSIS_V,
          show: 'always',
          btnClass: '',
          actionCallback: () => {
            // TODO: add callback
          },
        },
      ];
      return actions;
    }),
  );

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {
        titleKey: 'CHAT_DETAILS.BREADCRUMB',
        labelKey: 'CHAT_DETAILS.BREADCRUMB',
        routerLink: '/chat',
      },
    ]);
  }

  delete() {
    this.store.dispatch(ChatDetailsActions.deleteButtonClicked());
  }
}
