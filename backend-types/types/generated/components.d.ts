import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAnswer extends Struct.ComponentSchema {
  collectionName: 'components_shared_answers';
  info: {
    description: '';
    displayName: 'Answer Option';
    icon: 'star';
  };
  attributes: {
    identifier: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface SharedCustomStringArray extends Struct.ComponentSchema {
  collectionName: 'components_shared_custom_string_arrays';
  info: {
    displayName: 'Custom String Array';
    icon: 'dashboard';
  };
  attributes: {
    value: Schema.Attribute.String;
  };
}

export interface SharedEvaluationCorrectAnswer extends Struct.ComponentSchema {
  collectionName: 'components_shared_evaluation_correct_answers';
  info: {
    description: '';
    displayName: 'Correct Answer';
    icon: 'check';
  };
  attributes: {
    answerIdentifier: Schema.Attribute.String;
    questionIdentifier: Schema.Attribute.String;
  };
}

export interface SharedQuestion extends Struct.ComponentSchema {
  collectionName: 'components_shared_questions';
  info: {
    description: '';
    displayName: 'Question';
    icon: 'bulletList';
  };
  attributes: {
    answerOptions: Schema.Attribute.Component<'shared.answer', true>;
    description: Schema.Attribute.Text;
    identifier: Schema.Attribute.String;
    label: Schema.Attribute.String;
    photo: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedUserAnswer extends Struct.ComponentSchema {
  collectionName: 'components_shared_user_answers';
  info: {
    description: '';
    displayName: 'Answer Option Selected';
    icon: 'book';
  };
  attributes: {
    answerIdentifier: Schema.Attribute.String;
    isRightAnswer: Schema.Attribute.Boolean;
    questionIdentifier: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.answer': SharedAnswer;
      'shared.custom-string-array': SharedCustomStringArray;
      'shared.evaluation-correct-answer': SharedEvaluationCorrectAnswer;
      'shared.question': SharedQuestion;
      'shared.user-answer': SharedUserAnswer;
    }
  }
}
