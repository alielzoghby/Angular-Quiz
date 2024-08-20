import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, UserResponse } from '../models/user.model';
import { filterNullEntity } from '../utils/filter-null-entity.util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  fetchUsers(body:{
    page?: number;
    id?:number;
    per_page?:number;
  }): Observable<UserResponse> {
    const cacheKey = `users-page-${body.page}-id-${body.id}-per_page-${body.per_page}`;

    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    } else {
      return this.http.get<any>(`${this.apiUrl}`,{params:filterNullEntity(body)})
        .pipe(
          map(response => {
            if(response.data?.length){
              return response;
            }else{
              return {
                ...response,
                data:[response.data]
              }
            }
          }),
          tap(data => this.cache.set(cacheKey, data))
        );
    }
  }

  fetchUserById(id: number): Observable<User> {
    const cacheKey = `user-id-${id}`;
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    } else {
      return this.http.get<any>(`${this.apiUrl}/${id}`)
        .pipe(
          map(response => response.data),
          tap(data => this.cache.set(cacheKey, data))
        );
    }
  }
}
