-- CreateTable
CREATE TABLE "adocao" (
    "id_adocao" SERIAL NOT NULL,
    "data_adocao" DATE NOT NULL,
    "termo_responsabilidade" BOOLEAN NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "id_adotante" INTEGER NOT NULL,

    CONSTRAINT "adocao_pkey" PRIMARY KEY ("id_adocao")
);

-- CreateTable
CREATE TABLE "adotante" (
    "id_adotante" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "endereco" VARCHAR(200) NOT NULL,
    "contato" VARCHAR(100) NOT NULL,

    CONSTRAINT "adotante_pkey" PRIMARY KEY ("id_adotante")
);

-- CreateTable
CREATE TABLE "animal" (
    "id_animal" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "especie" VARCHAR(10) NOT NULL,
    "raca" VARCHAR(50),
    "idade_aproximada" INTEGER,
    "porte" VARCHAR(10),
    "data_resgate" DATE NOT NULL,
    "id_status" INTEGER NOT NULL,
    "historico_medico" VARCHAR(500),

    CONSTRAINT "animal_pkey" PRIMARY KEY ("id_animal")
);

-- CreateTable
CREATE TABLE "doacao" (
    "id_doacao" SERIAL NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "valor_quantidade" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(200),
    "data" DATE NOT NULL,
    "id_doador" INTEGER NOT NULL,

    CONSTRAINT "doacao_pkey" PRIMARY KEY ("id_doacao")
);

-- CreateTable
CREATE TABLE "doador" (
    "id_doador" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "cpf_cnpj" CHAR(14) NOT NULL,
    "contato" VARCHAR(100) NOT NULL,

    CONSTRAINT "doador_pkey" PRIMARY KEY ("id_doador")
);

-- CreateTable
CREATE TABLE "evento" (
    "id_evento" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "data" DATE NOT NULL,
    "local" VARCHAR(200) NOT NULL,
    "descricao" VARCHAR(500),
    "meta" VARCHAR(100),

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "gamificacao" (
    "id_pontuacao" SERIAL NOT NULL,
    "id_voluntario" INTEGER NOT NULL,
    "pontos" INTEGER NOT NULL,
    "badge" VARCHAR(50),
    "data" DATE NOT NULL,

    CONSTRAINT "gamificacao_pkey" PRIMARY KEY ("id_pontuacao")
);

-- CreateTable
CREATE TABLE "participacao" (
    "id_participacao" SERIAL NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "id_voluntario" INTEGER,
    "id_doador" INTEGER,
    "funcao" VARCHAR(50) NOT NULL,

    CONSTRAINT "participacao_pkey" PRIMARY KEY ("id_participacao")
);

-- CreateTable
CREATE TABLE "status_animal" (
    "id_status" SERIAL NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "status_animal_pkey" PRIMARY KEY ("id_status")
);

-- CreateTable
CREATE TABLE "status_tarefa" (
    "id_status" SERIAL NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "status_tarefa_pkey" PRIMARY KEY ("id_status")
);

-- CreateTable
CREATE TABLE "tarefa" (
    "id_tarefa" SERIAL NOT NULL,
    "descricao" VARCHAR(200) NOT NULL,
    "data" DATE NOT NULL,
    "id_status" INTEGER NOT NULL,
    "id_voluntario" INTEGER,
    "id_animal" INTEGER,

    CONSTRAINT "tarefa_pkey" PRIMARY KEY ("id_tarefa")
);

-- CreateTable
CREATE TABLE "voluntario" (
    "id_voluntario" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(15) NOT NULL,
    "habilidades" VARCHAR(200),
    "preferencias_atuacao" VARCHAR(200),

    CONSTRAINT "voluntario_pkey" PRIMARY KEY ("id_voluntario")
);

-- CreateIndex
CREATE UNIQUE INDEX "adocao_id_animal_key" ON "adocao"("id_animal");

-- CreateIndex
CREATE UNIQUE INDEX "adotante_cpf_key" ON "adotante"("cpf");

-- CreateIndex
CREATE INDEX "idx_animal_id_status" ON "animal"("id_status");

-- CreateIndex
CREATE INDEX "idx_doacao_id_doador" ON "doacao"("id_doador");

-- CreateIndex
CREATE UNIQUE INDEX "doador_cpf_cnpj_key" ON "doador"("cpf_cnpj");

-- CreateIndex
CREATE INDEX "idx_gamificacao_id_voluntario" ON "gamificacao"("id_voluntario");

-- CreateIndex
CREATE INDEX "idx_participacao_id_doador" ON "participacao"("id_doador");

-- CreateIndex
CREATE INDEX "idx_participacao_id_evento" ON "participacao"("id_evento");

-- CreateIndex
CREATE INDEX "idx_participacao_id_voluntario" ON "participacao"("id_voluntario");

-- CreateIndex
CREATE UNIQUE INDEX "status_animal_status_key" ON "status_animal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "status_tarefa_status_key" ON "status_tarefa"("status");

-- CreateIndex
CREATE INDEX "idx_tarefa_id_animal" ON "tarefa"("id_animal");

-- CreateIndex
CREATE INDEX "idx_tarefa_id_status" ON "tarefa"("id_status");

-- CreateIndex
CREATE INDEX "idx_tarefa_id_voluntario" ON "tarefa"("id_voluntario");

-- CreateIndex
CREATE UNIQUE INDEX "voluntario_cpf_key" ON "voluntario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "voluntario_email_key" ON "voluntario"("email");

-- AddForeignKey
ALTER TABLE "adocao" ADD CONSTRAINT "adocao_id_adotante_fkey" FOREIGN KEY ("id_adotante") REFERENCES "adotante"("id_adotante") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "adocao" ADD CONSTRAINT "adocao_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "animal" ADD CONSTRAINT "animal_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "status_animal"("id_status") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao" ADD CONSTRAINT "doacao_id_doador_fkey" FOREIGN KEY ("id_doador") REFERENCES "doador"("id_doador") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "gamificacao" ADD CONSTRAINT "gamificacao_id_voluntario_fkey" FOREIGN KEY ("id_voluntario") REFERENCES "voluntario"("id_voluntario") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participacao" ADD CONSTRAINT "participacao_id_doador_fkey" FOREIGN KEY ("id_doador") REFERENCES "doador"("id_doador") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participacao" ADD CONSTRAINT "participacao_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "evento"("id_evento") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participacao" ADD CONSTRAINT "participacao_id_voluntario_fkey" FOREIGN KEY ("id_voluntario") REFERENCES "voluntario"("id_voluntario") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id_animal") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "status_tarefa"("id_status") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_id_voluntario_fkey" FOREIGN KEY ("id_voluntario") REFERENCES "voluntario"("id_voluntario") ON DELETE SET NULL ON UPDATE NO ACTION;
