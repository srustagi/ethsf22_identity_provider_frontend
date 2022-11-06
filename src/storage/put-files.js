import process from 'process'
import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import addEntry from './add-entry.js'
import * as fs from 'fs'

async function main () {
  //TODO: get enviroment variables from process
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVkNEQ0ZUIxQzM2MjVEODQ5ODQ4MDcyMDE5RWYyODUxMTYyRjI2M0QiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njc2MTcyMDg1OTgsIm5hbWUiOiJldGhzZi10ZXN0In0.L1l9NFwuQMPy19ggA-K7Z-1Youzd7hR9_CnVab_slCE`

  const storage = new Web3Storage({ token })
  const files = []

  for (const path of args._) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  console.log(`Uploading ${files.length} files`)
  const cid = await storage.put(files)
  console.log('Content added with CID:', cid)
  const output = await (addEntry("hello", cid));
  return;
}

main()