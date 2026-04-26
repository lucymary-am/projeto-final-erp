import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegisterPayload } from './register.types';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  register(payload: RegisterPayload): Observable<unknown> {
    return this.http.post(`${this.apiBaseUrl}/usuarios`, payload);
  }
}
