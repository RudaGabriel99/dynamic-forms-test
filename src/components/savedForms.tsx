'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormStore } from "@/lib/store";
import { Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";

export function SavedForms() {
    const { forms, deleteForm } = useFormStore();

    if (forms.length === 0) {
        return (
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-xl">Sem formulários criados</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                    Crie seu primeiro formulário para começar. Seus formulários aparecerão aqui após serem salvos.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Formulários salvos</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => (
                    <Card key={form.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{form.title}</CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {form.description || "Sem descrição"}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="ml-2">
                                    Ordem: {form.order}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    ID: {form.id.slice(0, 8)}...
                                </div>

                                <div className="flex gap-2">

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            if (confirm('Tem certeza de que deseja excluir este formulário?')) {
                                                deleteForm(form.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Deletar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 