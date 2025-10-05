-- Migration for RF04, RF05, RF06
-- Add created_at and updated_at to voluntario table
ALTER TABLE voluntario 
ADD COLUMN created_at TIMESTAMP(6) DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP(6) DEFAULT NOW();

-- Add new fields to tarefa table for enhanced task management
ALTER TABLE tarefa 
ADD COLUMN title VARCHAR(200),
ADD COLUMN status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN target_entity VARCHAR(200),
ADD COLUMN due_date TIMESTAMP(6),
ADD COLUMN created_at TIMESTAMP(6) DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP(6) DEFAULT NOW();

-- Update existing tasks to have title from descricao
UPDATE tarefa SET title = descricao WHERE title IS NULL;

-- Make title NOT NULL after populating
ALTER TABLE tarefa ALTER COLUMN title SET NOT NULL;

-- Change descricao to TEXT type for longer descriptions
ALTER TABLE tarefa ALTER COLUMN descricao TYPE TEXT;

-- Create preferencia table
CREATE TABLE IF NOT EXISTS preferencia (
  id_preferencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_voluntario INT NOT NULL,
  preference VARCHAR(200) NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP(6) DEFAULT NOW() NOT NULL,
  FOREIGN KEY (id_voluntario) REFERENCES voluntario(id_voluntario) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- Create index for preferencia
CREATE INDEX IF NOT EXISTS idx_preferencia_id_voluntario ON preferencia(id_voluntario);

-- Create trigger to update updated_at on voluntario
CREATE OR REPLACE FUNCTION update_voluntario_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER voluntario_updated_at_trigger
BEFORE UPDATE ON voluntario
FOR EACH ROW
EXECUTE FUNCTION update_voluntario_updated_at();

-- Create trigger to update updated_at on tarefa
CREATE OR REPLACE FUNCTION update_tarefa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tarefa_updated_at_trigger
BEFORE UPDATE ON tarefa
FOR EACH ROW
EXECUTE FUNCTION update_tarefa_updated_at();

-- Create trigger to update updated_at on preferencia
CREATE OR REPLACE FUNCTION update_preferencia_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER preferencia_updated_at_trigger
BEFORE UPDATE ON preferencia
FOR EACH ROW
EXECUTE FUNCTION update_preferencia_updated_at();
