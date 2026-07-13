const sections = [
  {
    title: '1. Introduccion',
    paragraphs: [
      'Bienvenido a Speedy Repuestos. Al navegar y realizar compras en nuestro sitio web, usted acepta cumplir con los siguientes terminos y condiciones. Si no esta de acuerdo con alguna parte de estos, le rogamos no utilizar nuestros servicios.',
    ],
  },
  {
    title: '2. Sobre los productos',
    paragraphs: [
      'Compatibilidad: Es responsabilidad exclusiva del cliente verificar que el repuesto o accesorio sea compatible con el modelo, ano y version especifica de su motocicleta. Las imagenes son ilustrativas y pueden variar ligeramente del producto final.',
      'Disponibilidad: Todos los productos estan sujetos a disponibilidad de stock. En caso de una compra sin stock disponible, nos pondremos en contacto para ofrecer un reemplazo o el reembolso total.',
    ],
  },
  {
    title: '3. Precios y pagos',
    paragraphs: [
      'Precios: Todos los precios estan expresados en pesos argentinos (ARS) e incluyen los impuestos correspondientes, a menos que se indique lo contrario.',
      'Modificaciones: Nos reservamos el derecho de modificar precios sin previo aviso. Los precios aplicables seran los vigentes al momento de confirmar el pedido.',
      'Pagos: Los pagos disponibles son efectivo y transferencia. No almacenamos datos de tarjetas de credito o debito.',
    ],
  },
  {
    title: '4. Envios y entregas',
    paragraphs: [
      'Plazos: Los plazos de entrega son estimados y pueden variar segun la logistica del transportista.',
      'Costo de envio: El costo sera calculado al momento de finalizar la compra segun la ubicacion geografica.',
      'Responsabilidad: Una vez entregado el paquete a la empresa de logistica, la responsabilidad del estado de la carga durante el traslado recae sobre el transportista.',
    ],
  },
  {
    title: '5. Politicas de cambios y devoluciones',
    paragraphs: [
      'Plazo: El cliente dispone de 10 dias corridos tras la recepcion del producto para solicitar un cambio.',
      'Condiciones: Para aceptar una devolucion, el producto debe estar en su empaque original, sin senales de uso, sin marcas de instalacion y con todas sus etiquetas.',
      'Repuestos electricos: Debido a la naturaleza de los componentes electronicos, como CDI, bobinas y reguladores, estos no tienen cambio ni devolucion una vez abiertos, dado que una mala instalacion puede danarlos instantaneamente.',
      'Gastos de envio: Los gastos de envio por cambios que no sean por defectos de fabrica correran por cuenta del comprador.',
    ],
  },
  {
    title: '6. Garantias',
    paragraphs: [
      'La garantia cubre unicamente defectos de fabricacion y no danos causados por mal uso, instalacion incorrecta, accidentes o desgaste natural por el uso de la motocicleta.',
      'Para hacer efectiva la garantia, es obligatorio presentar el comprobante de compra, factura o ticket.',
    ],
  },
  {
    title: '7. Propiedad intelectual',
    paragraphs: [
      'Todo el contenido presente en esta web, incluyendo textos, logos, imagenes y graficos, es propiedad exclusiva de Speedy Repuestos y esta protegido por las leyes de derecho de autor.',
    ],
  },
  {
    title: '8. Privacidad y datos personales',
    paragraphs: [
      'Su informacion sera tratada conforme a nuestras politicas de privacidad. Nos comprometemos a no compartir, vender ni alquilar sus datos personales a terceros, salvo que sea necesario para el procesamiento de pagos o envios.',
    ],
  },
];

export default function Terms() {
  return (
    <section className="container py-10 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-[0_18px_60px_rgba(255,255,255,0.06)] md:p-10">
        <h1 className="font-brand mb-8 text-3xl font-black text-white md:text-4xl">
          Terminos y condiciones de uso
        </h1>

        <div className="space-y-8">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="mb-3 text-xl font-bold text-white">{section.title}</h2>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-gray-200">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
