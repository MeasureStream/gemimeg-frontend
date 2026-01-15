/**
 *  Copyright 2025 Physikalisch-Technische Bundesanstalt
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  1. Redistributions of source code must retain the above copyright notice,
 *  this list of conditions and the following disclaimer.
 *
 *  2. Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *  may be used to endorse or promote products derived from this software without
 *  specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 *  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 *  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 *  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 *  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 *  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 *  OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";

export interface MeInterface {
  name: string;
  loginUrl: string;
  principal: any;
  xsrfToken: string;
  logoutUrl: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "";
  private xsrfTokenSubject = new BehaviorSubject<string | null>(null);
  private userSubject = new BehaviorSubject<MeInterface | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Fetches the current user information and XSRF token from the backend.
   */
  fetchMe(): Observable<MeInterface> {
    return this.http.get<MeInterface>(`${this.API_URL}/me`).pipe(
      tap((me) => {
        if (me.xsrfToken) {
          this.xsrfTokenSubject.next(me.xsrfToken);
        }
        this.userSubject.next(me);
      }),
    );
  }

  getXsrfToken(): string | null {
    return this.xsrfTokenSubject.value;
  }

  getUser(): MeInterface | null {
    return this.userSubject.value;
  }

  get xsrfToken$(): Observable<string | null> {
    return this.xsrfTokenSubject.asObservable();
  }

  get user$(): Observable<MeInterface | null> {
    return this.userSubject.asObservable();
  }
}
