import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormulaDto } from '../generated/dcc/model/formulaDto';
import { MathService } from './math/math.service';

@Component({
  selector: 'app-mathml',
  templateUrl: './mathml.component.html',
  styleUrls: ['./mathml.component.scss'],
})
export class MathmlComponent implements OnInit, AfterViewInit {
  mathml: string | any = '';
  @ViewChild('mathContainer', { static: false }) mathContainer!: ElementRef;

  formulaDto: FormulaDto | any = {
    id: '1',
    content: '',
    type: FormulaDto.TypeEnum.Mathml,
  };

  constructor(private mathService: MathService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.renderMathML();
  }

  renderMathML(): void {
    const mathMLContent = this.mathml || (this.formulaDto && this.formulaDto.content);
    if (mathMLContent && this.mathContainer?.nativeElement) {
      const mathContainerElement = this.mathContainer.nativeElement;
      try {
        mathContainerElement.innerHTML = '';
        mathContainerElement.innerHTML = mathMLContent;
        this.mathService.ready().subscribe((isReady) => {
          if (isReady) {
            window.MathJax.startup.promise
              .then(() => {
                window.MathJax.typesetPromise();
                console.log('MathJax rendering complete for specific element');
              })
              .catch((err) => console.error('MathJax render error:', err));
          } else {
            console.error('MathJax is not ready');
          }
        });
      } catch (error) {
        console.error('Error rendering MathML:', error);
      }
    } 
  }
}
