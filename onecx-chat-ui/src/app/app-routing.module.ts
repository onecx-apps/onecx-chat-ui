import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { addInitializeModuleGuard } from '@onecx/portal-integration-angular';

export const routes: Routes = [
  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then(
        (mod) => mod.ChatComponentModule
      ),
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