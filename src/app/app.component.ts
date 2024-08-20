import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadUsers, UserState } from './state/state-management';
import { debounceTime, Observable, of, Subject, tap } from 'rxjs';
import { isLoading } from './state/user.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  searchTerm: string = '';
  loading$: Observable<boolean>;
  private searchTermSubject = new Subject<string>();

  constructor(private store: Store<{ user: UserState }>) {
    this.loading$ = this.store.select(isLoading);
    this.getSearchedUsers().subscribe();
  }

  onSearch() {
    this.searchTermSubject.next(this.searchTerm);
  }

  getSearchedUsers(){
    return this.searchTermSubject.pipe(
      debounceTime(500),
      tap(term => {
        const userId = parseInt(term, 10);
        if (!isNaN(userId)) {
          return this.store.dispatch(loadUsers({ page: 1, id: userId }));
        } else {
          return this.store.dispatch(loadUsers({ page: 1, per_page: 6 }));
        }
      })
    )
  }
}
