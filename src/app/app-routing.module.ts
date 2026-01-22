import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { startsWith } from '@onecx/angular-webcomponents';
import { addInitializeModuleGuard } from '@onecx/portal-integration-angular';

export const routes: Routes = [
  {
    matcher: startsWith(''),
    loadChildren: () =>
      import('./chat/chat.module').then((mod) => mod.ChatModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(addInitializeModuleGuard(routes)),
    TranslateModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
