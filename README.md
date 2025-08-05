# Formulários Dinâmicos - Processo Seletivo

 Este projeto foi desenvolvido como parte de um processo seletivo para demonstrar habilidades em desenvolvimento frontend com React, TypeScript e tecnologias modernas.

## Sobre o Projeto

Desenvolvi uma aplicação web completa que permite criar formulários dinâmicos com condicionalidades avançadas. A aplicação atende todos os requisitos solicitados e vai além, implementando funcionalidades extras que demonstram conhecimento técnico e atenção aos detalhes.

### Funcionalidades Implementadas

- **Criação de formulários dinâmicos** com interface intuitiva
- **Sistema de condicionalidades** - perguntas aparecem baseadas em respostas anteriores
- **6 tipos de pergunta** diferentes (texto livre, sim/não, múltipla escolha, etc.)
- **Preview em tempo real** do formulário funcionando
- **Persistência local** com Zustand
- **Interface moderna** com Shadcn/ui e TailwindCSS
- **Tipagem completa** com TypeScript

## Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior confiabilidade
- **TailwindCSS** - Estilização moderna e responsiva
- **Shadcn/ui** - Componentes de UI elegantes e acessíveis
- **Zustand** - Gerenciamento de estado simples e eficiente

## Arquitetura do Projeto

### Estrutura de Pastas

```
src/
├── app/                    # Páginas Next.js 15
│   ├── page.tsx          # Página principal
│   └── layout.tsx        # Layout global
├── components/            # Componentes React
│   ├── questionEditor.tsx # Editor de perguntas com condicionalidades
│   ├── formPreview.tsx   # Preview do formulário funcionando
│   ├── savedForms.tsx    # Lista de formulários salvos
│   └── ui/               # Componentes Shadcn/ui
├── lib/                  # Lógica de negócio
│   ├── store.ts          # Estado global com Zustand
│   ├── useFormBuilder.ts # Hook principal da aplicação
│   └── utils.ts          # Utilitários
└── types/                # Definições TypeScript
    ├── forms.ts          # Interface Formulario
    └── questions.ts      # Interfaces Pergunta e Opções
```

### Gerenciamento de Estado

Utilizei **Zustand** para gerenciar o estado da aplicação de forma eficiente:

```typescript
// Store principal com persistência local
export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      forms: [], // Formulários salvos
      currentForm: null, // Formulário sendo editado
      currentQuestions: [], // Perguntas do formulário atual
      currentAnswerOptions: [], // Opções de resposta
      // ... métodos para manipular o estado
    }),
    {
      name: "form-store",
      partialize: (state) => ({ forms: state.forms }),
    }
  )
);
```

O estado é persistido automaticamente no localStorage, garantindo que os formulários criados não sejam perdidos ao recarregar a página.

## Interface e UX

### Design System

- **Shadcn/ui** para componentes consistentes e acessíveis
- **TailwindCSS** para estilização responsiva
- **Cores e espaçamentos** padronizados
- **Animações suaves** para melhor experiência

### Funcionalidades de UX

- **Feedback visual** para ações do usuário
- **Validações em tempo real**
- **Preview do formulário** funcionando
- **Interface responsiva** para mobile e desktop


**Operadores suportados:**

- `equals` - Igual a
- `contains` - Contém
- `not_equals` - Diferente de

### 2. Tipos de Pergunta

Implementei 6 tipos diferentes de pergunta conforme solicitado:

- **`free_text`** - Texto livre
- **`yes_no`** - Sim ou não
- **`multiple_choice`** - Múltipla escolha
- **`single_choice`** - Escolha única
- **`integer`** - Número inteiro
- **`decimal`** - Número decimal

### 3. Preview em Tempo Real

Criei um componente `FormPreview` que simula como o formulário funcionaria na prática:

- **Perguntas condicionais** aparecem/desaparecem dinamicamente
- **Feedback visual** para perguntas não visíveis
- **Validação de campos obrigatórios**
- **Interface idêntica** ao formulário final


### Persistência

Os dados são salvos no localStorage através do Zustand persist:

```typescript
{
    "forms": [
        {
            "id": "uuid-1",
            "title": "Pesquisa de Satisfação",
            "description": "Formulário para avaliar clientes",
            "order": 1
        }
    ]
}
```

## Como Executar

1. **Clone o repositório**

   ```bash
   git clone [url-do-repositorio]
   cd dynamic-forms
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**

   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📋 Como Usar

### Criando um Formulário

1. **Clique em "Criar"** para iniciar um novo formulário
2. **Preencha as informações** básicas (título, descrição, ordem)
3. **Adicione perguntas** clicando em "+ Adicionar questão"
4. **Configure cada pergunta** com tipo, obrigatoriedade e condicionalidades
5. **Use o preview** para ver como o formulário funcionará
6. **Salve o formulário** quando estiver satisfeito

### Exemplo de Condicionalidade

1. **Crie uma pergunta:** "Você tem experiência na área?"
2. **Tipo:** Sim ou não
3. **Crie uma segunda pergunta:** "Quantos anos de experiência?"
4. **Configure condicionalidade:**
   - Pergunta condicionante: Questão 1
   - Operador: Igual a
   - Resposta esperada: "sim"
5. **Resultado:** A segunda pergunta só aparecerá se a resposta for "sim"


A aplicação está pronta para uso e pode ser facilmente expandida com backend real, autenticação e funcionalidades adicionais.

---

