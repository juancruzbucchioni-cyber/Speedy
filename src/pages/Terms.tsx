const sections = [
  {
    title: '1. Introducción',
    paragraphs: [
      'Bienvenido a Kazuty Parts. Al navegar y realizar compras en nuestro sitio web, usted acepta cumplir con los siguientes términos y condiciones. Si no está de acuerdo con alguna parte de estos, le rogamos no utilizar nuestros servicios.',
    ],
  },
  {
    title: '2. Sobre los productos',
    paragraphs: [
      'Compatibilidad: Es responsabilidad exclusiva del cliente verificar que el repuesto o accesorio sea compatible con el modelo, año y versión específica de su motocicleta. Las imágenes son ilustrativas y pueden variar ligeramente del producto final.',
      'Disponibilidad: Todos los productos están sujetos a disponibilidad de stock. En caso de una compra sin stock disponible, nos pondremos en contacto para ofrecer un reemplazo o el reembolso total.',
    ],
  },
  {
    title: '3. Precios y pagos',
    paragraphs: [
      'Precios: Todos los precios están expresados en pesos argentinos (ARS) e incluyen los impuestos correspondientes, a menos que se indique lo contrario.',
      'Modificaciones: Nos reservamos el derecho de modificar precios sin previo aviso. Los precios aplicables serán los vigentes al momento de confirmar el pedido.',
      'Pagos: Los pagos disponibles son efectivo y transferencia. No almacenamos datos de tarjetas de crédito o débito.',
    ],
  },
  {
    title: '4. Envíos y entregas',
    paragraphs: [
      'Plazos: Los plazos de entrega son estimados y pueden variar según la logística del transportista.',
      'Costo de envío: El costo será calculado al momento de finalizar la compra según la ubicación geográfica.',
      'Responsabilidad: Una vez entregado el paquete a la empresa de logística, la responsabilidad del estado de la carga durante el traslado recae sobre el transportista.',
    ],
  },
  {
    title: '5. Políticas de cambios y devoluciones',
    paragraphs: [
      'Plazo: El cliente dispone de 10 días corridos tras la recepción del producto para solicitar un cambio.',
      'Condiciones: Para aceptar una devolución, el producto debe estar en su empaque original, sin señales de uso, sin marcas de instalación y con todas sus etiquetas.',
      'Repuestos eléctricos: Debido a la naturaleza de los componentes electrónicos, como CDI, bobinas y reguladores, estos no tienen cambio ni devolución una vez abiertos, dado que una mala instalación puede dañarlos instantáneamente.',
      'Gastos de envío: Los gastos de envío por cambios que no sean por defectos de fábrica correrán por cuenta del comprador.',
    ],
  },
  {
    title: '6. Garantías',
    paragraphs: [
      'La garantía cubre únicamente defectos de fabricación y no daños causados por mal uso, instalación incorrecta, accidentes o desgaste natural por el uso de la motocicleta.',
      'Para hacer efectiva la garantía, es obligatorio presentar el comprobante de compra, factura o ticket.',
    ],
  },
  {
    title: '7. Propiedad intelectual',
    paragraphs: [
      'Todo el contenido presente en esta web, incluyendo textos, logos, imágenes y gráficos, es propiedad exclusiva de Kazuty Parts y está protegido por las leyes de derecho de autor.',
    ],
  },
  {
    title: '8. Privacidad y datos personales',
    paragraphs: [
      'Su información será tratada conforme a nuestras políticas de privacidad. Nos comprometemos a no compartir, vender ni alquilar sus datos personales a terceros, salvo que sea necesario para el procesamiento de pagos o envíos.',
    ],
  },
];

export default function Terms() {
  return (
    <section className="container py-10 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-[0_18px_60px_rgba(255,255,255,0.06)] md:p-10">
        <h1 className="font-brand mb-8 text-3xl font-black text-white md:text-4xl">
          Términos y condiciones de uso
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
