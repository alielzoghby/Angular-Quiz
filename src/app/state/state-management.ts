import { createReducer, on, createAction } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { mergeMap, map, catchError } from 'rxjs/operators';;
import { UserService } from '../services/user.service';
import { User, UserResponse } from '../models/user.model';

export interface UserState {
  users: UserResponse;
  selectedUser: any;
  loading: boolean;
}

const initialState: UserState = {
  users: {} as UserResponse,
  selectedUser: null,
  loading: true
};

export const loadUsers = createAction('[User] Load Users', (body:{page?: number, id?:number, per_page?:number}) => body);
export const loadUsersSuccess = createAction('[User] Load Users Success', (users: UserResponse) => ({ users }));
export const loadUserById = createAction('[User] Load User By ID', (id: number) => ({ id }));
export const loadUserByIdSuccess = createAction('[User] Load User By ID Success', (user: User) => ({ user }));

export const userReducer = createReducer(
  initialState,
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
  on(loadUserByIdSuccess, (state, { user }) => ({ ...state, selectedUser: user,loading: false}))
);

@Injectable()
export class UserEffects {

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(loadUsers),
    mergeMap(action => {
      const {type, ...body} = action
      return this.userService.fetchUsers(body).pipe(
        map(users => loadUsersSuccess(users)),
        catchError((error) => [loadUsersSuccess({} as UserResponse)])
      )
    })
  ));

  loadUserById$ = createEffect(() => this.actions$.pipe(
    ofType(loadUserById),
    mergeMap(action => this.userService.fetchUserById(action.id).pipe(
      map(user => loadUserByIdSuccess(user))
    ))
  ));

  constructor(private actions$: Actions, private userService: UserService) {}
}
