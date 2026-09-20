import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
// ------------------------------------------------------------- render()
/** Renders a template element to a full HTML document string, ready to
 * pass straight into the SendFlit API's `html` field. */
export function render(element) {
    return "<!doctype html>" + renderToStaticMarkup(element);
}
/** Root wrapper — sets the lang attribute and the meta tags every mail
 * client expects to see up front (charset, viewport, color-scheme). */
export function Html({ lang = "en", children }) {
    return (_jsxs("html", { lang: lang, dir: "ltr", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx("meta", { httpEquiv: "X-UA-Compatible", content: "IE=edge" }), _jsx("meta", { name: "color-scheme", content: "light" }), _jsx("meta", { name: "supported-color-schemes", content: "light" }), _jsx("style", { 
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML: {
                            __html: "body{margin:0;padding:0;width:100%!important}" +
                                "table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt}" +
                                "img{border:0;line-height:100%;outline:none;text-decoration:none}",
                        } })] }), children] }));
}
// --------------------------------------------------------------- Head
/** Slot for extra <head> content (e.g. a custom <title>) — separate from
 * Html's own head so template authors don't have to repeat the reset. */
export function Head({ children }) {
    return _jsx(_Fragment, { children: children });
}
/** The preheader text inboxes show next to the subject line before the
 * message is opened. Rendered visually hidden but still in the DOM — mail
 * clients read it from the markup regardless of display:none. Pad with
 * &#8199; if your text is shorter than ~100 characters, or the client
 * falls back to visible body text after it runs out. */
export function Preview({ children }) {
    return (_jsx("div", { style: {
            display: "none",
            overflow: "hidden",
            lineHeight: "1px",
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0,
        }, children: children }));
}
export function Body({ style, children }) {
    return (_jsx("body", { style: { backgroundColor: "#f4f4f5", margin: 0, padding: 0, ...style }, children: children }));
}
/** Centers content and caps its width — the outermost table of a
 * template, sitting directly inside <Body>. */
export function Container({ width = 600, style, children }) {
    return (_jsx("table", { role: "presentation", align: "center", width: "100%", cellPadding: 0, cellSpacing: 0, border: 0, style: { maxWidth: width, margin: "0 auto", ...style }, children: _jsx("tbody", { children: _jsx("tr", { children: _jsx("td", { children: children }) }) }) }));
}
/** A padded block within the container — the usual unit templates are
 * built from (one Section per visual "card" or paragraph group). */
export function Section({ style, children }) {
    return (_jsx("table", { role: "presentation", width: "100%", cellPadding: 0, cellSpacing: 0, border: 0, children: _jsx("tbody", { children: _jsx("tr", { children: _jsx("td", { style: { padding: "16px 24px", ...style }, children: children }) }) }) }));
}
/** A simple multi-column layout — table-based, since CSS flexbox/grid is
 * unreliable across mail clients. Put <Column> elements inside. */
export function Row({ style, children }) {
    return (_jsx("table", { role: "presentation", width: "100%", cellPadding: 0, cellSpacing: 0, border: 0, style: style, children: _jsx("tbody", { children: _jsx("tr", { children: children }) }) }));
}
export function Column({ style, children }) {
    return (_jsx("td", { valign: "top", style: style, children: children }));
}
const HEADING_SIZE = {
    h1: 32, h2: 24, h3: 20, h4: 18, h5: 16, h6: 14,
};
export function Heading({ as = "h2", style, children }) {
    const Tag = as;
    return (_jsx(Tag, { style: {
            fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
            fontSize: HEADING_SIZE[as],
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#1a1a1a",
            margin: "0 0 16px",
            ...style,
        }, children: children }));
}
export function Text({ style, children }) {
    return (_jsx("p", { style: {
            fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
            fontSize: 15,
            lineHeight: 1.6,
            color: "#3f3f46",
            margin: "0 0 16px",
            ...style,
        }, children: children }));
}
/** The "bulletproof button": a table cell carrying the background color
 * (Outlook ignores background-color on <a>), with the link itself styled
 * as a block so the whole cell is clickable — no VML fallback needed as
 * long as you skip border-radius-dependent designs for Outlook users,
 * who just see square corners instead of rounded ones. */
export function Button({ href, style, children }) {
    return (_jsx("table", { role: "presentation", cellPadding: 0, cellSpacing: 0, border: 0, children: _jsx("tbody", { children: _jsx("tr", { children: _jsx("td", { align: "center", style: {
                        borderRadius: 6,
                        backgroundColor: "#111827",
                        ...style,
                    }, children: _jsx("a", { href: href, target: "_blank", rel: "noopener noreferrer", style: {
                            display: "inline-block",
                            padding: "12px 24px",
                            fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#ffffff",
                            textDecoration: "none",
                            borderRadius: 6,
                        }, children: children }) }) }) }) }));
}
export function Link({ href, style, children }) {
    return (_jsx("a", { href: href, target: "_blank", rel: "noopener noreferrer", style: { color: "#2563eb", textDecoration: "underline", ...style }, children: children }));
}
// ------------------------------------------------------------------ Hr
export function Hr({ style }) {
    return (_jsx("hr", { style: {
            border: "none",
            borderTop: "1px solid #e4e4e7",
            margin: "24px 0",
            ...style,
        } }));
}
export function Img({ src, alt, width, height, style }) {
    return (_jsx("img", { src: src, alt: alt, width: width, height: height, style: { display: "block", maxWidth: "100%", ...style } }));
}
