const optimiseImage = async function (sourcePath: string, outputPath: string) {
  const MAX_WIDTH = 1920;
  const QUALITY = 70;
  const stream = sharp(sourcePath);
  const info = await stream.metadata();
  let width = MAX_WIDTH;
  if (info.width && info.width < MAX_WIDTH) {
    width = info.width;
  }

  await stream.resize(width).jpeg({ quality: QUALITY }).toFile(outputPath);
};

export const optimiseImages = async function ({}) {
  const sourceDir = path.join(__dirname, "src/images");
  const staticDir = path.join(__dirname, "static/images/compressed");
  const matches = globSync(sourceDir + "/**/*.{png,jpg,jpeg}");
  const MAX_WIDTH = 1920;
  const QUALITY = 70;
  const conversions = [];
  for (const match of matches) {
    // Create the directories first syncronosly to avoid race condition
    const optimizedName = match.replace(/(\..+)$/, (match, ext) => `${ext}`);
    const optimizedPath = optimizedName.replace(sourceDir, staticDir);
    if (!fs.existsSync(path.dirname(optimizedPath))) {
      fs.mkdirSync(path.dirname(optimizedPath), { recursive: true });
    }
    conversions.push([match, optimizedPath]);
  }
  await Promise.all(
    conversions.map(([sourcePath, outputPath]) => {
      return optimiseImage(sourcePath, outputPath);
    })
  );
};
