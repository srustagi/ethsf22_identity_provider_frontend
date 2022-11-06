import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'
import { Icon } from 'semantic-ui-react'

import styles from './Header.module.css'
 
let Profile = () => {
  const { address, connector, isConnected, isConnecting } = useAccount();
  console.log(connector)
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
 
  if (isConnected && !isConnecting && connector) {
    let res = (
      <div>
        <header className={`${styles.header}`}>
          <h1>Attest</h1>
          <div className={`${styles.logged_in}`}>
            <div className={`${styles.address}`}>
              {address.substring(0, 5)}...{address.substring(address.length - 5)}
            </div>
            <button className={styles.connector_button} onClick={disconnect}>
              Disconnect
            </button>
          </div>
        </header>
        
        {error && <div>{error.message}</div>}
      </div>
    );
    return res;
  }
 
  let res = (
    <div>
      <header className={`${styles.header}`}>
        <h1>Attest</h1>
        <div>
          {connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            className={`${styles.connector_button}`}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            <div>
              {`Connect with ${connector.name}`}
            </div>
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </button>
        ))}
        </div>
      </header>
      
 
      {error && <div>{error.message}</div>}
    </div>
  );
  return res;
}

export default Profile;
