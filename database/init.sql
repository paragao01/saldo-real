-- Script de inicialização do banco de dados
-- Execute este script no PostgreSQL para criar o banco de dados

CREATE DATABASE saldo_real
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt_BR.UTF-8'
    LC_CTYPE = 'pt_BR.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- As tabelas serão criadas automaticamente pelo Hibernate na primeira execução
-- com base nas entidades JPA definidas no código

-- Tabelas que serão criadas:
-- - usuarios (id, email, senha, nome, criado_em)
-- - categorias (id, nome, limite_mensal, cor, icone, usuario_id)
-- - despesas (id, data, descricao, categoria_id, valor, forma_pagamento, codigo_barras, recorrente, observacoes, usuario_id, criado_em)
-- - projecoes_financeiras (id, valor_inicial, aporte_mensal, taxa_juros, periodo, valor_futuro, usuario_id, criado_em)

