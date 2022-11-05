import * as React from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'

let uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

let ProveTwitter = () => {
  const recoveredAddress = React.useRef('');
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    },
  });
  const [twitterHandle, setTwitterHandle] = React.useState('');
 
  
  let handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    setTwitterHandle(formData.get('twitter'))
    const message = `${address} is proving their twitter account ${formData.get('twitter')}.\n\nNonce: ${uuidv4()}`
    signMessage({ message })
  }
  
  let res = (
    <form
      onSubmit={handleSubmit}
    >
      <label htmlFor="message">Enter your twitter handle</label>
      <textarea
        id="twitter"
        name="twitter"
        placeholder="your twitter handle"
      />
      <button disabled={isLoading}>
        {isLoading ? 'Check Wallet' : 'Prove Twitter'}
      </button>
 
      {data && (
        <div>
          <div>Verifying myself ({recoveredAddress.current}) for Attest with Twitter handle {twitterHandle}. Signature: {data}</div>
          <div>
            <a href={
              `https://twitter.com/intent/tweet?text=Verifying myself (${recoveredAddress.current}) for Attest with twitter handle ${twitterHandle}. Signature: ${data}`
              }>Tweet This!</a>
          </div>
        </div>
      )}
 
      {error && <div>{error.message}</div>}
    </form>
  );
  return res;
}

export default ProveTwitter;
