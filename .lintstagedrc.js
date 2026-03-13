import path from "path";

function toForwardSlash(p) {
  return p.split(path.sep).join("/");
}

export default {
  "backend/**/*.js": (filenames) => {
    const backendDir = toForwardSlash(
      path.join(process.cwd(), "backend"),
    );
    const files = filenames
      .map((f) => path.relative(path.join(process.cwd(), "backend"), f))
      .map((f) => `"${toForwardSlash(f)}"`)
      .join(" ");
    return [
      `cd "${backendDir}" && npx eslint --fix ${files}`,
      `cd "${backendDir}" && npx prettier --write ${files}`,
    ];
  },
  "frontend/**/*.{ts,tsx}": (filenames) => {
    const frontendDir = toForwardSlash(
      path.join(process.cwd(), "frontend"),
    );
    const files = filenames
      .map((f) => path.relative(path.join(process.cwd(), "frontend"), f))
      .map((f) => `"${toForwardSlash(f)}"`)
      .join(" ");
    return [
      `cd "${frontendDir}" && npx eslint --fix ${files}`,
      `cd "${frontendDir}" && npx prettier --write ${files}`,
    ];
  },
  "frontend/**/*.css": (filenames) => {
    const frontendDir = toForwardSlash(
      path.join(process.cwd(), "frontend"),
    );
    const files = filenames
      .map((f) => path.relative(path.join(process.cwd(), "frontend"), f))
      .map((f) => `"${toForwardSlash(f)}"`)
      .join(" ");
    return [`cd "${frontendDir}" && npx prettier --write ${files}`];
  },
};
