import { createSelector } from '@ngrx/store';
import { UserState } from './state-management';

export const selectUserState = (state: any) => state.user;

export const isLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);
