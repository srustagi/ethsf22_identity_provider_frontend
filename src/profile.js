import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'

 import Sign from './sign'
 
export default function Profile() {
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()
 
  if (isConnected) {
    return (
      <div>
        <div>{address}</div>
        <div>Connected to {connector.name}</div>
        <button onClick={disconnect}>Disconnect</button>
        <Sign></Sign>
      </div>
    )
  }
 
  return (
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
  )
}