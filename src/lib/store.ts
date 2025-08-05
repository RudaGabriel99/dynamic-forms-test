import { Form } from '@/types/forms';
import { AnswerOption, AnswerOptionQuestion, Question } from '@/types/questions';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FormStore {

    forms: Form[];
    currentForm: Form | null;
    currentQuestions: Question[];
    currentAnswerOptions: AnswerOption[];
    currentAnswerOptionQuestions: AnswerOptionQuestion[];


    addForm: (form: Form) => void;
    updateForm: (id: string, form: Form) => void;
    deleteForm: (id: string) => void;
    setCurrentForm: (form: Form | null) => void;


    addQuestion: (question: Question) => void;
    updateQuestion: (id: string, question: Question) => void;
    deleteQuestion: (id: string) => void;
    setCurrentQuestions: (questions: Question[]) => void;


    addAnswerOption: (option: AnswerOption) => void;
    updateAnswerOption: (id: string, option: AnswerOption) => void;
    deleteAnswerOption: (id: string) => void;
    setCurrentAnswerOptions: (options: AnswerOption[]) => void;


    addAnswerOptionQuestion: (relation: AnswerOptionQuestion) => void;
    deleteAnswerOptionQuestion: (id: string) => void;
    setCurrentAnswerOptionQuestions: (relations: AnswerOptionQuestion[]) => void;


    resetCurrentForm: () => void;
    clearAll: () => void;
}

export const useFormStore = create<FormStore>()(
    persist(
        (set, get) => ({

            forms: [],
            currentForm: null,
            currentQuestions: [],
            currentAnswerOptions: [],
            currentAnswerOptionQuestions: [],


            addForm: (form: Form) => {
                set((state) => ({
                    forms: [...state.forms, form]
                }));
            },

            updateForm: (id: string, form: Form) => {
                set((state) => ({
                    forms: state.forms.map(f => f.id === id ? form : f)
                }));
            },

            deleteForm: (id: string) => {
                set((state) => ({
                    forms: state.forms.filter(f => f.id !== id)
                }));
            },

            setCurrentForm: (form: Form | null) => {
                set({ currentForm: form });
            },


            addQuestion: (question: Question) => {
                set((state) => ({
                    currentQuestions: [...state.currentQuestions, question]
                }));
            },

            updateQuestion: (id: string, question: Question) => {
                set((state) => ({
                    currentQuestions: state.currentQuestions.map(q => q.id === id ? question : q)
                }));
            },

            deleteQuestion: (id: string) => {
                set((state) => ({
                    currentQuestions: state.currentQuestions.filter(q => q.id !== id),
                    currentAnswerOptions: state.currentAnswerOptions.filter(o => o.question_id !== id),
                    currentAnswerOptionQuestions: state.currentAnswerOptionQuestions.filter(r => {
                        const option = state.currentAnswerOptions.find(o => o.id === r.answer_option_id);
                        return option && option.question_id !== id;
                    })
                }));
            },

            setCurrentQuestions: (questions: Question[]) => {
                set({ currentQuestions: questions });
            },


            addAnswerOption: (option: AnswerOption) => {
                set((state) => ({
                    currentAnswerOptions: [...state.currentAnswerOptions, option]
                }));
            },

            updateAnswerOption: (id: string, option: AnswerOption) => {
                set((state) => ({
                    currentAnswerOptions: state.currentAnswerOptions.map(o => o.id === id ? option : o)
                }));
            },

            deleteAnswerOption: (id: string) => {
                set((state) => ({
                    currentAnswerOptions: state.currentAnswerOptions.filter(o => o.id !== id),
                    currentAnswerOptionQuestions: state.currentAnswerOptionQuestions.filter(r => r.answer_option_id !== id)
                }));
            },

            setCurrentAnswerOptions: (options: AnswerOption[]) => {
                set({ currentAnswerOptions: options });
            },


            addAnswerOptionQuestion: (relation: AnswerOptionQuestion) => {
                set((state) => ({
                    currentAnswerOptionQuestions: [...state.currentAnswerOptionQuestions, relation]
                }));
            },

            deleteAnswerOptionQuestion: (id: string) => {
                set((state) => ({
                    currentAnswerOptionQuestions: state.currentAnswerOptionQuestions.filter(r => r.id !== id)
                }));
            },

            setCurrentAnswerOptionQuestions: (relations: AnswerOptionQuestion[]) => {
                set({ currentAnswerOptionQuestions: relations });
            },


            resetCurrentForm: () => {
                set({
                    currentForm: null,
                    currentQuestions: [],
                    currentAnswerOptions: [],
                    currentAnswerOptionQuestions: []
                });
            },

            clearAll: () => {
                set({
                    forms: [],
                    currentForm: null,
                    currentQuestions: [],
                    currentAnswerOptions: [],
                    currentAnswerOptionQuestions: []
                });
            }
        }),
        {
            name: 'form-store',
            partialize: (state) => ({ forms: state.forms })
        }
    )
); 