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
          actionCallback: () => {
            this.delete();
          },
        }
      ];
      return actions;
    }),
  );

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService,
  ) { }

  ngOnInit(): void {
    const baseItems = [{
      titleKey: 'CHAT_SEARCH.BREADCRUMB',
      labelKey: 'CHAT_SEARCH.BREADCRUMB',
      routerLink: '../../',
    },
    ]
    this.breadcrumbService.setItems(baseItems);
    this.viewModel$.pipe().subscribe((vm) => {
      this.breadcrumbService.setItems([
        ...baseItems,
        {
          titleKey: 'CHAT_DETAILS.BREADCRUMB',
          labelKey: 'CHAT_DETAILS.BREADCRUMB',
          routerLink: `./`,
        },
      ])
    });
  }

  delete() {
    this.store.dispatch(ChatDetailsActions.deleteButtonClicked());
  }
}
