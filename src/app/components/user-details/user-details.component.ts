import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadUserById, UserState } from 'src/app/state/state-management';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user$: Observable<any>;

  constructor(private route: ActivatedRoute, private store: Store<{ user: UserState }>, private router: Router) {
    this.user$ = store.pipe(select(state => state.user.selectedUser));
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id') || '';
    this.store.dispatch(loadUserById(+userId));
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
