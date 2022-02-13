const fs = require('fs')
const path = require('path')
const pug = require('pug')

const renderPug = async (filePath, outputPath) => {
  const html = pug.renderFile(filePath, { pretty: true })
  fs.writeFileSync(outputPath, html)
}

const makeDir = async (path, base) => {
  const fullPath = base ? path.join(base, path) : path

  try {
    fs.statSync(fullPath)
  } catch (_) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
}

const copyFiles = async (fromPath, toPath) => {
  await makeDir(toPath)
  const files = fs.readdirSync(fromPath)
  files.forEach(file => {
    fs.copyFileSync(path.join(fromPath, file), path.join(toPath, file))
  })
}

const build = async (base) => {
  const indexDir = path.join(base, 'index')
  await makeDir(indexDir)
  await copyFiles('css', path.join(indexDir, 'css'))
  await copyFiles(path.join('index', 'img'), path.join(indexDir, 'img'))
  await renderPug(path.join('index', 'index.pug'), path.join(indexDir, 'index.html'))

  const twoColoredRangeDir = path.join(base, 'two-colored-range')
  await copyFiles('css', path.join(twoColoredRangeDir, 'css'))
  await renderPug(path.join('two-colored-range', 'index.pug'), path.join(twoColoredRangeDir, 'index.html'))
}

build(process.argv[2] || 'build')
