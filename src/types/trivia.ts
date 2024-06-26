export interface ITriviaQuestion {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: string;
  tags: string[];
  type: string;
  difficulty: string;
  regions: any[];
  isNiche: boolean;
  shuffledQuestions?: string[] | undefined;
  isCorrect?: boolean | undefined;
}
