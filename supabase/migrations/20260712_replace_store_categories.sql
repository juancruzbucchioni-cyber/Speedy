BEGIN;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS orden integer NOT NULL DEFAULT 0;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS motorcycle_model text;

-- Si antes se usaba una categoria como modelo, la guardamos en el campo de modelo.
UPDATE public.products
SET motorcycle_model = category
WHERE category IN (
  '110cc',
  'CG / Titan / S2',
  'Tornado / XR',
  'Skua',
  'Rouser',
  'Twister',
  'Wave / Biz',
  'Motomel / Corven / Zanella'
)
AND (motorcycle_model IS NULL OR motorcycle_model = '');

-- Reubica productos de categorias viejas dentro de las 9 categorias nuevas.
UPDATE public.products
SET category = CASE
  WHEN category IN ('Transmisión', 'Transmision') THEN 'Transmisión'
  WHEN category IN ('Frenos') THEN 'Frenos'
  WHEN category IN ('Cámaras', 'Camaras', 'Cubiertas') THEN 'Cubiertas y cámaras'
  WHEN category IN ('Aceites', 'Lubricantes', 'Líquido de frenos', 'Liquido de frenos', 'Limpiadores', 'Grasa para cadena', 'Aceites y lubricantes') THEN 'Aceites y lubricantes'
  WHEN category IN ('Baterías', 'Baterias', 'Luces', 'Iluminacion', 'Iluminación', 'Electronica', 'Electrónica', 'Electricidad', 'Bujías', 'Bujias') THEN 'Electricidad'
  WHEN category IN ('Cascos', 'Antiparras', 'Guantes', 'Indumentaria', 'Cascos e indumentaria') THEN 'Cascos e indumentaria'
  WHEN category IN ('Plásticos', 'Plasticos', 'Puños', 'Punos', 'Espejos', 'Estética y tuning') THEN 'Estética y tuning'
  WHEN category IN ('Baúles', 'Baules', 'Parabrisas', 'Defensas', 'Portaequipajes', 'Escapes', 'Accesorios') THEN 'Accesorios'
  WHEN category IN ('110cc', 'CG / Titan / S2', 'Tornado / XR', 'Skua', 'Rouser', 'Twister', 'Wave / Biz', 'Motomel / Corven / Zanella', 'Cables', 'Filtros', 'Mantenimiento', 'Repuestos') THEN 'Repuestos'
  ELSE 'Repuestos'
END
WHERE category IS NULL
  OR category NOT IN (
    'Repuestos',
    'Accesorios',
    'Cascos e indumentaria',
    'Cubiertas y cámaras',
    'Aceites y lubricantes',
    'Transmisión',
    'Frenos',
    'Electricidad',
    'Estética y tuning'
  );

INSERT INTO public.categories (name, description, image_url, activo, orden)
VALUES
  ('Repuestos', 'Para todo lo mecánico y de mantenimiento.', '/branding/speedy-logo-final.png', true, 1),
  ('Accesorios', 'Cosas extra para la moto o el conductor.', '/branding/speedy-logo-final.png', true, 2),
  ('Cascos e indumentaria', 'Cascos, guantes, camperas, antiparras, etc.', '/branding/speedy-logo-final.png', true, 3),
  ('Cubiertas y cámaras', 'Cubiertas, cámaras, parches, válvulas.', '/branding/speedy-logo-final.png', true, 4),
  ('Aceites y lubricantes', 'Aceite motor, grasa cadena, lubricantes, líquidos.', '/branding/speedy-logo-final.png', true, 5),
  ('Transmisión', 'Kit transmisión, cadenas, coronas, piñones.', '/branding/speedy-logo-final.png', true, 6),
  ('Frenos', 'Pastillas, cintas, discos, manijas, líquido de freno.', '/branding/speedy-logo-final.png', true, 7),
  ('Electricidad', 'Baterías, luces, lámparas, guiños, CDI, bobinas, bujías.', '/branding/speedy-logo-final.png', true, 8),
  ('Estética y tuning', 'Stickers, plásticos, puños, espejos, cubre rayos, luces LED.', '/branding/speedy-logo-final.png', true, 9)
ON CONFLICT (name) DO UPDATE
SET
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  activo = EXCLUDED.activo,
  orden = EXCLUDED.orden;

DELETE FROM public.categories
WHERE name NOT IN (
  'Repuestos',
  'Accesorios',
  'Cascos e indumentaria',
  'Cubiertas y cámaras',
  'Aceites y lubricantes',
  'Transmisión',
  'Frenos',
  'Electricidad',
  'Estética y tuning'
);

COMMIT;
