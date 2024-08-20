import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { loadUsers, UserState } from 'src/app/state/state-management';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { User, UserResponse } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('show', style({ opacity: 1 })),
      state('hide', style({ opacity: 0 })),
      transition('hide => show', animate('300ms ease-in')),
      transition('show => hide', animate('300ms ease-out')),
    ]),
  ]
})
export class UsersListComponent implements OnInit {
  users$: Observable<UserResponse>;

  displayedColumns: string[] = ['name', 'email'];
  totalUsers = 0;
  pageSize = 6;
  dataSource = new MatTableDataSource<User>();

  constructor(
    private store: Store<{ user: UserState }>,
    private router: Router
  ) {
    this.users$ = store.pipe(select(state => state.user.users));
  }

  ngOnInit(): void {
    this.store.dispatch(loadUsers({page: 1, per_page:this.pageSize}));
    this.users$.subscribe(users => {
      this.dataSource.data = users.data;
      this.totalUsers = users.total;
      this.pageSize = users.per_page;
    })
  }

  onPageChange(event:any): void {
    this.store.dispatch(loadUsers({page: event.pageIndex + 1, per_page: event.pageSize}));
  }

  viewUserDetails(userId: number): void {
    this.router.navigate(['/user', userId]);
  }
}
