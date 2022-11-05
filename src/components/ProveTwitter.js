import * as React from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'
import axios from 'axios';
import styles from './ProveTwitter.module.css'

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
  const [twitterProof, setTwitterProof] = React.useState('');
 
  
  let handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    setTwitterHandle(formData.get('twitter'))
    const message = `${address} is proving their Twitter account ${formData.get('twitter')}.`
    signMessage({ message })
  }

  let handleProofSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    setTwitterProof(formData.get('tweet_proof'))
    console.log(twitterProof)
    const tweet_id = /[0-9]{19}/
    const tweet_id_match = twitterProof.match(tweet_id)
    console.log(tweet_id_match[0])
    console.log(process.env)
    axios({
      method: 'get',
      url: `https://api.twitter.com/2/tweets/${tweet_id_match[0]}`,
      responseType: 'stream',
      headers: {
        'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAAM3UiwEAAAAA9q8i8JIMtWXrri9xN%2BtcEKaVJ8A%3DRNyPbmbSiUzTLlEodHWxvnzuQBd4gZZE1h1hx9CksYMiC6zvHz`
      },
    })
      .then(function (response) {
        let res = JSON.parse(response.data)
        let signature_regex = /(?<=Signature:\s)0x[a-zA-Z0-9]+/
        let regex_res = res.data.text.match(signature_regex)[0]
        console.log(regex_res)
      });
  }
  
  let res = (
    <div>
      <h1>Prove Twitter</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <label htmlFor="twitter">Enter your Twitter handle</label>
        <input
          id="twitter"
          name="twitter"
          placeholder="your Twitter handle"
          required
        />
        <button disabled={isLoading}>
          {isLoading ? 'Check Wallet' : 'Prove Twitter'}
        </button>
  
        {data && (
          <div className={styles.result}>
            <div className={styles.twtproof}>Verifying myself ({recoveredAddress.current}) for Attest with Twitter handle {twitterHandle}. Signature: {data}</div>
            <div>
              <a attribute="_blank" className={styles.tweet} href={
                `https://twitter.com/intent/tweet?text=Verifying myself (${recoveredAddress.current}) for Attest with Twitter handle ${twitterHandle}. Signature: ${data}`
                }>Tweet This!</a>
            </div>
          </div>
        )}
  
        {error && <div>{error.message}</div>}
      </form>
      <form
        className={styles.form}
        onSubmit={handleProofSubmit}
      >
        <label htmlFor="tweet_proof">Enter your tweet proof URL</label>
        <input
          id="tweet_proof"
          name="tweet_proof"
          placeholder="your tweet proof"
          required
        />
        <button>
          Verify Proof
        </button>
      </form>
    </div>
  );
  return res;
}

export default ProveTwitter;