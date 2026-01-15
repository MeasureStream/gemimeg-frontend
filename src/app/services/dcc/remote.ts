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
import { Observable } from "rxjs";
import { CalibrationCertificateDto } from "../../generated/dcc/model/calibrationCertificateDto";

@Injectable({
  providedIn: "root",
})
export class RemoteDccService {
  // Remote URL variable for easy configuration
  private remoteUrl = "/dcc-service";

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a DCC by its ID from the remote service.
   */
  getDccById(dccId: string): Observable<CalibrationCertificateDto> {
    console.log(`[RemoteDccService] Fetching DCC with ID: ${dccId}`);
    return this.http.get<CalibrationCertificateDto>(`${this.remoteUrl}/dcc/${dccId}`);
  }

  /**
   * Checks if the remote service is connected and working.
   */
  getStatus(): Observable<{ status: string; connected: boolean }> {
    console.log("[RemoteDccService] Checking status...");
    return this.http.get<{ status: string; connected: boolean }>(`${this.remoteUrl}/status`);
  }

  /**
   * Saves a DCC given its ID and the JSON object to the remote service.
   */
  saveDcc(dccId: string, dcc: CalibrationCertificateDto): Observable<{ success: boolean }> {
    console.log(`[RemoteDccService] Saving DCC with ID: ${dccId}`, dcc);
    return this.http.post<{ success: boolean }>(`${this.remoteUrl}/dcc/${dccId}`, dcc);
  }
}
