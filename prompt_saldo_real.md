
# Prompt para Geração de Aplicação Web – Controle de Gastos Pessoais

Você é um **engenheiro de software sênior** e deve gerar uma **aplicação web completa** para controle de gastos pessoais mensais, seguindo rigorosamente os requisitos abaixo.

---

## 1. Objetivo da Aplicação

Criar uma aplicação web moderna para controle financeiro pessoal, permitindo:
- Cadastro e análise de gastos mensais
- Visualização de dados financeiros em dashboard
- Projeções financeiras
- Evolução futura para multiusuário


---

## 2. Autenticação e Usuários (IMPLEMENTAR)

### Funcionalidades
- Cadastro de usuário
- Login (e-mail + senha)
- Logout
- Proteção de rotas
- Associação de todos os dados ao usuário autenticado

### Requisitos Técnicos
- Spring Security
- JWT (Access Token)
- BCrypt para senha
- Interceptor HTTP no frontend

---

## 3. Escopo Funcional

### 3.1 Dashboard Financeiro
- Cards com:
  - Total gasto no mês atual
  - Comparação com mês anterior (%)
- Gráficos:
  - Gastos por categoria (pizza)
  - Gastos por período (barras ou linha)
- Atualização automática ao inserir/editar lançamentos

---

### 3.2 Cadastro de Lançamentos (Despesas)

#### Formas de Entrada
- Manual:
  - Data
  - Descrição
  - Categoria
  - Valor
  - Forma de pagamento
  - Observações
- Código de barras:
  - Digitação manual do código
- Upload (estrutura preparada):
  - PDF / Imagem (OCR planejado, não obrigatório no MVP)

#### Regras
- Validações de campos
- Possibilidade de edição e exclusão
- Despesas recorrentes (flag)

---

### 3.3 Pesquisa e Filtros
- Filtros:
  - Período
  - Categoria
  - Faixa de valor
  - Forma de pagamento
- Listagem paginada
- Ordenação por data e valor
- Totalizador dinâmico dos resultados
- Exportação futura (preparar estrutura)

---

### 3.4 Calculadora Financeira
- Entradas:
  - Valor inicial
  - Aporte mensal
  - Taxa de juros (%)
  - Período (meses)
- Saídas:
  - Valor futuro
  - Total investido
  - Juros acumulados
- Gráfico de evolução do valor

---

### 3.5 Categorias
- Cadastro e edição de categorias
- Definição de limite mensal
- Cor e ícone associados

---

## 4. UX / Navegação

### Estrutura de Telas
- Dashboard
- Lançamentos
  - Novo Lançamento
  - Lista / Pesquisa
- Calculadora Financeira
- Categorias
- Configurações

### Requisitos Visuais
- Layout moderno e profissional
- Responsivo (desktop, tablet, mobile)
- Componentes reutilizáveis
- Feedback visual (loading, erro, sucesso)

---

## 5. Arquitetura Técnica

### 5.1 Frontend
- SPA moderna
- React + TypeScript
- Componentização forte
- Gerenciamento de estado
- Biblioteca de gráficos

### 5.2 Backend
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- OpenAPI (Swagger)
- Clean Architecture

### 5.3 Banco de Dados
- PostgreSQL

#### Entidades
- Expense
- Category
- FinancialProjection
- User (planejado, não ativo)

---

## 6. Modelagem de Dados (Resumo)

### Expense
- id
- date
- description
- category_id
- amount
- payment_method
- barcode (opcional)
- recurring
- created_at

### Category
- id
- name
- monthly_limit
- color
- icon

### FinancialProjection
- id
- initial_value
- monthly_contribution
- interest_rate
- period
- future_value

---

## 7. Requisitos Não Funcionais
- Código limpo e organizado
- Separação clara de camadas
- Preparado para testes
- Tratamento de erros e logs
- Escalável para futuras integrações

---

## 8. Evoluções Futuras (Não implementar agora)
- Autenticação (Login/Senha, OAuth)
- OCR para leitura de boletos
- Scanner de código de barras por câmera
- Integração Open Finance
- Metas financeiras
- Notificações

---

## 9. Resultado Esperado

Gerar:
- Frontend funcional e moderno
- Backend estruturado com APIs REST
- Banco de dados modelado
- Aplicação pronta para evolução

⚠️ Priorize **clareza, organização e qualidade de código**.
