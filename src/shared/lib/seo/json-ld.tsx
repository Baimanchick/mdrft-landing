import type { Thing, WithContext } from "schema-dts";

type JsonLdProps = {
  value: WithContext<Thing>;
};

export const serializeJsonLd = (value: WithContext<Thing>): string =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export function JsonLd({ value }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(value) }}
    />
  );
}
