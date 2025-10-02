import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject:BehaviorSubject<string> = new BehaviorSubject<string>('en');
  public language: Observable<string> = this.languageSubject.asObservable();

  constructor() { }

  setLanguage(lang: string) {
    this.languageSubject.next(lang);
  }

  getLanguage(): string {
    return this.languageSubject.value;
  }
}
