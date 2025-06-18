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
*
*/

import { Component, Input, OnInit, WritableSignal } from '@angular/core';
import { ItemDto } from 'src/app/generated/dcc/model/itemDto';
import { InitializationService } from 'src/app/services/dcc/initialization.service';

@Component({
  selector: 'app-dcc-item-list',
  templateUrl: './dcc-item-list.component.html',
  styleUrls: ['./dcc-item-list.component.scss']
})
export class DccItemListComponent implements OnInit {
  @Input() itemList!: Array<ItemDto>;
  @Input() manufacturerAvailable!: WritableSignal<{ [key: number]: boolean }>;

  constructor(private initializationService: InitializationService) {
  }

  ngOnInit(): void {
    if (!this.itemList || this.itemList.length === 0) {
      this.itemList = [this.initializationService.getEmptyItemDto()];
    }
  }

  addEmptyItemDto() {
    this.itemList.push(this.initializationService.getEmptyItemDto());
    const newIndex = this.itemList.length - 1;
    this.manufacturerAvailable.update(state => ({
      ...state,
      [newIndex]: true
    }));
  }

  removeItemFromList(index: number) {
    this.itemList!.splice(index, 1);
    this.manufacturerAvailable.update(state => {
      const newState: { [ke: number]: boolean } = {};
      for (let i = 0; i < this.itemList.length; i++) {
        if (i < index) {
          newState[i] = state[i];
        } else {
          newState[i] = state[i + 1];
        }
      }
      return newState;
    })
  }


}
