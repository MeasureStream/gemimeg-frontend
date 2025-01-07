/*
* DCC generated models can be found under app/generated/dcc/model/*.ts
*
* This file hosts only datatypes used for internal DCC use cases
*/

// custom Date Type ...
export class DateType {
  day!: string;
  month!: string;
  year!: string;
}

export class DateTimeType {
  day!: string;
  month!: string;
  year!: string;
  hour!: string;
  minute!: string;
  second!: string;
  millisecond?: string;
}
