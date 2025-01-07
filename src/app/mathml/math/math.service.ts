import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';

interface MathJaxConfig {
  source: string;
  integrity: string;
  id: string;
}

declare global {
  interface Window {
    MathJax: {
      typesetPromise: () => Promise<void>;
      startup: {
        promise: Promise<void>;
      };
    };
  }
}
@Injectable({
  providedIn: 'root',
})
export class MathService {
  private signal: Subject<boolean>;
  private mathJax: MathJaxConfig = {
    source: 'https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/mml-chtml.js',
    integrity: 'sha256-CnzfCXjFj1REmPHgWvm/OQv8gFaxwbLKUi41yCU7N2s=',
    id: 'MathJaxScript',
  };
  private mathJaxFallback: MathJaxConfig = {
    source: 'assets/mathjax/mml-chtml.js',
    integrity: 'sha256-CnzfCXjFj1REmPHgWvm/OQv8gFaxwbLKUi41yCU7N2s=',
    id: 'MathJaxBackupScript',
  };

  constructor() {
    this.signal = new ReplaySubject<boolean>();
    // this.loadMathJaxScript();
  }

  private loadMathJaxScript(): void {
    this.registerMathJaxAsync(this.mathJax)
      .then(() => this.signal.next(true))
      .catch((error) => {
        console.error('Primary MathJax script failed to load:', error);
        this.registerMathJaxAsync(this.mathJaxFallback)
          .then(() => this.signal.next(true))
          .catch((fallbackError) => console.error('Fallback MathJax script failed to load:', fallbackError));
      });
  }

  private async registerMathJaxAsync(config: MathJaxConfig): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(config.id)) {
        resolve();
        return;
      }

      const script: HTMLScriptElement = document.createElement('script');
      script.id = config.id;
      script.type = 'text/javascript';
      script.src = config.source;
      script.integrity = config.integrity;
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  ready(): Observable<boolean> {
    return this.signal.asObservable();
  }

  render(element: HTMLElement, math: string) {
    if (element.innerHTML !== math) {
      element.innerHTML = math;
      window.MathJax.startup.promise.then(() => {
        window.MathJax.typesetPromise()
          .then(() => {
            console.log('MathJax rendering complete');
          })
          .catch((err) => {
            console.error('MathJax render error:', err);
          });
      });
    }
  }
}
