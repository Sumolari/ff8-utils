import { ReactNode } from 'react';

export default function H2({
  children,
  ...props
}: { children: ReactNode } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  return (
    <h2 {...props} className="cursor-pointer font-semibold text-xl mb-3">
      {children}
    </h2>
  );
}
