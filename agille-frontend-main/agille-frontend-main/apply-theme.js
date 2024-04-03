const fs = require('fs')

const themes = ['agille', 'agiprev', 'itr']
const themeName = process.argv[2]
if (!themes.includes(themeName)) {
  throw new Error(`Theme ${themeName} does not exist`)
}

function copy(source, destination) {
  fs.copyFile(source, destination, (err) => {
    if (err) throw err
    console.log(`file ${source} was copied to ${destination}`)
  })
}
const themeVariablesFile = `src/_metronic/assets/sass/components/_variables.custom.${themeName}.scss`
const variablesDestinationFile = 'src/_metronic/assets/sass/components/_variables.custom.scss'
copy(themeVariablesFile, variablesDestinationFile)
// Login Logo
copy(
  `public/media/illustrations/custom/logoAgille.${themeName}.png`,
  `public/media/illustrations/custom/logoAgille.png`
)
// Login Background (gradient)
copy(`public/media/misc/gradiente.${themeName}.png`, `public/media/misc/gradiente.png`)
