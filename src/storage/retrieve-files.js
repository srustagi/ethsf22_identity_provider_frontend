import { Web3Storage } from 'web3.storage'
import minimist from 'minimist'
import putFiles from './put-files'

function makeStorageClient(token) {
  return new Web3Storage({ token: token })
}
async function retrieve(cid, token) {
  const client = makeStorageClient(token)
  const res = await client.get(cid)
  console.log(`Got a response! [${res.status}] ${res.statusText}`)
  if (!res.ok) {
    throw new Error(`failed to get ${cid}`)
  }

  // request succeeded! do something with the response object here...
  return res
}

async function main() {
  const args = minimist(process.argv.slice(2))
  const token = args.token
  const res = await (retrieve(args.cid, args.token))
  const text = await (res.text())

  console.log(text)
}

main()