import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = process.env.JZG_SOURCE ?? "F:\\JZG";
const outputRoot = path.resolve("public/media/jzg");

const landscapeAssets = [
  ["website photos/BASCOLM PALMER (1).jpg", "field-bascom-action.webp"],
  ["website photos/BASCOLM PALMER (2).jpg", "project-bascom-palmer.webp"],
  ["website photos/BASCOLM PALMER (10).jpg", "project-bascom-palmer-team.webp"],
  ["website photos/100 BISCAYNE (1).jpg", "project-100-biscayne.webp"],
  ["website photos/100 BISCAYNE (10).jpg", "division-construction.webp"],
  ["website photos/100 BISCAYNE (14).jpg", "project-100-biscayne-team.webp"],
  ["website photos/dumpster and truck (1).jpg", "division-waste.webp"],
  ["website photos/GROUP PHOTO.jpg", "group-field-team.webp"],
  ["website photos/MOB Pompano demo and framing  (10).jpg", "safety-air-control.webp"],
  ["website photos/MOB Pompano demo and framing  (11).jpg", "safety-containment.webp"],
  ["website photos/MOB Pompano demo and framing  (16).jpg", "mob-pompano-demolition.webp"],
];

const portraitAssets = [
  ["headshots/alexander.jpg", "team-alex-dearmas.webp"],
  ["headshots/chris carter.jpg", "team-chris-carter.webp"],
  ["headshots/Juan Machado.jpg", "team-juan-machado.webp"],
  ["headshots/miguel.jpg", "team-miguel-munoz.webp"],
];

await mkdir(outputRoot, { recursive: true });

for (const [source, output] of landscapeAssets) {
  await sharp(path.join(sourceRoot, source))
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(outputRoot, output));
}

for (const [source, output] of portraitAssets) {
  await sharp(path.join(sourceRoot, source))
    .rotate()
    .resize({ width: 1200, height: 1500, fit: "cover", position: "north" })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(outputRoot, output));
}

console.log(`Prepared ${landscapeAssets.length + portraitAssets.length} assets in ${outputRoot}`);
