-- P3: Ampliar NUMERIC para soportar montos grandes (inflacion argentina)
ALTER TABLE pagos ALTER COLUMN monto TYPE NUMERIC(14,2);
ALTER TABLE pagos ALTER COLUMN "montoUSD" TYPE NUMERIC(14,2);
ALTER TABLE pagos ALTER COLUMN "usdDelDia" TYPE NUMERIC(14,2);

-- P2: NOT NULL en campos que no deben ser nulos
-- Primero llenar posibles nulls existentes con valores por defecto
UPDATE pagos SET monto = 0 WHERE monto IS NULL;
UPDATE pagos SET fecha = CURRENT_DATE WHERE fecha IS NULL;

ALTER TABLE pagos ALTER COLUMN monto SET NOT NULL;
ALTER TABLE pagos ALTER COLUMN fecha SET NOT NULL;

-- S2: Hacer explicito ON DELETE RESTRICT en FKs de pagos
-- PostgreSQL no permite ALTER CONSTRAINT, hay que drop + recreate
DO $$ BEGIN
  -- FK idProveedor
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'pagos_idProveedor_fkey' AND table_name = 'pagos'
  ) THEN
    ALTER TABLE pagos DROP CONSTRAINT "pagos_idProveedor_fkey";
    ALTER TABLE pagos ADD CONSTRAINT "pagos_idProveedor_fkey"
      FOREIGN KEY ("idProveedor") REFERENCES proveedores(id) ON DELETE RESTRICT;
  END IF;

  -- FK idCliente
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'pagos_idCliente_fkey' AND table_name = 'pagos'
  ) THEN
    ALTER TABLE pagos DROP CONSTRAINT "pagos_idCliente_fkey";
    ALTER TABLE pagos ADD CONSTRAINT "pagos_idCliente_fkey"
      FOREIGN KEY ("idCliente") REFERENCES clientes(id) ON DELETE RESTRICT;
  END IF;

  -- FK idMedioPago
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'pagos_idMedioPago_fkey' AND table_name = 'pagos'
  ) THEN
    ALTER TABLE pagos DROP CONSTRAINT "pagos_idMedioPago_fkey";
    ALTER TABLE pagos ADD CONSTRAINT "pagos_idMedioPago_fkey"
      FOREIGN KEY ("idMedioPago") REFERENCES medio_pago("idMedioPago") ON DELETE RESTRICT;
  END IF;

  -- FK idUser
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'pagos_idUser_fkey' AND table_name = 'pagos'
  ) THEN
    ALTER TABLE pagos DROP CONSTRAINT "pagos_idUser_fkey";
    ALTER TABLE pagos ADD CONSTRAINT "pagos_idUser_fkey"
      FOREIGN KEY ("idUser") REFERENCES usuarios(id) ON DELETE RESTRICT;
  END IF;
END $$;
