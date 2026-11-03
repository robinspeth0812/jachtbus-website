"use client";

import { useEffect, useRef } from "react";
import { AutoVelden } from "@/components/AutoVelden";
import { Formulier, Veld } from "@/components/Formulier";
import type { FormStatus } from "@/lib/formulier";
import { fotoVelden } from "@/lib/velddefs";
import { uploadFoto } from "./actions";

export function Upload() {
  return (
    <Formulier actie={uploadFoto} knop="Uploaden" plakkend={false}>
      {(s) => (
        <>
          <LeegNaUpload status={s} />
          <Veld naam="foto" label="Foto" status={s} verplicht breedte="lang" hulp="JPG, PNG, WebP of AVIF, maximaal 20 MB. Op de telefoon kun je direct een foto maken.">
            {(p) => <input {...p} type="file" accept="image/jpeg,image/png,image/webp,image/avif" />}
          </Veld>
          <AutoVelden defs={fotoVelden} status={s} />
        </>
      )}
    </Formulier>
  );
}

function LeegNaUpload({ status }: { status: FormStatus }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (status.goed) ref.current?.form?.reset();
  }, [status]);
  return <input ref={ref} type="hidden" />;
}
