'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form } from "@/types/forms"
import { AnswerOption, Question } from "@/types/questions"
import { useState } from "react"

interface FormPreviewProps {
    form: Form
    questions: Question[]
    answerOptions: AnswerOption[]
}

export function FormPreview({ form, questions, answerOptions }: FormPreviewProps) {
    const [responses, setResponses] = useState<Record<string, string | string[]>>({})
    const [visibleQuestions, setVisibleQuestions] = useState<Set<string>>(new Set())


    const shouldShowQuestion = (question: Question): boolean => {
        if (!question.conditional_question_id) return true

        const conditionalResponse = responses[question.conditional_question_id]
        if (!conditionalResponse) return false

        const responseValue = Array.isArray(conditionalResponse)
            ? conditionalResponse.join(', ')
            : conditionalResponse

        switch (question.conditional_operator) {
            case 'equals':
                return responseValue === question.conditional_answer
            case 'contains':
                return responseValue.includes(question.conditional_answer || '')
            case 'not_equals':
                return responseValue !== question.conditional_answer
            default:
                return true
        }
    }


    const updateResponse = (questionId: string, value: string | string[]) => {
        const newResponses = { ...responses, [questionId]: value }
        setResponses(newResponses)

        const newVisibleQuestions = new Set<string>()
        questions.forEach(question => {
            if (shouldShowQuestion(question)) {
                newVisibleQuestions.add(question.id)
            }
        })
        setVisibleQuestions(newVisibleQuestions)
    }


    const renderAnswerOptions = (question: Question) => {
        const options = answerOptions.filter(opt => opt.question_id === question.id)

        if (question.question_type === 'yes_no') {
            return (
                <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={question.id}
                            value="sim"
                            checked={responses[question.id] === 'sim'}
                            onChange={(e) => updateResponse(question.id, e.target.value)}
                            className="text-blue-600"
                        />
                        <span>Sim</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name={question.id}
                            value="não"
                            checked={responses[question.id] === 'não'}
                            onChange={(e) => updateResponse(question.id, e.target.value)}
                            className="text-blue-600"
                        />
                        <span>Não</span>
                    </label>
                </div>
            )
        }

        if (question.question_type === 'single_choice') {
            return (
                <div className="space-y-2">
                    {options.map((option) => (
                        <label key={option.id} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name={question.id}
                                value={option.answer}
                                checked={responses[question.id] === option.answer}
                                onChange={(e) => updateResponse(question.id, e.target.value)}
                                className="text-blue-600"
                            />
                            <span>{option.answer}</span>
                        </label>
                    ))}
                </div>
            )
        }

        if (question.question_type === 'multiple_choice') {
            const currentResponses = (responses[question.id] as string[]) || []
            return (
                <div className="space-y-2">
                    {options.map((option) => (
                        <label key={option.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={option.answer}
                                checked={currentResponses.includes(option.answer)}
                                onChange={(e) => {
                                    const newResponses = e.target.checked
                                        ? [...currentResponses, option.answer]
                                        : currentResponses.filter(r => r !== option.answer)
                                    updateResponse(question.id, newResponses)
                                }}
                                className="text-blue-600"
                            />
                            <span>{option.answer}</span>
                        </label>
                    ))}
                </div>
            )
        }

        if (question.question_type === 'integer' || question.question_type === 'decimal') {
            return (
                <Input
                    type="number"
                    step={question.question_type === 'decimal' ? '0.01' : '1'}
                    value={responses[question.id] as string || ''}
                    onChange={(e) => updateResponse(question.id, e.target.value)}
                    placeholder={`Digite um ${question.question_type === 'decimal' ? 'número decimal' : 'número inteiro'}`}
                />
            )
        }

        return (
            <Input
                type="text"
                value={responses[question.id] as string || ''}
                onChange={(e) => updateResponse(question.id, e.target.value)}
                placeholder="Digite sua resposta"
            />
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">{form.title}</CardTitle>
                {form.description && (
                    <p className="text-gray-600">{form.description}</p>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {questions
                    .sort((a, b) => a.order - b.order)
                    .map((question) => {
                        const isVisible = shouldShowQuestion(question)

                        return (
                            <div
                                key={question.id}
                                className={`p-4 border rounded-lg transition-all duration-300 ${isVisible
                                    ? 'border-gray-200 bg-white'
                                    : 'border-gray-100 bg-gray-50 opacity-50'
                                    }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                Questão {question.order + 1}: {question.title}
                                                {question.required && <span className="text-red-500 ml-1">*</span>}
                                            </h3>
                                            {question.answer_orientation && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {question.answer_orientation}
                                                </p>
                                            )}
                                        </div>
                                        {question.conditional_question_id && (
                                            <div className="ml-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Condicional
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {isVisible ? (
                                        <div className="mt-3">
                                            {renderAnswerOptions(question)}
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-sm text-gray-500 italic">
                                            Esta pergunta aparecerá quando as condições forem atendidas
                                        </div>
                                    )}

                                    {question.conditional_question_id && (
                                        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                                            <strong>Condição:</strong> Só aparece quando a resposta da Questão {
                                                questions.find(q => q.id === question.conditional_question_id)?.order || 0
                                            } + 1 {question.conditional_operator === "equals" ? "for igual a" : question.conditional_operator === "contains" ? "contiver" : "for diferente de"} "{question.conditional_answer}";
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
            </CardContent>
        </Card>
    )
} 