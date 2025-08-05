'use client'

import { FormPreview } from "@/components/formPreview";
import { QuestionEditor } from "@/components/questionEditor";
import { SavedForms } from "@/components/savedForms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFormBuilder } from "@/lib/useFormBuillder";
import { useState } from "react";

export default function Home() {
  const {
    form,
    questions,
    answerOptions,
    createForm,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addAnswerOption,
    removeAnswerOption,
    updateAnswerOption,
    saveForm
  } = useFormBuilder();

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formOrder, setFormOrder] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCreateForm = () => {
    if (!formTitle.trim()) {
      alert("Por favor, insira um título para o formulário");
      return;
    }

    createForm(formTitle, formDescription, formOrder);
    setShowCreateForm(false);
    setFormTitle("");
    setFormDescription("");
    setFormOrder(1);
  };

  const handleSaveForm = () => {
    if (!form) {
      alert("Create a form first");
      return;
    }

    if (questions.length === 0) {
      alert("Add at least one question to the form");
      return;
    }

    saveForm();
    setShowCreateForm(false);
  };

  const handleStartNewForm = () => {
    setShowCreateForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Desafio técnico - Frontend</h1>
        </div>

        <SavedForms />

        <div className="mt-8">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Criar novo formulário</CardTitle>
                <Button
                  onClick={handleStartNewForm}
                  disabled={showCreateForm}
                  variant="outline"
                >
                  + Criar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Clique para começar a criar um novo formulário dinâmico.
              </p>
            </CardContent>
          </Card>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Novo formulário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título do formulário *</label>
                    <Input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Insira o título do seu formulário"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ordem do formulário</label>
                    <Input
                      type="number"
                      value={formOrder}
                      onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
                      placeholder="1"
                      min="1"
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Input
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Insira uma descrição para o formulário"
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateForm}
                    disabled={!formTitle.trim()}
                  >
                    Criar formulário
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {form && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Titulo:</strong> {form.title}</p>
                  <p><strong>Descrição:</strong> {form.description || "Sem descrição"}</p>
                  <p><strong>Ordem:</strong> {form.order}</p>
                </div>
              </CardContent>
            </Card>

            {showPreview ? (
              <FormPreview
                form={form}
                questions={questions}
                answerOptions={answerOptions}
              />
            ) : (
              <div className="space-y-6">
                {questions.map((question) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    onChange={(updated) => updateQuestion(question.id, updated)}
                    onDelete={() => removeQuestion(question.id)}
                    answerOptions={answerOptions}
                    onAddOption={addAnswerOption}
                    onRemoveOption={removeAnswerOption}
                    onUpdateOption={updateAnswerOption}
                    allQuestions={questions}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 space-y-4">
              {!showPreview && (
                <Button
                  onClick={() =>
                    addQuestion({
                      title: "",
                      question_type: "free_text",
                      order: questions.length,
                    })
                  }
                  className="w-full"
                  size="lg"
                >
                  + Adicionar questão
                </Button>
              )}

              <div className="flex gap-4">
                <Button
                  variant={showPreview ? "outline" : "default"}
                  className="flex-1"
                  size="lg"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={questions.length === 0}
                >
                  {showPreview ? "Voltar ao Editor" : "Visualizar Formulário"}
                </Button>

                {!showPreview && (
                  <Button
                    variant="default"
                    className="flex-1"
                    size="lg"
                    onClick={handleSaveForm}
                    disabled={questions.length === 0}
                  >
                    Salvar formulário
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  onClick={() => {
                    if (confirm("Tem certeza de que deseja cancelar? Todas as alterações serão perdidas.")) {
                      setShowCreateForm(false);
                      setShowPreview(false);
                    }
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
