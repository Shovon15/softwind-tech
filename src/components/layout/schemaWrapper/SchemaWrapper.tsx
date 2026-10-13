import React from "react";

type Props = { children: React.ReactNode; jsonLd: any };

const SchemaWrapper = ({ children, jsonLd }: Props) => {
  // An array of schemas is rendered as one <script> per node so each stays a
  // standalone JSON-LD block instead of a single anonymous array.
  const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  return (
    <>
      {schemas.filter(Boolean).map((schema: any, index: number) => (
        <script
          key={schema?.["@id"] ?? index}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}

      {children}
    </>
  );
};

export default SchemaWrapper;
