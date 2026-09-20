# @sendflit/email-components — React

Email-safe React components for building SendFlit templates: table-based
layout, inline styles, the "bulletproof button" pattern — the stuff Outlook
and Gmail actually render correctly. No heavyweight rendering dependency:
`render()` is a thin wrapper over React's own `renderToStaticMarkup`.

## Install

```bash
npm install @sendflit/email-components react react-dom
```

## Usage

```tsx
import {
  render, Html, Body, Container, Section, Heading, Text, Button, Preview,
} from "@sendflit/email-components";

function WelcomeEmail({ name, actionUrl }: { name: string; actionUrl: string }) {
  return (
    <Html>
      <Preview>Welcome, {name} — let's get you sending</Preview>
      <Body>
        <Container>
          <Section>
            <Heading>Welcome, {name}</Heading>
            <Text>Thanks for signing up. Verify your domain to start sending.</Text>
            <Button href={actionUrl}>Verify your domain</Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const html = render(<WelcomeEmail name="Ada" actionUrl="https://app.sendflit.com/domains" />);
```

Send it with the [SendFlit Node SDK](../node):

```ts
import SendFlit from "@sendflit/sdk";
const sendflit = new SendFlit({ apiKey: process.env.SENDFLIT_API_KEY });

await sendflit.send({
  from: "welcome@yourdomain.com",
  to: user.email,
  subject: "Welcome aboard",
  html,
});
```

## Components

| Component | Notes |
|---|---|
| `<Html>` | Root wrapper — sets `lang`, the charset/viewport meta tags, and a small CSS reset every mail client expects. |
| `<Head>` | Slot for extra `<head>` content. |
| `<Preview>` | The preheader text inboxes show next to the subject line. Visually hidden, still read from the DOM. |
| `<Body>` | Outer wrapper. `style` prop for a background color. |
| `<Container>` | Centers content, caps width (default 600px — the standard safe email width). |
| `<Section>` | A padded block — the usual unit templates are built from. |
| `<Row>` / `<Column>` | Table-based multi-column layout (flexbox/grid are unreliable in mail clients). |
| `<Heading as="h1".."h6">` | Sized/weighted per level. |
| `<Text>` | Body paragraph. |
| `<Button href>` | The bulletproof pattern: background color on the table cell (not the `<a>`, which Outlook ignores), link styled as a block. |
| `<Link href>` | Styled inline anchor. |
| `<Hr>` | Horizontal rule. |
| `<Img src alt width height>` | Safe defaults (`display:block`, `border:0`). |

Every component accepts a `style` prop (a `React.CSSProperties` object) to
override the defaults.

## `render(element)`

Renders a template element to a complete HTML document string
(`<!doctype html>...`) — pass it straight into the SendFlit API's `html`
field, a template's `html` when creating one via `POST /v1/templates`, or
anywhere else a rendered string is expected.

## Next.js integration

A typical setup: templates live as components, an API route (or Server
Action) renders one and calls the SendFlit API.

```tsx
// app/emails/welcome.tsx
import { Html, Body, Container, Section, Heading, Text, Button, Preview } from "@sendflit/email-components";

export function WelcomeEmail({ name, actionUrl }: { name: string; actionUrl: string }) {
  return (
    <Html>
      <Preview>Welcome, {name}</Preview>
      <Body>
        <Container>
          <Section>
            <Heading>Welcome, {name}</Heading>
            <Text>Thanks for signing up.</Text>
            <Button href={actionUrl}>Get started</Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

```ts
// app/api/welcome/route.ts
import { NextRequest, NextResponse } from "next/server";
import { render } from "@sendflit/email-components";
import SendFlit from "@sendflit/sdk";
import { WelcomeEmail } from "@/app/emails/welcome";

const sendflit = new SendFlit({ apiKey: process.env.SENDFLIT_API_KEY! });

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  const html = render(<WelcomeEmail name={name} actionUrl="https://app.example.com/start" />);

  // Idempotency-Key: safe to retry this route without risking a duplicate
  // send, e.g. if a client-side fetch times out and your UI retries.
  await sendflit.send(
    { from: "welcome@yourdomain.com", to: email, subject: "Welcome aboard", html },
    `welcome-${email}`,
  );

  return NextResponse.json({ ok: true });
}
```

`render()` runs server-side only (it imports `react-dom/server`) — call it
from a Route Handler, Server Action, or any other server context, never
from a Client Component.

### Previewing templates while you build them

There's no dev-server preview tool bundled here (deliberately — this
package stays dependency-light). The fastest local loop: a small script
that renders a template and writes it to a file, then open that file in a
browser:

```ts
// scripts/preview-email.tsx
import { writeFileSync } from "node:fs";
import { render } from "@sendflit/email-components";
import { WelcomeEmail } from "../app/emails/welcome";

writeFileSync("preview.html", render(<WelcomeEmail name="Ada" actionUrl="https://example.com" />));
```

```bash
npx tsx scripts/preview-email.tsx && open preview.html
```

## Design constraints (why the components look like this)

Email HTML rendering is still, in 2026, closer to HTML from 2005 than to
the modern web — this is why every component here is table-based with
inline styles rather than using flexbox, grid, or a `<style>` block for
layout:

- **Outlook (desktop)** renders with Word's HTML engine, not a browser
  engine. It ignores `display: flex`/`grid` entirely, ignores
  `background-color` on `<a>` tags, and only respects `border-radius` on
  some builds.
- **Gmail** strips `<style>` blocks in some contexts and rewrites CSS
  classes, so styling has to be inline to be reliable.
- Tables (`role="presentation"`, `cellPadding`/`cellSpacing`/`border` all
  zeroed) are the one layout primitive every client renders consistently.

If you never touch a `style` prop, everything you build with these
components already follows that constraint set.

MIT © SendFlit
