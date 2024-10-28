import { PropsWithClassName } from '@/types/react';
import { VariantProps } from 'class-variance-authority';
import { CSSProperties, PropsWithChildren } from 'react';
import { typographyVariants } from './typography';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span';

export type TypographyBaseProps = PropsWithChildren<
  PropsWithClassName<VariantProps<typeof typographyVariants>>
>;

export type TypographyProps = {
  as?: TypographyVariant;
  style?: CSSProperties;
} & TypographyBaseProps;
