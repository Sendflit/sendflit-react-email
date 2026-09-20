// Renders a real template through the built package and checks the output.
import assert from "node:assert";
import { test } from "node:test";
import * as React from "react";
import {
  render, Html, Body, Container, Section, Heading, Text, Button, Link, Hr, Img, Preview,
} from "../dist/index.js";

function WelcomeEmail({ name, actionUrl }) {
  return React.createElement(Html, null,
    React.createElement(Preview, null, `Welcome, ${name} — let's get you sending`),
    React.createElement(Body, null,
      React.createElement(Container, null,
        React.createElement(Section, null,
          React.createElement(Heading, null, `Welcome, ${name}`),
          React.createElement(Text, null, "Thanks for signing up. Verify your domain to start sending."),
          React.createElement(Button, { href: actionUrl }, "Verify your domain"),
          React.createElement(Hr, null),
          React.createElement(Text, null,
            "Questions? ", React.createElement(Link, { href: "mailto:support@sendflit.com" }, "Reach out"), "."),
          React.createElement(Img, { src: "https://sendflit.com/logo.png", alt: "SendFlit", width: 120 }),
        ),
      ),
    ),
  );
}

test("renders a full HTML document", () => {
  const html = render(React.createElement(WelcomeEmail, { name: "Ada", actionUrl: "https://app.sendflit.com/domains" }));
  assert.ok(html.startsWith("<!doctype html>"));
  assert.match(html, /<html lang="en"/);
  assert.match(html, /Welcome, Ada/);
  assert.match(html, /href="https:\/\/app\.sendflit\.com\/domains"/);
  assert.match(html, /Verify your domain/);
});

test("Preview text is present but visually hidden", () => {
  const html = render(React.createElement(WelcomeEmail, { name: "Ada", actionUrl: "https://x" }));
  // React HTML-escapes the apostrophe as &#x27; — this also doubles as a
  // sanity check that Preview text goes through JSX escaping, not raw HTML.
  assert.match(html, /Welcome, Ada — let&#x27;s get you sending/);
  assert.match(html, /display:none/);
});

test("layout uses tables, not flex/grid, for Outlook compatibility", () => {
  const html = render(React.createElement(WelcomeEmail, { name: "Ada", actionUrl: "https://x" }));
  assert.match(html, /<table role="presentation"/);
  assert.doesNotMatch(html, /display:\s*flex/);
  assert.doesNotMatch(html, /display:\s*grid/);
});

test("Button renders as a table-cell-backed link, not a <button>", () => {
  const html = render(React.createElement(WelcomeEmail, { name: "Ada", actionUrl: "https://x" }));
  assert.doesNotMatch(html, /<button/);
  assert.match(html, /background-color:#111827/);
});

test("Img has safe defaults", () => {
  const html = render(React.createElement(WelcomeEmail, { name: "Ada", actionUrl: "https://x" }));
  assert.match(html, /<img src="https:\/\/sendflit\.com\/logo\.png" alt="SendFlit" width="120"/);
});
