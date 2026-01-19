import { ComponentHarness } from '@angular/cdk/testing';

export class ChatSettingsHarness extends ComponentHarness {
  public static readonly hostSelector = 'app-chat-settings';

  getCreateButton = this.locatorFor('[data-testid="create-chat-button"] button');

  async clickCreateButton(): Promise<void> {
    const button = await this.getCreateButton();
    await button.click();
  }
}
