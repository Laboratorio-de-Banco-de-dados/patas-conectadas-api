create database patas_conectadas;
-- Script de criação de tabelas para PostgreSQL
-- Modelo baseado nas tabelas fornecidas (Animal, Voluntário, Tarefa, Doador, Doação, Evento,
-- Participação, Adotante, Adoção, Gamificação, Status_Tarefa, Status_Animal).
-- Usa GENERATED ALWAYS AS IDENTITY para chaves primárias (Postgres moderno).

-- Tabela para armazenar informações sobre os doadores
CREATE TABLE doador (
id_doador SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf_cnpj CHAR(14) UNIQUE NOT NULL,
contato VARCHAR(100) NOT NULL
);

-- Tabela para armazenar informações sobre os adotantes
CREATE TABLE adotante (
id_adotante SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf CHAR(11) UNIQUE NOT NULL,
endereco VARCHAR(200) NOT NULL,
contato VARCHAR(100) NOT NULL
);

-- Tabela para armazenar os status possíveis de um animal (ex: 'disponível', 'adotado')
CREATE TABLE status_animal (
id_status SERIAL PRIMARY KEY,
status VARCHAR(20) UNIQUE NOT NULL
);

-- Tabela para armazenar os status possíveis de uma tarefa (ex: 'pendente', 'concluída')
CREATE TABLE status_tarefa (
id_status SERIAL PRIMARY KEY,
status VARCHAR(20) UNIQUE NOT NULL
);

-- Tabela para armazenar informações sobre os animais
CREATE TABLE animal (
id_animal SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
especie VARCHAR(10) NOT NULL,
raca VARCHAR(50),
idade_aproximada INT,
porte VARCHAR(10),
data_resgate DATE NOT NULL,
id_status INT NOT NULL,historico_medico VARCHAR(500)
);

-- Tabela para registrar as adoções de animais
CREATE TABLE adocao (
id_adocao SERIAL PRIMARY KEY,
data_adocao DATE NOT NULL,
termo_responsabilidade BOOLEAN,
id_animal INT UNIQUE NOT NULL,
id_adotante INT NOT NULL
);

-- Tabela para registrar as doações recebidas
CREATE TABLE doacao (
id_doacao SERIAL PRIMARY KEY,
tipo VARCHAR(20) NOT NULL,
valor_quantidade VARCHAR(50) NOT NULL,
descricao VARCHAR(200),
data DATE NOT NULL,
id_doador INT NOT NULL
);

-- Tabela para armazenar informações sobre os voluntários
CREATE TABLE voluntario (
id_voluntario SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
cpf CHAR(11) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
telefone VARCHAR(15) NOT NULL,
habilidades VARCHAR(200),
preferencias_atuacao VARCHAR(200)
);

-- Tabela para registrar as tarefas a serem executadas
CREATE TABLE tarefa (
id_tarefa SERIAL PRIMARY KEY,
descricao VARCHAR(200) NOT NULL,
data DATE NOT NULL,
id_status INT NOT NULL,
id_voluntario INT,
id_animal INT
);

-- Tabela para registrar eventosCREATE TABLE evento (
id_evento SERIAL PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
data DATE NOT NULL,
local VARCHAR(200) NOT NULL,
descricao VARCHAR(500),
meta VARCHAR(100)
);

-- Tabela para registrar a participação em eventos
CREATE TABLE participacao (
id_participacao SERIAL PRIMARY KEY,
id_evento INT NOT NULL,
id_voluntario INT,
id_doador INT,
funcao VARCHAR(50) NOT NULL
);

-- Tabela para o sistema de gamificação dos voluntários
CREATE TABLE gamificacao (
id_pontuacao SERIAL PRIMARY KEY,
id_voluntario INT NOT NULL,
pontos INT NOT NULL,
badge VARCHAR(50),
data DATE NOT NULL
);

