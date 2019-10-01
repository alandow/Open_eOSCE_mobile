import { AssessmentItem } from "./assessmentitem.model";

export class Assessment {
  id: string;
  name: string;
  description: string;
  notes: string;
  comment:string;
  status: string;
  exam_instance_items: AssessmentItem[];
}