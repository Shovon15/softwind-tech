"use client";
import decodeHtmlEntities from "@/utils/helpers/decodeHtmlEntities";
// import decodeHtmlEntities from "@/utils/helpers/decodeHtmlEntities";
import { useEffect, useState } from "react";

type Props = {
  content: string | null | undefined;
  className?: string;
};

export default function SafeHtml({ content = "", className = "" }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const decodedContent = decodeHtmlEntities(content as string);

  if (!mounted) {
    return null;
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: decodedContent }}
    />
  );
}
