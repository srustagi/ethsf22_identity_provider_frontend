import {useAccount} from 'wagmi'

import styles from './profile.module.css'
import ProveTwitter from './ProveTwitter'
 
let Profile = () => {
  const { address, connector, isConnected, isConnecting } = useAccount();
  console.log(connector)
 
  if (isConnected && !isConnecting && connector) {
    let res = (
      <div className={styles.profile_wrapper}>
        <ProveTwitter />
      </div>
    );
    return res;
  }
}

export default Profile;
