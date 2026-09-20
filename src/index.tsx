/**
 * @sendflit/email-components — email-safe React components.
 *
 * Deliberately does not depend on @react-email/render or any other
 * rendering package: `render()` below is a thin wrapper over React's own
 * `renderToStaticMarkup`, which already does exactly what's needed here.
 * Every component renders to table-based, inline-styled HTML — the
 * "bulletproof email" pattern — because flexbox/grid and external
 * stylesheets are unreliable across Outlook, Gmail's stripped <style>
 * handling, and older mail clients in general.
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ------------------------------------------------------------- render()

/** Renders a template element to a full HTML document string, ready to
 * pass straight into the SendFlit API's `html` field. */
export function render(element: React.ReactElement): string {
  return "<!doctype html>" + renderToStaticMarkup(element);
}

// --------------------------------------------------------------- Html

export interface HtmlProps {
  lang?: string;
  children?: React.ReactNode;
}

/** Root wrapper — sets the lang attribute and the meta tags every mail
 * client expects to see up front (charset, viewport, color-scheme). */
export function Html({ lang = "en", children }: HtmlProps) {
  return (
    <html lang={lang} dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        {/* mso-table-lspace/rspace: Outlook adds spacing around tables by
            default that nothing else does — this is the standard reset. */}
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html:
              "body{margin:0;padding:0;width:100%!important}" +
              "table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}" +
              "img{border:0;line-height:100%;outline:none;text-decoration:none}",
          }}
        />
      </head>
      {children}
    </html>
  );
}

// --------------------------------------------------------------- Head

/** Slot for extra <head> content (e.g. a custom <title>) — separate from
 * Html's own head so template authors don't have to repeat the reset. */
export function Head({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

// ------------------------------------------------------------ Preview

export interface PreviewProps {
  children: string;
}

/** The preheader text inboxes show next to the subject line before the
 * message is opened. Rendered visually hidden but still in the DOM — mail
 * clients read it from the markup regardless of display:none. Pad with
 * &#8199; if your text is shorter than ~100 characters, or the client
 * falls back to visible body text after it runs out. */
export function Preview({ children }: PreviewProps) {
  return (
    <div
      style={{
        display: "none",
        overflow: "hidden",
        lineHeight: "1px",
        opacity: 0,
        maxHeight: 0,
        maxWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

// --------------------------------------------------------------- Body

export interface BodyProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Body({ style, children }: BodyProps) {
  return (
    <body style={{ backgroundColor: "#f4f4f5", margin: 0, padding: 0, ...style }}>
      {children}
    </body>
  );
}

// ---------------------------------------------------------- Container

export interface ContainerProps {
  /** px. Default 600 — the long-standing safe max width for email. */
  width?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Centers content and caps its width — the outermost table of a
 * template, sitting directly inside <Body>. */
export function Container({ width = 600, style, children }: ContainerProps) {
  return (
    <table
      role="presentation"
      align="center"
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      border={0}
      style={{ maxWidth: width, margin: "0 auto", ...style }}
    >
      <tbody>
        <tr>
          <td>{children}</td>
        </tr>
      </tbody>
    </table>
  );
}

// ------------------------------------------------------------ Section

export interface SectionProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** A padded block within the container — the usual unit templates are
 * built from (one Section per visual "card" or paragraph group). */
export function Section({ style, children }: SectionProps) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
      <tbody>
        <tr>
          <td style={{ padding: "16px 24px", ...style }}>{children}</td>
        </tr>
      </tbody>
    </table>
  );
}

// -------------------------------------------------------- Row / Column

export interface RowProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** A simple multi-column layout — table-based, since CSS flexbox/grid is
 * unreliable across mail clients. Put <Column> elements inside. */
export function Row({ style, children }: RowProps) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} style={style}>
      <tbody>
        <tr>{children}</tr>
      </tbody>
    </table>
  );
}

export interface ColumnProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Column({ style, children }: ColumnProps) {
  return (
    <td valign="top" style={style}>
      {children}
    </td>
  );
}

// ------------------------------------------------------------- Heading

export interface HeadingProps {
  /** h1-h6. Default 2. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const HEADING_SIZE: Record<NonNullable<HeadingProps["as"]>, number> = {
  h1: 32, h2: 24, h3: 20, h4: 18, h5: 16, h6: 14,
};

export function Heading({ as = "h2", style, children }: HeadingProps) {
  const Tag = as;
  return (
    <Tag
      style={{
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        fontSize: HEADING_SIZE[as],
        fontWeight: 700,
        lineHeight: 1.3,
        color: "#1a1a1a",
        margin: "0 0 16px",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// ---------------------------------------------------------------- Text

export interface TextProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Text({ style, children }: TextProps) {
  return (
    <p
      style={{
        fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
        fontSize: 15,
        lineHeight: 1.6,
        color: "#3f3f46",
        margin: "0 0 16px",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

// -------------------------------------------------------------- Button

export interface ButtonProps {
  href: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** The "bulletproof button": a table cell carrying the background color
 * (Outlook ignores background-color on <a>), with the link itself styled
 * as a block so the whole cell is clickable — no VML fallback needed as
 * long as you skip border-radius-dependent designs for Outlook users,
 * who just see square corners instead of rounded ones. */
export function Button({ href, style, children }: ButtonProps) {
  return (
    <table role="presentation" cellPadding={0} cellSpacing={0} border={0}>
      <tbody>
        <tr>
          <td
            align="center"
            style={{
              borderRadius: 6,
              backgroundColor: "#111827",
              ...style,
            }}
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: 6,
              }}
            >
              {children}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ---------------------------------------------------------------- Link

export interface LinkProps {
  href: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Link({ href, style, children }: LinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#2563eb", textDecoration: "underline", ...style }}
    >
      {children}
    </a>
  );
}

// ------------------------------------------------------------------ Hr

export function Hr({ style }: { style?: React.CSSProperties }) {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #e4e4e7",
        margin: "24px 0",
        ...style,
      }}
    />
  );
}

// ----------------------------------------------------------------- Img

export interface ImgProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export function Img({ src, alt, width, height, style }: ImgProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ display: "block", maxWidth: "100%", ...style }}
    />
  );
}
