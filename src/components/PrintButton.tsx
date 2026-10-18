import { Button } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";
import { Mantine } from "./Mantine";

/** Wired up by the inline script on the page, as pages ship no React JavaScript */
export function PrintButton() {
  return (
    <Mantine>
      <Button
        id="print-cv"
        variant="default"
        mt="md"
        className="no-print"
        leftSection={<IconPrinter size={18} aria-hidden="true" />}
      >
        Print or save as PDF
      </Button>
    </Mantine>
  );
}
