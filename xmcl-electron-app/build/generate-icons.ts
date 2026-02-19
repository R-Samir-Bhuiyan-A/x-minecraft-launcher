
import sharp from 'sharp'
import png2icons from 'png2icons'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const iconDir = join(__dirname, '../icons')
const srcIcon = join(iconDir, 'xs.png')

async function generate() {
  console.log(`Generating icons from ${srcIcon}...`)
  const input = await readFile(srcIcon)

  // Generate ICO
  console.log('Generating dark.ico...')
  const ico = png2icons.createICO(input, png2icons.HERMITE, 0, false)
  if (ico) {
    await writeFile(join(iconDir, 'dark.ico'), ico)
    await writeFile(join(iconDir, 'light.ico'), ico) // Use same for light for now
  }

  // Generate ICNS
  console.log('Generating dark.icns...')
  const icns = png2icons.createICNS(input, png2icons.BILINEAR, 0)
  if (icns) {
    await writeFile(join(iconDir, 'dark.icns'), icns)
    await writeFile(join(iconDir, 'light.icns'), icns)
  }

  // Generate PNGs
  const sizes = [256]
  for (const size of sizes) {
    console.log(`Generating dark@${size}x${size}.png...`)
    await sharp(input)
      .resize(size, size)
      .toFile(join(iconDir, `dark@${size}x${size}.png`))
    await sharp(input)
      .resize(size, size)
      .toFile(join(iconDir, `light@${size}x${size}.png`))
  }

  // AppX Assets
  // Based on existing files in icons/ directory
  const appxAssets = [
    { name: 'dark@Square44x44Logo.png', width: 44, height: 44 },
    { name: 'dark@Square44x44Logo.targetsize-256.png', width: 256, height: 256 },
    { name: 'dark@Square44x44Logo.targetsize-256_altform-unplated.png', width: 256, height: 256 },
    { name: 'dark@Square150x150Logo.png', width: 150, height: 150 },
    { name: 'dark@Wide310x150Logo.png', width: 310, height: 150 },
    { name: 'dark@StoreLogo.png', width: 50, height: 50 }, // Standard store logo size
    { name: 'dark@SmallTile.png', width: 71, height: 71 },
    // Scaled versions (examples based on list_dir output, ideally cover all scaling factors but keeping it simple for now)
    { name: 'dark@Square150x150Logo.scale-400.png', width: 600, height: 600 },
    { name: 'dark@Wide310x150Logo.scale-400.png', width: 1240, height: 600 },
    { name: 'dark@StoreLogo.scale-400.png', width: 200, height: 200 },
    { name: 'dark@SmallTile.scale-400.png', width: 284, height: 284 },
  ]

  for (const asset of appxAssets) {
    console.log(`Generating ${asset.name}...`)
    await sharp(input)
      .resize(asset.width, asset.height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(join(iconDir, asset.name))
  }
  
  // Tray icon (small)
  console.log('Generating tray icons...')
  await sharp(input).resize(16, 16).toFile(join(iconDir, 'dark@tray.png'))
  await sharp(input).resize(16, 16).toFile(join(iconDir, 'light@tray.png'))


  console.log('Icon generation complete.')
}

generate().catch(console.error)
