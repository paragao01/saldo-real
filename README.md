# Saldo Real - Controle de Gastos Pessoais

Aplicação web completa para controle financeiro pessoal com dashboard, lançamentos, categorias e calculadora financeira.

## 🚀 Tecnologias

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- Recharts (gráficos)
- Tailwind CSS (via CDN)

## 📋 Pré-requisitos

- Java 17+
- Maven 3.6+
- Node.js 18+
- PostgreSQL 12+

## 🔧 Configuração

### Backend

1. Configure o banco de dados PostgreSQL:
```sql
CREATE DATABASE saldo_real;
```

2. Configure as credenciais no arquivo `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/saldo_real
    username: seu_usuario
    password: sua_senha
```

3. Configure a chave JWT (recomendado usar variável de ambiente):
```yaml
spring:
  security:
    jwt:
      secret: sua-chave-secreta-aqui
```

4. Compile e execute:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080/api`

### Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 📚 Funcionalidades

### ✅ Implementadas

- **Autenticação**
  - Cadastro de usuário
  - Login com JWT
  - Logout
  - Proteção de rotas

- **Dashboard**
  - Total gasto no mês atual
  - Comparação com mês anterior
  - Gráfico de gastos por categoria (pizza)
  - Gráfico de gastos por período (barras)

- **Lançamentos**
  - Cadastro manual de despesas
  - Edição e exclusão
  - Filtros avançados (período, categoria, valor, forma de pagamento)
  - Listagem paginada
  - Totalizador dinâmico
  - Suporte a código de barras
  - Despesas recorrentes

- **Categorias**
  - Cadastro e edição
  - Limite mensal
  - Cor e ícone

- **Calculadora Financeira**
  - Cálculo de valor futuro
  - Gráfico de evolução
  - Salvar projeções

## 🗄️ Estrutura do Banco de Dados

As tabelas são criadas automaticamente pelo Hibernate com os seguintes nomes em português:

- `usuarios` - Usuários do sistema
- `categorias` - Categorias de despesas
- `despesas` - Lançamentos de despesas
- `projecoes_financeiras` - Projeções financeiras

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login

### Dashboard
- `GET /api/dashboard` - Dados do dashboard

### Despesas
- `GET /api/expenses` - Listar despesas
- `POST /api/expenses` - Criar despesa
- `PUT /api/expenses/{id}` - Atualizar despesa
- `DELETE /api/expenses/{id}` - Excluir despesa
- `GET /api/expenses/total` - Total filtrado

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/{id}` - Atualizar categoria
- `DELETE /api/categories/{id}` - Excluir categoria

### Projeções
- `GET /api/projections` - Listar projeções
- `POST /api/projections` - Criar projeção
- `POST /api/projections/calculate` - Calcular projeção
- `DELETE /api/projections/{id}` - Excluir projeção

## 🔐 Segurança

- Autenticação JWT
- Senhas criptografadas com BCrypt
- Proteção de rotas no frontend e backend
- Validação de dados com Bean Validation

## 🎨 Interface

- Design moderno e responsivo
- Componentes reutilizáveis
- Feedback visual (loading, erros, sucessos)
- Navegação intuitiva

## 📦 Build para Produção

### Backend
```bash
cd backend
mvn clean package
java -jar target/saldo-real-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
```

Os arquivos estarão em `frontend/dist`

## 🚧 Evoluções Futuras

- OCR para leitura de boletos
- Scanner de código de barras por câmera
- Integração Open Finance
- Metas financeiras
- Notificações
- Exportação de relatórios

## 📄 Licença

Este projeto é de uso pessoal/educacional.

