import { verifyManifest } from "../src/features/media/files.ts";
const result = verifyManifest();
if (result.errors.length) {
  console.error(result.errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Medios aprobados verificados: ${result.files}. Los slots vacíos conservan su fallback.`);
