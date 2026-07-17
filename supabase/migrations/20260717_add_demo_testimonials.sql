-- Contenido de demostracion para visualizar la seccion de opiniones del catalogo.
-- No representa compras verificadas. La interfaz lo identifica como contenido de muestra.
WITH demo(nombre, mensaje, foto_url, activo, orden) AS (
  VALUES
    ('Agustin M.', 'Me orientaron con la medida y pude elegir tranquilo.', '/branding/avatar-placeholder.svg', true, 101),
    ('Belen C.', 'La pagina es clara y encontre rapido lo que buscaba.', '/branding/avatar-placeholder.svg', true, 102),
    ('Carlos D.', 'Buena variedad para comparar antes de consultar.', '/branding/avatar-placeholder.svg', true, 103),
    ('Daiana F.', 'Me respondieron las dudas sin dar vueltas.', '/branding/avatar-placeholder.svg', true, 104),
    ('Ezequiel P.', 'Quedo muy bien presentado el catalogo.', '/branding/avatar-placeholder.svg', true, 105),
    ('Florencia S.', 'Pude consultar por modelo y me asesoraron bien.', '/branding/avatar-placeholder.svg', true, 106),
    ('Gaston R.', 'Todo explicado de manera sencilla, suma un monton.', '/branding/avatar-placeholder.svg', true, 107),
    ('Hernan L.', 'Habia varias opciones y pude elegir la que necesitaba.', '/branding/avatar-placeholder.svg', true, 108),
    ('Ivana B.', 'La atencion por WhatsApp fue muy amable.', '/branding/avatar-placeholder.svg', true, 109),
    ('Joaquin T.', 'Me aclararon la compatibilidad antes de avanzar.', '/branding/avatar-placeholder.svg', true, 110),
    ('Karen V.', 'El catalogo se entiende bien desde el celu.', '/branding/avatar-placeholder.svg', true, 111),
    ('Lucas A.', 'Encontre repuestos que no veia en otros lados.', '/branding/avatar-placeholder.svg', true, 112),
    ('Melina G.', 'Buena predisposicion para responder consultas.', '/branding/avatar-placeholder.svg', true, 113),
    ('Nahuel E.', 'Me sirvio mucho poder filtrar por modelo.', '/branding/avatar-placeholder.svg', true, 114),
    ('Ornella J.', 'La informacion de cada producto esta bastante completa.', '/branding/avatar-placeholder.svg', true, 115),
    ('Pablo N.', 'Consulte por una pieza y me explicaron las alternativas.', '/branding/avatar-placeholder.svg', true, 116),
    ('Rocio H.', 'Rapido para navegar y sin complicaciones.', '/branding/avatar-placeholder.svg', true, 117),
    ('Santiago K.', 'Se nota que conocen de motos y repuestos.', '/branding/avatar-placeholder.svg', true, 118),
    ('Tamara I.', 'Me atendieron con paciencia y buena onda.', '/branding/avatar-placeholder.svg', true, 119),
    ('Ulises O.', 'El proceso de consulta me resulto comodo.', '/branding/avatar-placeholder.svg', true, 120),
    ('Valentina M.', 'Esta bueno que indiquen cuando el precio es a confirmar.', '/branding/avatar-placeholder.svg', true, 121),
    ('Walter C.', 'Pude revisar todo antes de mandar el pedido.', '/branding/avatar-placeholder.svg', true, 122),
    ('Ayelen P.', 'La seleccion de accesorios esta muy bien armada.', '/branding/avatar-placeholder.svg', true, 123),
    ('Bruno S.', 'Me ayudaron a no equivocarme con el modelo.', '/branding/avatar-placeholder.svg', true, 124),
    ('Camila R.', 'La consulta fue simple y me contestaron claro.', '/branding/avatar-placeholder.svg', true, 125),
    ('Damian F.', 'Buen lugar para mirar opciones para la moto.', '/branding/avatar-placeholder.svg', true, 126),
    ('Emilia D.', 'Me gusto que el catalogo no esta cargado de cosas.', '/branding/avatar-placeholder.svg', true, 127),
    ('Facundo L.', 'La descripcion me ayudo a comparar dos productos.', '/branding/avatar-placeholder.svg', true, 128),
    ('Guadalupe B.', 'Atencion cordial y respuestas concretas.', '/branding/avatar-placeholder.svg', true, 129),
    ('Ignacio V.', 'Se puede recorrer rapido y funciona bien en el telefono.', '/branding/avatar-placeholder.svg', true, 130),
    ('Julieta A.', 'Me pasaron la informacion que necesitaba al toque.', '/branding/avatar-placeholder.svg', true, 131),
    ('Kevin G.', 'Hay opciones para distintos modelos, eso ayuda bastante.', '/branding/avatar-placeholder.svg', true, 132),
    ('Lara E.', 'La comunicacion fue fluida desde el primer mensaje.', '/branding/avatar-placeholder.svg', true, 133),
    ('Mariano T.', 'Me explicaron cual era la diferencia entre las piezas.', '/branding/avatar-placeholder.svg', true, 134),
    ('Noelia J.', 'Todo ordenado y facil de encontrar.', '/branding/avatar-placeholder.svg', true, 135),
    ('Oscar N.', 'Buena referencia para armar el pedido con calma.', '/branding/avatar-placeholder.svg', true, 136),
    ('Priscila H.', 'Me gusto la forma de mostrar los productos.', '/branding/avatar-placeholder.svg', true, 137),
    ('Ramiro I.', 'Resolvieron mi consulta bastante rapido.', '/branding/avatar-placeholder.svg', true, 138),
    ('Sofia O.', 'El contacto por WhatsApp hace todo mas practico.', '/branding/avatar-placeholder.svg', true, 139),
    ('Tomas M.', 'Pude confirmar el repuesto antes de pedirlo.', '/branding/avatar-placeholder.svg', true, 140),
    ('Victoria C.', 'Catalogo prolijo y con buena informacion.', '/branding/avatar-placeholder.svg', true, 141),
    ('Yamila P.', 'Me asesoraron bien con una consulta puntual.', '/branding/avatar-placeholder.svg', true, 142),
    ('Alan S.', 'La busqueda por categoria me ahorro bastante tiempo.', '/branding/avatar-placeholder.svg', true, 143),
    ('Bianca R.', 'Todo muy intuitivo para consultar desde casa.', '/branding/avatar-placeholder.svg', true, 144),
    ('Cristian F.', 'Me dieron una respuesta concreta sobre compatibilidad.', '/branding/avatar-placeholder.svg', true, 145),
    ('Daniela D.', 'La experiencia desde el celular fue comoda.', '/branding/avatar-placeholder.svg', true, 146),
    ('Esteban L.', 'Se entiende rapido que opciones hay disponibles.', '/branding/avatar-placeholder.svg', true, 147),
    ('Fiorella B.', 'Me atendieron bien y con buena predisposicion.', '/branding/avatar-placeholder.svg', true, 148),
    ('German V.', 'Practico para revisar productos y despues consultar.', '/branding/avatar-placeholder.svg', true, 149),
    ('Helena A.', 'La informacion esta presentada de forma clara.', '/branding/avatar-placeholder.svg', true, 150)
)
INSERT INTO public.testimonials (nombre, mensaje, foto_url, activo, orden)
SELECT d.nombre, d.mensaje, d.foto_url, d.activo, d.orden
FROM demo d
WHERE NOT EXISTS (
  SELECT 1
  FROM public.testimonials t
  WHERE t.nombre = d.nombre
    AND t.mensaje = d.mensaje
);
