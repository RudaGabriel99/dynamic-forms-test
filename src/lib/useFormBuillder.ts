'use client'

import { Form } from '@/types/forms';
import { AnswerOption, AnswerOptionQuestion, Question } from '@/types/questions';
import { v4 as uuidv4 } from 'uuid';
import { useFormStore } from './store';

export function useFormBuilder() {
    const {
        currentForm,
        currentQuestions,
        currentAnswerOptions,
        currentAnswerOptionQuestions,
        addForm,
        setCurrentForm,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        addAnswerOption,
        updateAnswerOption,
        deleteAnswerOption,
        addAnswerOptionQuestion,
        resetCurrentForm
    } = useFormStore();

    function createForm(title: string, description: string, order: number) {
        const newForm: Form = {
            id: uuidv4(),
            title,
            description,
            order,
        };
        setCurrentForm(newForm);
        return newForm;
    }

    function addNewQuestion(newQuestion: Partial<Question>) {
        if (!currentForm) return;

        const question: Question = {
            id: uuidv4(),
            form_id: currentForm.id,
            title: newQuestion.title || '',
            code: newQuestion.code,
            answer_orientation: newQuestion.answer_orientation || '',
            order: newQuestion.order || currentQuestions.length,
            required: newQuestion.required ?? false,
            sub_question: newQuestion.sub_question ?? false,
            question_type: newQuestion.question_type || 'free_text',
            additional_question: newQuestion.additional_question,
            conditional_question_id: newQuestion.conditional_question_id,
            conditional_answer: newQuestion.conditional_answer,
            conditional_operator: newQuestion.conditional_operator,
        };
        addQuestion(question);
    }

    function removeQuestionFromCurrent(id: string) {
        deleteQuestion(id);
    }

    function updateCurrentQuestion(id: string, updatedQuestion: Question) {
        updateQuestion(id, updatedQuestion);
    }

    function addAnswerOptionToCurrent(questionId: string, option: Partial<AnswerOption>) {
        const newOption: AnswerOption = {
            id: uuidv4(),
            question_id: questionId,
            answer: option.answer || '',
            order: option.order || 0,
            open_answer: option.open_answer || false,
            conditional_question_id: option.conditional_question_id,
            conditional_answer: option.conditional_answer,
        };

        addAnswerOption(newOption);

        const newRelation: AnswerOptionQuestion = {
            id: uuidv4(),
            answer_option_id: newOption.id,
            question_id: questionId,
        };
        addAnswerOptionQuestion(newRelation);
    }

    function removeAnswerOptionFromCurrent(optionId: string) {
        deleteAnswerOption(optionId);
    }

    function updateAnswerOptionInCurrent(optionId: string, updatedOption: Partial<AnswerOption>) {
        const currentOption = currentAnswerOptions.find(o => o.id === optionId);
        if (currentOption) {
            updateAnswerOption(optionId, { ...currentOption, ...updatedOption });
        }
    }

    function getOptionsByQuestion(questionId: string): AnswerOption[] {
        return currentAnswerOptions.filter((op) => op.question_id === questionId);
    }

    function saveCurrentForm() {
        if (!currentForm) {
            console.error('No form created');
            return;
        }

        const completeForm = {
            id: currentForm.id,
            title: currentForm.title,
            description: currentForm.description,
            order: currentForm.order,
            questions: currentQuestions.map(question => ({
                id: question.id,
                title: question.title,
                code: question.code,
                answer_orientation: question.answer_orientation,
                order: question.order,
                required: question.required,
                sub_question: question.sub_question,
                question_type: question.question_type,
                additional_question: question.additional_question,
                conditional_question_id: question.conditional_question_id,
                conditional_answer: question.conditional_answer,
                conditional_operator: question.conditional_operator,
                answer_options: currentAnswerOptions
                    .filter(option => option.question_id === question.id)
                    .map(option => ({
                        id: option.id,
                        answer: option.answer,
                        order: option.order,
                        open_answer: option.open_answer,
                        conditional_question_id: option.conditional_question_id,
                        conditional_answer: option.conditional_answer,
                    }))
            }))
        };

        console.log('Formulário gerado');
        console.log(JSON.stringify(completeForm, null, 2));

        addForm(currentForm);

        resetCurrentForm();

        return completeForm;
    }

    return {
        form: currentForm,
        questions: currentQuestions,
        answerOptions: currentAnswerOptions,
        answerOptionQuestions: currentAnswerOptionQuestions,
        createForm,
        addQuestion: addNewQuestion,
        removeQuestion: removeQuestionFromCurrent,
        updateQuestion: updateCurrentQuestion,
        addAnswerOption: addAnswerOptionToCurrent,
        removeAnswerOption: removeAnswerOptionFromCurrent,
        updateAnswerOption: updateAnswerOptionInCurrent,
        getOptionsByQuestion,
        saveForm: saveCurrentForm,
        resetForm: resetCurrentForm,
    };
}
