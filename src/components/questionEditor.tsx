'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AnswerOption, Question, QuestionType } from "@/types/questions"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const QUESTION_TYPES: { label: string, value: QuestionType }[] = [
    { label: "Texto livre", value: "free_text" },
    { label: "Sim ou não", value: "yes_no" },
    { label: "Múltipla opção", value: "multiple_choice" },
    { label: "Opção única", value: "single_choice" },
    { label: "Número inteiro", value: "integer" },
    { label: "Número decimal", value: "decimal" }
]

const CONDITIONAL_OPERATORS: { label: string, value: 'equals' | 'contains' | 'not_equals' }[] = [
    { label: "Igual a", value: "equals" },
    { label: "Contém", value: "contains" },
    { label: "Diferente de", value: "not_equals" }
]

interface Props {
    question: Question;
    onChange: (updated: Question) => void;
    onDelete: () => void;
    answerOptions: AnswerOption[];
    onAddOption: (questionId: string, option: Partial<AnswerOption>) => void;
    onRemoveOption: (optionId: string) => void;
    onUpdateOption: (optionId: string, updatedOption: Partial<AnswerOption>) => void;
    allQuestions?: Question[];
}

export function QuestionEditor({
    question,
    onChange,
    onDelete,
    answerOptions,
    onAddOption,
    onRemoveOption,
    onUpdateOption,
    allQuestions = []
}: Props) {
    const updateField = <K extends keyof Question>(key: K, value: Question[K]) => {
        onChange({ ...question, [key]: value });
    }

    const addOption = () => {
        const newOption: Partial<AnswerOption> = {
            answer: "",
            order: answerOptions.filter(op => op.question_id === question.id).length + 1,
            open_answer: false,
        };

        onAddOption(question.id, newOption);
    }

    const removeOption = (optionId: string) => {
        onRemoveOption(optionId);
    }

    const updateOption = (optionId: string, field: keyof AnswerOption, value: string | boolean) => {
        onUpdateOption(optionId, { [field]: value });
    }

    const questionOptions = answerOptions.filter(op => op.question_id === question.id);


    const availableConditionalQuestions = allQuestions.filter(q =>
        q.id !== question.id && q.order < question.order
    );

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold mb-4">Questão {question.order + 1}</CardTitle>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Título da questão</label>
                        <Input
                            value={question.title}
                            onChange={(e) => updateField("title", e.target.value)}
                            placeholder="Digite o título da pergunta"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Orientação de resposta</label>
                        <Input
                            value={question.answer_orientation}
                            onChange={(e) => updateField("answer_orientation", e.target.value)}
                            placeholder="Insira as instruções para a resposta"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Ordem</label>
                            <Input
                                type="number"
                                value={question.order}
                                onChange={(e) => updateField("order", parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Código (opcional)</label>
                            <Input
                                value={question.code || ""}
                                onChange={(e) => updateField("code", e.target.value)}
                                placeholder="Digite um código para a pergunta"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Tipo de pergunta</label>
                        <Select
                            value={question.question_type}
                            onValueChange={(val: QuestionType) => updateField("question_type", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {QUESTION_TYPES.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={question.required}
                            onCheckedChange={(val) => updateField("required", val)}
                        />
                        <span className="text-sm">Pergunta obrigatória</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={question.sub_question}
                            onCheckedChange={(val) => updateField("sub_question", val)}
                        />
                        <span className="text-sm">Sub-pergunta</span>
                    </div>

                    {question.sub_question && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <label className="block text-sm font-medium mb-2 text-blue-900">
                                Pergunta adicional para sub-pergunta
                            </label>
                            <Input
                                value={question.additional_question || ""}
                                onChange={(e) => updateField("additional_question", e.target.value)}
                                placeholder="Digite a pergunta adicional que aparecerá quando esta sub-pergunta for selecionada"
                                className="border-blue-300 focus:border-blue-500"
                            />
                            <p className="text-xs text-blue-700 mt-1">
                                Esta pergunta adicional será exibida quando selecionada esta opção
                            </p>
                        </div>
                    )}

                    {/* Seção de Condicionalidade */}
                    {availableConditionalQuestions.length > 0 && (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h4 className="text-sm font-medium text-yellow-900 mb-3">
                                Configuração de Condicionalidade
                            </h4>
                            <p className="text-xs text-yellow-700 mb-3">
                                Configure se esta pergunta deve aparecer apenas quando uma pergunta anterior for respondida de forma específica
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-yellow-900">
                                        Pergunta condicionante
                                    </label>
                                    <Select
                                        value={question.conditional_question_id || "none"}
                                        onValueChange={(val) => updateField("conditional_question_id", val === "none" ? undefined : val)}
                                    >
                                        <SelectTrigger className="border-yellow-300">
                                            <SelectValue placeholder="Selecione uma pergunta anterior" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhuma (sempre exibir)</SelectItem>
                                            {availableConditionalQuestions.map((q) => (
                                                <SelectItem key={q.id} value={q.id}>
                                                    Questão {q.order + 1}: {q.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {question.conditional_question_id && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-yellow-900">
                                                Operador de condição
                                            </label>
                                            <Select
                                                value={question.conditional_operator || "equals"}
                                                onValueChange={(val: 'equals' | 'contains' | 'not_equals') =>
                                                    updateField("conditional_operator", val)
                                                }
                                            >
                                                <SelectTrigger className="border-yellow-300">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {CONDITIONAL_OPERATORS.map((op) => (
                                                        <SelectItem key={op.value} value={op.value}>
                                                            {op.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-yellow-900">
                                                Resposta esperada
                                            </label>
                                            <Input
                                                value={question.conditional_answer || ""}
                                                onChange={(e) => updateField("conditional_answer", e.target.value)}
                                                placeholder="Digite a resposta que deve ativar esta pergunta"
                                                className="border-yellow-300 focus:border-yellow-500"
                                            />
                                            <p className="text-xs text-yellow-600 mt-1">
                                                Esta pergunta só aparecerá quando a resposta da pergunta condicionante {question.conditional_operator === "equals" ? "for igual a" : question.conditional_operator === "contains" ? "contiver" : "for diferente de"} "{question.conditional_answer}"
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {(question.question_type === 'multiple_choice' || question.question_type === 'single_choice') && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Opções de resposta</label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addOption}
                            >
                                + Adicionar opção
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {questionOptions.map((option, index) => (
                                <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <Input
                                            placeholder={`Opção ${index + 1}`}
                                            value={option.answer}
                                            onChange={(e) => updateOption(option.id, 'answer', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={option.open_answer}
                                            onCheckedChange={(val) => updateOption(option.id, 'open_answer', val)}
                                        />
                                        <span className="text-xs text-gray-600">Resposta aberta</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeOption(option.id)}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Button
                    variant="destructive"
                    onClick={onDelete}
                    className="w-full"
                >
                    Deletar Questão
                </Button>
            </CardContent>
        </Card>
    )
}
