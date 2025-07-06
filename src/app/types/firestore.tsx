// ---------- Question Types ----------
export type Question =
    | FreeResponseQuestion
    | TrueFalseQuestion
    | MultipleChoiceQuestion
    | MultipleChoiceMultipleQuestion
    | MatchingQuestion;

interface BaseQuestion {
    prompt: string;
}

export interface FreeResponseQuestion extends BaseQuestion {
    type: "free_response";
    correctAnswer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
    type: "true_false";
    correctAnswer: boolean;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: "multiple_choice";
    options: string[];
    correctAnswer: string;
}

export interface MultipleChoiceMultipleQuestion extends BaseQuestion {
    type: "multiple_choice_multiple";
    options: string[];
    correctAnswer: string[];
}

export interface MatchingPair {
    left: string;
    right: string;
}

export interface MatchingQuestion extends BaseQuestion {
    type: "matching";
    pairs: MatchingPair[];
    correctAnswer: Record<string, string>;
}

// ---------- User ----------
export interface User {
    name: string;
    email: string;
}