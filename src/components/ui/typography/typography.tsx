import { cn } from '@/utils/tailwind';
import { cva } from 'class-variance-authority';
import { FC } from 'react';
import Markdown from 'react-markdown';
import { TypographyProps } from './typography.types';

export const typographyVariants = cva([], {
  variants: {
    as: {
      h1: 'scroll-m-20 text-3xl font-bold tracking-tight',
      h2: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-xl font-semibold tracking-tight first:mt-0',
      h4: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h5: 'scroll-m-20',
      p: 'leading-5',
      span: '',
    },
    fontWeight: {
      default: [],
      normal: 'font-normal',
      bold: 'font-bold',
      semiBold: 'font-semibold',
    },
    capitalize: {
      all: 'capitalize',
      first: 'block capitalize-first',
      none: 'normal-case',
    },
    muted: {
      true: 'text-muted-foreground',
    },
    markdown: {
      true: 'font-normal',
    },
  },
  defaultVariants: {
    fontWeight: 'default',
    markdown: false,
  },
});

const Typography: FC<TypographyProps> = ({
  as = 'span',
  children,
  className,
  style,
  markdown,
  capitalize,
  ...variantProps
}) => {
  const calculatedClassName = cn(
    typographyVariants({
      as,
      capitalize: capitalize ?? (as === 'h1' ? 'all' : undefined),
      ...variantProps,
      markdown,
    }),
    className,
  );
  const Component = as;
  if (markdown && typeof children === 'string') {
    return (
      <Component className={calculatedClassName} style={style}>
        <Markdown>{children}</Markdown>
      </Component>
    );
  }
  return (
    <Component style={style} className={calculatedClassName}>
      {children}
    </Component>
  );
};

export default Typography;
