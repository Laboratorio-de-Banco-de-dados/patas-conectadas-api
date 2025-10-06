-- Migration: Add preferences table and update tasks table
-- Date: 2025-01-05

BEGIN;

-- Add new columns to tarefa table
-- First, populate title from descricao before making it NOT NULL
ALTER TABLE tarefa ADD COLUMN title VARCHAR(100);
UPDATE tarefa SET title = LEFT(descricao, 100) WHERE title IS NULL;
ALTER TABLE tarefa ALTER COLUMN title SET NOT NULL;

ALTER TABLE tarefa ADD COLUMN due_date DATE;
ALTER TABLE tarefa ADD COLUMN target_entity VARCHAR(50);
ALTER TABLE tarefa ADD COLUMN created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE tarefa ADD COLUMN updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_tarefa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tarefa
CREATE TRIGGER trigger_update_tarefa_updated_at
BEFORE UPDATE ON tarefa
FOR EACH ROW
EXECUTE FUNCTION update_tarefa_updated_at();

-- Create preferencia table
CREATE TABLE IF NOT EXISTS preferencia (
  id_preferencia INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_voluntario INT NOT NULL REFERENCES voluntario(id_voluntario) ON DELETE CASCADE ON UPDATE NO ACTION,
  tipo VARCHAR(50) NOT NULL,
  valor VARCHAR(200) NOT NULL,
  created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Create index on preferencia
CREATE INDEX IF NOT EXISTS idx_preferencia_id_voluntario ON preferencia(id_voluntario);

COMMIT;
