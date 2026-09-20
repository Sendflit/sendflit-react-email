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
/** Renders a template element to a full HTML document string, ready to
 * pass straight into the SendFlit API's `html` field. */
export declare function render(element: React.ReactElement): string;
export interface HtmlProps {
    lang?: string;
    children?: React.ReactNode;
}
/** Root wrapper — sets the lang attribute and the meta tags every mail
 * client expects to see up front (charset, viewport, color-scheme). */
export declare function Html({ lang, children }: HtmlProps): React.JSX.Element;
/** Slot for extra <head> content (e.g. a custom <title>) — separate from
 * Html's own head so template authors don't have to repeat the reset. */
export declare function Head({ children }: {
    children?: React.ReactNode;
}): React.JSX.Element;
export interface PreviewProps {
    children: string;
}
/** The preheader text inboxes show next to the subject line before the
 * message is opened. Rendered visually hidden but still in the DOM — mail
 * clients read it from the markup regardless of display:none. Pad with
 * &#8199; if your text is shorter than ~100 characters, or the client
 * falls back to visible body text after it runs out. */
export declare function Preview({ children }: PreviewProps): React.JSX.Element;
export interface BodyProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Body({ style, children }: BodyProps): React.JSX.Element;
export interface ContainerProps {
    /** px. Default 600 — the long-standing safe max width for email. */
    width?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
/** Centers content and caps its width — the outermost table of a
 * template, sitting directly inside <Body>. */
export declare function Container({ width, style, children }: ContainerProps): React.JSX.Element;
export interface SectionProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
/** A padded block within the container — the usual unit templates are
 * built from (one Section per visual "card" or paragraph group). */
export declare function Section({ style, children }: SectionProps): React.JSX.Element;
export interface RowProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
/** A simple multi-column layout — table-based, since CSS flexbox/grid is
 * unreliable across mail clients. Put <Column> elements inside. */
export declare function Row({ style, children }: RowProps): React.JSX.Element;
export interface ColumnProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Column({ style, children }: ColumnProps): React.JSX.Element;
export interface HeadingProps {
    /** h1-h6. Default 2. */
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Heading({ as, style, children }: HeadingProps): React.JSX.Element;
export interface TextProps {
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Text({ style, children }: TextProps): React.JSX.Element;
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
export declare function Button({ href, style, children }: ButtonProps): React.JSX.Element;
export interface LinkProps {
    href: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Link({ href, style, children }: LinkProps): React.JSX.Element;
export declare function Hr({ style }: {
    style?: React.CSSProperties;
}): React.JSX.Element;
export interface ImgProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    style?: React.CSSProperties;
}
export declare function Img({ src, alt, width, height, style }: ImgProps): React.JSX.Element;
