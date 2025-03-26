import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { QuestionCardView } from "@/types/dashboard/evaluations";

export function EvaluationQuestion(QuestionProps: QuestionCardView) {
  const questionId = QuestionProps.identifier;
  
  const renderFeedback = () => {
    if (QuestionProps.isCorrect === undefined) return null;
    
    const isCorrect = QuestionProps.isCorrect;
    
    return (
      <div className={`mt-3 p-3 rounded-md ${
        isCorrect ? "bg-green-50 border-green-200 border" : "bg-red-50 border-red-200 border"
      }`}>
        <div className="flex items-start gap-2">
          {isCorrect ? 
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" /> : 
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          }
          <div>
            <p className={`font-medium ${isCorrect ? "text-green-700" : "text-red-700"}`}>
              {isCorrect ? "Respuesta correcta" : "Respuesta incorrecta"}
            </p>

            {isCorrect && (
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-medium">Puntos obtenidos: 5</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render the photo if available
  const renderPhoto = () => {
    if (!QuestionProps.photoUrl) return null;
    
    return (
      <div className="mb-4">
        <img 
          src={`https://api.omioaxaca.org${QuestionProps.photoUrl}`} 
          alt={`Imagen para la pregunta ${QuestionProps.identifier}`}
          className="max-w-full h-auto max-h-[320px] rounded-lg shadow-md object-contain"
          loading="lazy"
        />
      </div>
    );
  };
  
  switch (QuestionProps.type) {
    case 'radio_group':
      return (
        <div className="mb-6 p-4 border rounded-md">
          <div className="font-medium mb-3">
            {QuestionProps.index + 1}. {QuestionProps.label}
            {QuestionProps.required && <span className="text-red-500 ml-1">*</span>}
            <span className="text-sm text-gray-500 ml-2">5 puntos</span>
          </div>

          {QuestionProps.description && (
            <div className="mb-3">
              {QuestionProps.description}
            </div>
          )}
          
          {renderPhoto()}
          
          <RadioGroup 
            value={QuestionProps.answerSelectedIdentifier as string}
            onValueChange={(value) => QuestionProps.onAnswerChange(questionId, value)}
            disabled={QuestionProps.isReadOnly}
          >
            {QuestionProps.answerOptions?.map((answerOption: { identifier: string; label: string; }, i: number) => (
              <div 
                key={i} 
                className={`flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer ${
                  QuestionProps.answerSelectedIdentifier === answerOption.identifier ? 'bg-ooi-light-blue' : ''
                }`}
                onClick={() => !QuestionProps.isReadOnly && QuestionProps.onAnswerChange(questionId, answerOption.identifier)}
              >
                <RadioGroupItem value={answerOption.identifier} id={answerOption.identifier} />
                <Label 
                  htmlFor={answerOption.identifier}
                  className={`flex-1 cursor-pointer ${
                    QuestionProps.answerSelectedIdentifier === answerOption.identifier ? 'text-ooi-dark-blue' : ''
                  }`}
                >
                  {answerOption.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {QuestionProps.isCorrect !== undefined && renderFeedback()}
        </div>
      );
      
    case 'checkbox':
      // not implemented
      return null;
      
    case 'dropdown':
      // not implemented
      return null;
      
    case 'text':
      // not implemented
      return null;
      
    default:
      return (
        <div className="mb-6 p-4 border rounded-md">
          <p className="font-medium text-gray-500">
            Tipo de pregunta no soportado: {QuestionProps.type}
          </p>
        </div>
      );
  }
} 