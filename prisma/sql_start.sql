create database patas_conectadas;
-- Script de criação de tabelas para PostgreSQL
-- Modelo baseado nas tabelas fornecidas (Animal, Voluntário, Tarefa, Doador, Doação, Evento,
-- Participação, Adotante, Adoção, Gamificação, Status_Tarefa, Status_Animal).
-- Usa GENERATED ALWAYS AS IDENTITY para chaves primárias (Postgres moderno).

BEGIN;

-- Tabelas de status (criadas primeiro para referências)
CREATE TABLE IF NOT EXISTS status_animal (
  id_status INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  status VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS status_tarefa (
  id_status INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  status VARCHAR(20) NOT NULL UNIQUE
);

-- Voluntário
CREATE TABLE IF NOT EXISTS voluntario (
  id_voluntario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE CHECK (cpf ~ '^[0-9]{11}$'),
  email VARCHAR(100) NOT NULL UNIQUE CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
  telefone VARCHAR(15) NOT NULL,
  habilidades VARCHAR(200),
  preferencias_atuacao VARCHAR(200)
);

-- Doador
CREATE TABLE IF NOT EXISTS doador (
  id_doador INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf_cnpj CHAR(14) NOT NULL UNIQUE CHECK (cpf_cnpj ~ '^[0-9]{14}$'),
  contato VARCHAR(100) NOT NULL
);

-- Adotante
CREATE TABLE IF NOT EXISTS adotante (
  id_adotante INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE CHECK (cpf ~ '^[0-9]{11}$'),
  endereco VARCHAR(200) NOT NULL,
  contato VARCHAR(100) NOT NULL
);

-- Animal
CREATE TABLE IF NOT EXISTS animal (
  id_animal INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  especie VARCHAR(10) NOT NULL CHECK (LOWER(especie) IN ('cão','gato')),
  raca VARCHAR(50),
  idade_aproximada INT,
  porte VARCHAR(10),
  data_resgate DATE NOT NULL,
  id_status INT NOT NULL REFERENCES status_animal(id_status) ON UPDATE CASCADE ON DELETE RESTRICT,
  historico_medico VARCHAR(500)
);

-- Tarefa
CREATE TABLE IF NOT EXISTS tarefa (
  id_tarefa INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  descricao VARCHAR(200) NOT NULL,
  data DATE NOT NULL,
  id_status INT NOT NULL REFERENCES status_tarefa(id_status) ON UPDATE CASCADE ON DELETE RESTRICT,
  id_voluntario INT REFERENCES voluntario(id_voluntario) ON DELETE SET NULL,
  id_animal INT REFERENCES animal(id_animal) ON DELETE SET NULL
);

-- Doação
CREATE TABLE IF NOT EXISTS doacao (
  id_doacao INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,
  valor_quantidade VARCHAR(50) NOT NULL,
  descricao VARCHAR(200),
  data DATE NOT NULL,
  id_doador INT NOT NULL REFERENCES doador(id_doador) ON DELETE RESTRICT
);

-- Evento
CREATE TABLE IF NOT EXISTS evento (
  id_evento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data DATE NOT NULL,
  local VARCHAR(200) NOT NULL,
  descricao VARCHAR(500),
  meta VARCHAR(100)
);

-- Participação
CREATE TABLE IF NOT EXISTS participacao (
  id_participacao INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_evento INT NOT NULL REFERENCES evento(id_evento) ON DELETE CASCADE,
  id_voluntario INT REFERENCES voluntario(id_voluntario) ON DELETE SET NULL,
  id_doador INT REFERENCES doador(id_doador) ON DELETE SET NULL,
  funcao VARCHAR(50) NOT NULL
);

-- Adoção
CREATE TABLE IF NOT EXISTS adocao (
  id_adocao INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  data_adocao DATE NOT NULL,
  termo_responsabilidade BOOLEAN NOT NULL,
  id_animal INT NOT NULL UNIQUE REFERENCES animal(id_animal) ON DELETE RESTRICT,
  id_adotante INT NOT NULL REFERENCES adotante(id_adotante) ON DELETE RESTRICT
);

-- Gamificação
CREATE TABLE IF NOT EXISTS gamificacao (
  id_pontuacao INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_voluntario INT NOT NULL REFERENCES voluntario(id_voluntario) ON DELETE CASCADE,
  pontos INT NOT NULL CHECK (pontos >= 0),
  badge VARCHAR(50),
  data DATE NOT NULL
);

-- Índices adicionais para otimização de consultas por FK
CREATE INDEX IF NOT EXISTS idx_animal_id_status ON animal(id_status);
CREATE INDEX IF NOT EXISTS idx_tarefa_id_status ON tarefa(id_status);
CREATE INDEX IF NOT EXISTS idx_tarefa_id_voluntario ON tarefa(id_voluntario);
CREATE INDEX IF NOT EXISTS idx_tarefa_id_animal ON tarefa(id_animal);
CREATE INDEX IF NOT EXISTS idx_doacao_id_doador ON doacao(id_doador);
CREATE INDEX IF NOT EXISTS idx_participacao_id_evento ON participacao(id_evento);
CREATE INDEX IF NOT EXISTS idx_participacao_id_voluntario ON participacao(id_voluntario);
CREATE INDEX IF NOT EXISTS idx_participacao_id_doador ON participacao(id_doador);
CREATE INDEX IF NOT EXISTS idx_gamificacao_id_voluntario ON gamificacao(id_voluntario);

COMMIT;

-- Views
-- Animais disponíveis para adoção
CREATE VIEW vw_Animais_Disponiveis AS
SELECT a.ID_Animal,
       a.Nome,
       a.Especie,
       a.Raca,
       a.Porte,
       s.Status
FROM Animal a
         JOIN Status_Animal s ON a.Id_status = s.Id_status
         LEFT JOIN Adocao ad ON a.ID_Animal = ad.ID_Animal
WHERE ad.ID_Animal IS NULL;

-- Histórico de adoções
CREATE VIEW vw_Historico_Adocoes AS
SELECT ad.ID_Adocao,
       an.Nome   AS Animal,
       an.Especie,
       adot.Nome AS Adotante,
       adot.CPF,
       ad.Data_adocao,
       ad.Termo_responsabilidade
FROM Adocao ad
         JOIN Animal an ON ad.ID_Animal = an.ID_Animal
         JOIN Adotante adot ON ad.ID_Adotante = adot.ID_Adotante;

-- Atividades de voluntários
CREATE VIEW vw_Tarefas_Voluntarios AS
SELECT v.ID_Voluntario,
       v.Nome AS Voluntario,
       t.ID_Tarefa,
       t.Descricao,
       t.Data,
       st.Status
FROM Tarefa t
         JOIN Voluntario v ON t.ID_Voluntario = v.ID_Voluntario
         JOIN Status_Tarefa st ON t.Id_status = st.Id_status;

-- Doações realizadas
CREATE VIEW vw_Doacoes AS
SELECT d.ID_Doacao,
       dr.Nome AS Doador,
       d.Tipo,
       d.Valor_Quantidade,
       d.Descricao,
       d.Data
FROM Doacao d
         JOIN Doador dr ON d.ID_Doador = dr.ID_Doador;

-- Participação em eventos
CREATE VIEW vw_Eventos_Participantes AS
SELECT e.ID_Evento,


       e.Nome AS Evento,
       e.Data,
       e.Local,
       p.Funcao,
       v.Nome AS Voluntario,
       d.Nome AS Doador
FROM Participacao p
         JOIN Evento e ON p.ID_Evento = e.ID_Evento
         LEFT JOIN Voluntario v ON p.ID_Voluntario = v.ID_Voluntario
         LEFT JOIN Doador d ON p.ID_Doador = d.ID_Doador;

-- Ranking de voluntários (Gamificação)
CREATE VIEW vw_Ranking_Voluntarios AS
SELECT v.ID_Voluntario,
       v.Nome,
       SUM(g.Pontos)  AS Total_Pontos,
       COUNT(g.Badge) AS Badges_Conquistadas
FROM Gamificacao g
         JOIN Voluntario v ON g.ID_Voluntario = v.ID_Voluntario
GROUP BY v.ID_Voluntario, v.Nome
ORDER BY Total_Pontos DESC;
