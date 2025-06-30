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
import { Directive, OnChanges, OnInit, Input, ElementRef, OnDestroy, SimpleChanges } from "@angular/core";
import { Subject} from "rxjs";
import { MathService } from "./math.service";
import { take, takeUntil } from "rxjs/operators";

@Directive({
  selector: '[appMath]'
})
export class MathDirective implements OnInit, OnChanges, OnDestroy {
  @Input() appMath: string | undefined;

  private alive$ = new Subject<boolean>();
  private readonly html: HTMLElement;

  constructor(private mathService: MathService, elementRef: ElementRef) {
    this.html = elementRef.nativeElement;
  }

  ngOnInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes['appMath'] && changes['appMath'].currentValue) {
      this.render();
    }
  }

  private render() {
    this.mathService.ready().pipe(
      take(1),
      takeUntil(this.alive$)
    ).subscribe(() => this.mathService.render(this.html, this.appMath ?? ""));
  }

  ngOnDestroy() {
    this.alive$.next(false);
  }
}
