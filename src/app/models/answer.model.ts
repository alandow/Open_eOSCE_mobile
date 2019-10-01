export class Answer {
  assessment_item_id: string;
  selectedvalue: string;
  comment: string;
  constructor(assessment_item_id: string) {
    this.assessment_item_id = assessment_item_id;
}
}