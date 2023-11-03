export enum ShadowType {
  DropShadow = "dropShadow",
  InnerShadow = "innerShadow",
}

export enum StyleType {
  BoxShadow = "boxShadow",
  Border = "border",
  Typography = "typography",
}

export enum FontWeight {
  Normal = "400",
  Bold = "700",
}

export interface ShadowValue {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color: string;
  type: ShadowType;
}

export interface BorderValue {
  color: string;
  width: string;
  style: string;
}

export interface TypographyValue {
  fontFamily: string;
  fontWeight: FontWeight | string;
  lineHeight: string;
  fontSize: string;
  textCase?: string;
  fontStyle?: string;
  letterSpacing?: string;
}

export interface ShadowStyle {
  value: ShadowValue | ShadowValue[];
  type: StyleType.BoxShadow;
  description?: string;
}

export interface TypographyStyle {
  value: TypographyValue;
  type: StyleType.Typography;
  description?: string;
}

export interface BorderStyle {
  value: BorderValue;
  type: StyleType.Border;
  description?: string;
}

export interface DefaultStyle {
  value: string;
  type: StyleType;
  description?: string;
}

export interface StyleCollection<T = DefaultStyle> {
  [key: string]: T | DefaultStyle;
}

export interface BorderCollection extends StyleCollection<BorderStyle> {}
export interface ShadowCollection extends StyleCollection<ShadowStyle> {}
export interface TypographyCollection extends StyleCollection<TypographyStyle> {}

export interface PaletteStyleCollection {
  gradient: StyleCollection;
  neutral: {
    white: DefaultStyle;
    black: DefaultStyle;
  };
  [color: string]: StyleCollection;
}

export interface ThemeConfig {
  palette: PaletteStyleCollection;
  modals: ShadowCollection;
  bottom_sheet: ShadowCollection;
  opacity: StyleCollection;
  spacing: StyleCollection;
  corner_radius: StyleCollection;
  thickness: StyleCollection;
  font_family: StyleCollection;
  weight: StyleCollection;
  line_height: StyleCollection;
  font_size: StyleCollection;
  sizing: StyleCollection;
  case: StyleCollection;
  display: TypographyCollection;
  headline: TypographyCollection;
  body: TypographyCollection;
  font: TypographyCollection;
  background: StyleCollection;
  text: StyleCollection;
  links: StyleCollection;
  icons: StyleCollection;
  border: BorderCollection;
  buttons: ShadowCollection;
  badge: StyleCollection;
  banner: StyleCollection;
  tabs: StyleCollection;
  pill: StyleCollection;
  nesting: StyleCollection;
  list: StyleCollection;
  chart: StyleCollection;
  paywall: ShadowCollection;
}
