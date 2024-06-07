import { createFeatureSelector } from '@ngrx/store';
import { chatComponentFeature } from './chat.reducers';
import { ChatComponentState } from './chat.state';

export const selectChatComponentFeature =
  createFeatureSelector<ChatComponentState>(chatComponentFeature.name);
