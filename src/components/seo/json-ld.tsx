/**
 * @component JsonLd
 * @description Injecte un bloc <script type="application/ld+json"> dans le DOM.
 *
 * Utilisation :
 *   <JsonLd data={pharmacyJsonLd(pharmacy)} />
 */

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      id={id}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
