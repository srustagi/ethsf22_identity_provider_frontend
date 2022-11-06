import * as React from 'react'
import { useSignMessage, useAccount } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'
import axios from 'axios';
import styles from './ProveTwitter.module.css'
import addEntry from '../storage/add-entry.js'


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
  const [userState, setUserState] = React.useState(null);
 
  
  let handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    setTwitterHandle(formData.get('twitter'))
    const message = `${address} is proving their Twitter account ${formData.get('twitter')}.`
    signMessage({ message })
  }

  let handleTwitterProofSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    setTwitterProof(formData.get('tweet_proof'))
    const tweet_id = /[0-9]{19}/
    const tweet_id_match = formData.get('tweet_proof').match(tweet_id)
    axios({
      method: 'get',
      url: `https://api.twitter.com/2/tweets/${tweet_id_match[0]}`,
      responseType: 'stream',
      headers: {
        'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAAM3UiwEAAAAA9q8i8JIMtWXrri9xN%2BtcEKaVJ8A%3DRNyPbmbSiUzTLlEodHWxvnzuQBd4gZZE1h1hx9CksYMiC6zvHz`
      },
      params: {
        'user.fields': 'username',
        'expansions': 'author_id',
      }
    })
      .then(async (response) => {
        let res = JSON.parse(response.data);
        let signature_regex = /(?<=Signature:\s)0x[a-zA-Z0-9]+/;
        let regex_res = res.data.text.match(signature_regex)[0];
        let username = res.includes.users[0].username;

        let user = {twitter: {signature: regex_res, handle: username}, github: {signature: '', handle: ''}, polygon: ''}
        
        setUserState(user);
        addEntry(address, user);
      });
  }
  
  let res = (
    <div>
      <h2 className={styles.h2}>Prove your Twitter identity:</h2>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <label className={styles.twitter_label} htmlFor="twitter">Enter your Twitter handle</label>
        <input
          id="twitter"
          name="twitter"
          placeholder="your Twitter handle"
          className={styles.twitterhandle_input}
          required
        />
        <button className={styles.twitterhandle_submit} disabled={isLoading}>
          {isLoading ? 'Check Wallet' : 'Prove Twitter'}
        </button>
  
        {data && (
          <div>
            <div className={`${styles.twitter_label} ${styles.tweet_proof_label}`}>
              Please tweet the message exactly as shown below from the user you entered above.
            </div>
            <div>
              <div className={styles.twtproof}>
                Verifying myself ({recoveredAddress.current}) for Attest with Twitter handle {twitterHandle}. Signature: {data}
              </div>
              <a target="_blank" className={styles.tweet} href={
                `https://twitter.com/intent/tweet?text=Verifying myself (${recoveredAddress.current}) for Attest with Twitter handle ${twitterHandle}. Signature: ${data}`
                }>
                  Tweet Message!
              </a>
            </div>
          </div>
        )}
  
        {error && <div>{error.message}</div>}
      </form>
      {
        data && (<form
          className={styles.form}
          onSubmit={handleTwitterProofSubmit}
        >
          <label className={styles.proof_submit_label} htmlFor="tweet_proof">Enter the URL of the proof you tweeted (from above)</label>
          <input
            id="tweet_proof"
            name="tweet_proof"
            placeholder="your tweet proof"
            required
            className={styles.twitterproof_input}
          />
          <button className={styles.tweet_proof_button}>
            Verify Proof
          </button>
        </form>)
      }
      {
        userState && (
          <div>
            <h2 className={styles.result}>Successfully verified <em>@{JSON.stringify(userState.twitter.handle).replace(/"/g, '')}</em> for <em>{address}</em>&nbsp;!</h2>

          </div>
        )
      }
    </div>
  );
  return res;
}

export default ProveTwitter;
