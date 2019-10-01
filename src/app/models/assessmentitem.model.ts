import { AssessmentItemItem } from "./assessmentitemitem.model";

export class AssessmentItem {
  id:string;
  exam_instance_id: string;
  order:number;
  heading: string;
  label: string;
  description: string;
  show_if_id: number;
  show_if_answer_id: number;
  no_comment: string;
  exclude_from_total: string;
  items: AssessmentItemItem[];
  visible:boolean;
  // the answers
  selectedvalue:string;
  selected_id:number;
  comment:string;
  valid:boolean  
}