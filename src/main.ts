import * as core from '@actions/core'
import {promises as fs} from 'fs'
import * as path from 'path'

type foundFile = (filePath: string) => Promise<void>

async function run(): Promise<void> {
  try {
    const fileExtensions: string = core.getInput('fileExtensions')
    const folder: string = core.getInput('folder', {required: true})
    const recursive = core.getInput('recursive') === 'true'
    const maxDept = parseInt(core.getInput('maxDepth'))
    const outputFile: string = core.getInput('outputFile')
    core.info(`recursive: ${recursive}`)
    core.info(`fileExtensions: ${fileExtensions}`)
    const fileExtensionsObject = JSON.parse(fileExtensions)
    for (const item of fileExtensionsObject) {
      core.info(`item: ${item}`)
    }
    core.info(`folder: ${folder}`)
    core.info(`outputFile: ${outputFile}`)

    await simpleFileWrite(outputFile, '')
    const onFoundFile = async (filePath: string): Promise<void> => {
      try {
        core.info(`result: ${filePath}`)
        await simpleAppend(outputFile, `\n${filePath}`)
      } catch (error) {
        throw error
      }
    }

    await queryFiles(
      folder,
      recursive,
      maxDept,
      0,
      fileExtensionsObject,
      onFoundFile
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}
async function queryFiles(
  folder: string,
  recursive: boolean,
  maxDepth: number,
  currentDepth: number,
  signtoolFileExtensions: string[],
  callback: foundFile
): Promise<void> {
  if (currentDepth >= maxDepth) {
    return
  }
  const files = await fs.readdir(folder)
  for (const file of files) {
    const fullPath = `${folder}/${file}`
    const stat = await fs.stat(fullPath)
    if (stat.isFile()) {
      const extension = path.extname(file)
      if (signtoolFileExtensions.includes(extension)) {
        await callback(fullPath)
      }
    } else if (stat.isDirectory() && recursive) {
      await queryFiles(
        fullPath,
        recursive,
        maxDepth,
        currentDepth + 1,
        signtoolFileExtensions,
        callback
      )
    }
  }
}
async function simpleFileWrite(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await fs.writeFile(filePath, content)
  } catch (err) {
    core.info(err)
  }
}
async function simpleAppend(filePath: string, content: string): Promise<void> {
  try {
    await fs.appendFile(filePath, content)
  } catch (err) {
    core.info(err)
  }
}
run()
