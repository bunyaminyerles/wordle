
import { Button } from "../Button";
import {Form} from "@remix-run/react";

interface ResetFormProps {
  disabled: boolean;
}

export function ResetForm({ disabled }: ResetFormProps) {
  return (
    <Form method="post">
      <Button
        type="submit"
        variant="secondary"
        name="_action"
        disabled={disabled}
        value="reset"
      >
        Sıfırla
      </Button>
    </Form>
  );
}
