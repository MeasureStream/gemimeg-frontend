import { Component } from '@angular/core';

@Component({
  selector: 'app-simple-test',
  templateUrl: './simple-test.component.html',
  styleUrls: ['./simple-test.component.scss']
})
export class SimpleTestComponent {
// math.service.ts

  multiply(a: number, b: number): number {
    return a * b;
  }
}


