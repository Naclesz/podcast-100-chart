import React from "react";

type TextHtmlProps = {
  text: string;
  className?: string;
};

export default function TextHtml({
  text,
  className,
}: TextHtmlProps): React.ReactNode {
  return (
    <div dangerouslySetInnerHTML={{ __html: text }} className={className} />
  );
}
