export type QuestionType =
  | 'yes_no'
  | 'multiple_choice'
  | 'single_choice'
  | 'free_text'
  | 'integer'
  | 'decimal';

export interface Question {
  id: string;
  form_id: string;
  title: string;
  code?: string;
  answer_orientation: string;
  order: number;
  required: boolean;
  sub_question: boolean;
  question_type: QuestionType;
  additional_question?: string;

  conditional_question_id?: string;
  conditional_answer?: string;
  conditional_operator?: 'equals' | 'contains' | 'not_equals';
}

export interface AnswerOption {
  id: string;
  question_id: string;
  answer: string;
  order: number;
  open_answer: boolean;


  conditional_question_id?: string;
  conditional_answer?: string;
}

export interface AnswerOptionQuestion {
  id: string;
  answer_option_id: string;
  question_id: string;
}