-- Criação de Índices para otimização de consultas
CREATE INDEX idx_animal_id_status ON animal(id_status);
CREATE INDEX idx_doacao_id_doador ON doacao(id_doador);
CREATE INDEX idx_gamificacao_id_voluntario ON gamificacao(id_voluntario);
CREATE INDEX idx_participacao_id_evento ON participacao(id_evento);
CREATE INDEX idx_participacao_id_voluntario ON participacao(id_voluntario);
CREATE INDEX idx_participacao_id_doador ON participacao(id_doador);
CREATE INDEX idx_tarefa_id_status ON tarefa(id_status);
CREATE INDEX idx_tarefa_id_voluntario ON tarefa(id_voluntario);
CREATE INDEX idx_tarefa_id_animal ON tarefa(id_animal);Alter tables

-- Adiciona a chave estrangeira na tabela 'animal' referenciando 'status_animal'
ALTER TABLE animal
ADD CONSTRAINT fk_animal_status_animal
FOREIGN KEY (id_status) REFERENCES status_animal(id_status);

-- Adicionar as chaves estrangeiras na tabela 'adocao'
ALTER TABLE adocao
ADD CONSTRAINT fk_adocao_animal
FOREIGN KEY (id_animal) REFERENCES animal(id_animal) ON UPDATE NO ACTION,
ADD CONSTRAINT fk_adocao_adotante
FOREIGN KEY (id_adotante) REFERENCES adotante(id_adotante) ON UPDATE NO ACTION;

-- Adiciona a chave estrangeira na tabela 'doacao'
ALTER TABLE doacao
ADD CONSTRAINT fk_doacao_doador
FOREIGN KEY (id_doador) REFERENCES doador(id_doador) ON UPDATE NO ACTION;

-- Adiciona as chaves estrangeiras na tabela 'tarefa'
ALTER TABLE tarefa
ADD CONSTRAINT fk_tarefa_status_tarefa
FOREIGN KEY (id_status) REFERENCES status_tarefa(id_status),
ADD CONSTRAINT fk_tarefa_voluntario
FOREIGN KEY (id_voluntario) REFERENCES voluntario(id_voluntario) ON UPDATE NO
ACTION,
ADD CONSTRAINT fk_tarefa_animal
FOREIGN KEY (id_animal) REFERENCES animal(id_animal) ON UPDATE NO ACTION;

-- Adiciona as chaves estrangeiras na tabela 'participacao'
ALTER TABLE participacao
ADD CONSTRAINT fk_participacao_evento
FOREIGN KEY (id_evento) REFERENCES evento(id_evento) ON DELETE CASCADE ON
UPDATE NO ACTION,
ADD CONSTRAINT fk_participacao_voluntario
FOREIGN KEY (id_voluntario) REFERENCES voluntario(id_voluntario) ON UPDATE NO
ACTION,
ADD CONSTRAINT fk_participacao_doador
FOREIGN KEY (id_doador) REFERENCES doador(id_doador) ON UPDATE NO ACTION;-- Adiciona a chave estrangeira na tabela 'gamificacao'
ALTER TABLE gamificacao
ADD CONSTRAINT fk_gamificacao_voluntario
FOREIGN KEY (id_voluntario) REFERENCES voluntario(id_voluntario) ON DELETE CASCADE
ON UPDATE NO ACTION;

