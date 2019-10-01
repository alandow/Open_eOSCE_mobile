export class RadioOption {
  text: string;
  value:string;
  id:number;
  needscomment:boolean;
  selected: boolean = false;

  constructor(id:number, text: string, value = '', needscomment=false) {
    this.text = text;
    this.value = value;
    this.id = id;
    this.needscomment = needscomment;
  }
}