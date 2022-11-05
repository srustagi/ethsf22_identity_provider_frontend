import { useEnsName } from 'wagmi'
 
let ENS = ({address}) => {
  const { data, isError, isLoading } = useEnsName({address: address})
 
  if (isLoading) return <div>Fetching name…</div>
  if (isError) return <div>Error fetching name</div>
  return <div>ENS Handle: {data}</div>
}

export default ENS;