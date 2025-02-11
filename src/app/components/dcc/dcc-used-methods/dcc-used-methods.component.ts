import { Component, Input, OnInit } from '@angular/core';

import { LanguageSpecificStringsDto } from 'src/app/generated/dcc/model/languageSpecificStringsDto';
import { MethodDto } from 'src/app/generated/dcc/model/methodDto';
import { LangTextPair } from 'src/app/generated/dcc/model/langTextPair';
import { RichContentDto } from 'src/app/generated/dcc/model/richContentDto';

@Component({
  selector: 'app-dcc-used-methods',
  templateUrl: './dcc-used-methods.component.html',
  styleUrls: ['./dcc-used-methods.component.scss']
})
export class DccUsedMethodsComponent implements OnInit {

  @Input() list: Array<MethodDto>;
  isExpanded: boolean[] = [true];

  constructor() {
    this.list = new Array<MethodDto>;
  }

  openDescriptionDialog() {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  addItem() {
    this.list.push(this.getEmptyUsedMethodDto());
    this.isExpanded.push(false);
  }

  removeItem(index: number) {
    this.list.splice(index, 1);
    this.isExpanded.splice(index, 1);
  }

  getEmptyUsedMethodDto(): MethodDto {
    var result = <MethodDto>{};
    result.name = <LanguageSpecificStringsDto>{};
    result.name.content = new Array<LangTextPair>;
    result.name.content.push(<LangTextPair>{})
    result.description = <RichContentDto>{};
    result.norms = new Array<string>;
    return result;
  }

  toggleCard(index:number) {
    this.isExpanded[index]=!this.isExpanded[index];
  }

  addExpanded() {
    this.isExpanded.push(true);
  }
}
