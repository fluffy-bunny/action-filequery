import * as core from '@actions/core'
import {wait} from './wait'
//import * as path from 'path'

type helloCallback = (result: string) => void
function sayHello(callback: helloCallback): void {
  callback('hi')
}

async function run(): Promise<void> {
  try {
    const fileExtensions: string = core.getInput('fileExtensions')
    const folder: string = core.getInput('folder', {required: true})
    const recursive = core.getInput('recursive') === 'true'
    const outputFile: string = core.getInput('outputFile')
    core.info(`recursive: ${recursive}`)
    core.info(`fileExtensions: ${fileExtensions}`)
    const fileExtensionsObject = JSON.parse(fileExtensions)
    for (const item of fileExtensionsObject) {
      core.info(`item: ${item}`)
    }
    core.info(`folder: ${folder}`)
    core.info(`outputFile: ${outputFile}`)

    sayHello((result: string): void => {
      core.info(`result: ${result}`)
    })

    //  const folderPath = path.dirname(folder)

    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
