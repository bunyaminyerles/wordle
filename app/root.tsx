
import styles from "./tailwind.css";
import { Logo } from "./components/Logo";
import {LinksFunction, MetaFunction} from "@remix-run/node";
import {Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return { title: "Wordle" };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="flex justify-center border-b-2 border-gray-100 p-4">
          <Link to="/">
            <Logo size="md" />
          </Link>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