-- Inicia uma transação para garantir que todos os inserts sejam executados ou nenhum.
BEGIN;
-- 1. Inserir dados nas tabelas de status (geralmente não possuem created/updated_at)
INSERT INTO status_animal (status) VALUES
('Disponível'),
('Em tratamento'),
('Adotado'),
('Lar temporário');
INSERT INTO status_tarefa (status) VALUES
('Pendente'),
('Em andamento'),
('Concluída'),
('Cancelada');
-- Inserindo um doador
INSERT INTO doador (nome, cpf_cnpj, contato) VALUES
('Empresa Amiga dos Animais LTDA', '12345678000199', 'contato@empresaamiga.com');
-- Inserindo um adotante
INSERT INTO adotante (nome, cpf, endereco, contato) VALUES
('João da Silva', '11122233344', 'Rua das Flores, 123, São Paulo - SP', '11912345678');
-- Inserindo um voluntário
INSERT INTO voluntario (nome, cpf, email, telefone, habilidades, preferencias_atuacao)
VALUES
('Maria Oliveira', '55566677788', 'maria.oliveira@email.com', '11987654321', 'Cuidados com
filhotes, treinamento básico', 'Trabalho direto com os animais');
-- Inserindo um evento
INSERT INTO evento (nome, data, local, descricao, meta) VALUES
('Feira de Adoção de Outono', '2025-11-15', 'Parque da Cidade', 'Grande feira de adoção com
cães e gatos disponíveis.', 'Encontrar um lar para 20 animais');
-- Inserindo um animal (depende de status_animal)-- Usando o id_status=1 ('Disponível')
INSERT INTO animal (nome, especie, raca, idade_aproximada, porte, data_resgate, id_status,
historico_medico) VALUES
('Rex', 'Cachorro', 'Vira-lata', 2, 'Médio', '2025-09-01', 1, 'Encontrado na rua, estava saudável
mas assustado. Vacinado e vermifugado.');
-- Inserindo uma doação (depende de doador)
-- Usando o id_doador=1 ('Empresa Amiga dos Animais LTDA')
INSERT INTO doacao (tipo, valor_quantidade, descricao, data, id_doador) VALUES
('Ração', '100 kg', 'Doação de ração para cães adultos', '2025-10-07', 1);
-- Inserindo uma adoção (depende de animal e adotante)
-- Usando o id_animal=1 ('Rex') e id_adotante=1 ('João da Silva')
-- Primeiro, vamos adicionar um novo status e um novo animal para o exemplo de adoção
INSERT INTO status_animal (status) VALUES ('Adotado');
INSERT INTO animal (nome, especie, raca, idade_aproximada, porte, data_resgate, id_status,
historico_medico) VALUES
('Mimi', 'Gato', 'Siamês', 1, 'Pequeno', '2025-08-15', 2, 'Resgatado de um abrigo superlotado.');
INSERT INTO adocao (data_adocao, termo_responsabilidade, id_animal, id_adotante)
VALUES
('2025-10-07', TRUE, 2, 1); -- Adotante 'João da Silva' adotou o animal 'Mimi'
-- Inserindo uma tarefa (depende de status_tarefa, voluntario e animal)
-- Usando id_status=1 ('Pendente'), id_voluntario=1 ('Maria Oliveira'), id_animal=1 ('Rex')
INSERT INTO tarefa (descricao, data, id_status, id_voluntario, id_animal) VALUES
('Levar o Rex para passear no parque', '2025-10-08', 1, 1, 1);
-- Inserindo uma participação em evento (depende de evento, voluntario, doador)
-- Usando id_evento=1 ('Feira de Adoção'), id_voluntario=1 ('Maria Oliveira')
INSERT INTO participacao (id_evento, id_voluntario, id_doador, funcao) VALUES
(1, 1, NULL, 'Cuidar dos animais na feira');
-- Inserindo registro de gamificação (depende de voluntario)
-- Usando id_voluntario=1 ('Maria Oliveira')
INSERT INTO gamificacao (id_voluntario, pontos, badge, data) VALUES
(1, 50, 'Amigo dos Animais', '2025-10-07');
-- Finaliza a transação, aplicando todas as alterações.
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
an.Nome AS Animal,
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
CREATE VIEW vw_Doacoes ASSELECT d.ID_Doacao,
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
SUM(g.Pontos) AS Total_Pontos,
COUNT(g.Badge) AS Badges_Conquistadas
FROM Gamificacao g
JOIN Voluntario v ON g.ID_Voluntario = v.ID_Voluntario
GROUP BY v.ID_Voluntario, v.Nome
ORDER BY Total_Pontos DESC;
