import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'

import ENS from './ens'
import ProveTwitter from './ProveTwitter'
 
let Profile = () => {
  const { address, connector, isConnected, isConnecting } = useAccount();
  console.log(connector)
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
 
  if (isConnected && !isConnecting && connector) {
    let res = (
      <div>
        <h1>Profile</h1>
        <div className='siwe'>Signed in with <span className='connector'>{connector.name}</span></div>
        <div className='address'>Address: 0x...{address.substring(address.length - 5)}</div>
        {/* <ENS address={address} /> */}
        <button onClick={disconnect}>Disconnect</button>
        <ProveTwitter />
      </div>
    );
    return res;
  }
 
  let res = (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}
 
      {error && <div>{error.message}</div>}
    </div>
  );
  return res;
}

export default Profile;
