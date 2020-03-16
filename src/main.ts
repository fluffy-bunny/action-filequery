import * as core from '@actions/core'
import {wait} from './wait'

async function run(): Promise<void> {
  try {
    const fileExtensions: string = core.getInput('fileExtensions')
    const folder: string = core.getInput('folder')
    const outputFile: string = core.getInput('outputFile')

    core.info(`fileExtensions: ${fileExtensions}`)
    const fileExtensionsObject = JSON.parse(fileExtensions)
    for (const item of fileExtensionsObject) {
      core.info(`item: ${item}`)
    }
    core.info(`folder: ${folder}`)
    core.info(`outputFile: ${outputFile}`)

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
