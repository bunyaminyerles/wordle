
import { styles as buttonStyles } from "~/components/Button";
import { Illustration } from "~/components/Illustration";
import {Link} from "@remix-run/react";

export default function __index() {
  return (
    <main className="text-center flex justify-center">
      <div>
        <div className="mt-16 mb-12">
          <Illustration />
        </div>
        <Link to="/play" className={buttonStyles({ size: "lg" })}>
          Oyna!
        </Link>
      </div>
    </main>
  );
}
