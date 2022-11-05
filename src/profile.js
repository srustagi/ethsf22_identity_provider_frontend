import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'

import Sign from './sign'
import ENS from './ens'
import ProveTwitter from './ProveTwitter'
 
let Profile = () => {
  const { address, connector, isConnected } = useAccount();
  console.log(connector)
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
 
  if (isConnected) {
    let res = (
      <div>
        <div>{address}</div>
        <ENS address={address} />
        <div>Connected to {connector.name}</div>
        <button onClick={disconnect}>Disconnect</button>
        <Sign />
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
