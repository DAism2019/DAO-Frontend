import { useState, useMemo, useCallback, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { getWalletAdminContract,getWalletInfosContract,getTemplateOneContract } from '../utils'
// modified from https://usehooks.com/useDebounce/
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// modified from https://usehooks.com/useKeyPress/
export function useBodyKeyDown(targetKey, onKeyDown, suppressOnKeyDown = false) {
  const downHandler = useCallback(
    event => {
      const {
        target: { tagName },
        key
      } = event
      if (key === targetKey && tagName === 'BODY' && !suppressOnKeyDown) {
        event.preventDefault()
        onKeyDown()
      }
    },
    [targetKey, onKeyDown, suppressOnKeyDown]
  )

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
    }
  }, [downHandler])
}

export function useWalletAdminContract(withSignerIfPossible = true) {
  const { networkId, library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getWalletAdminContract(networkId, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [networkId, library, withSignerIfPossible, account])
}


export function useWalletInfosContract(withSignerIfPossible = true) {
  const { networkId, library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getWalletInfosContract(networkId, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [networkId, library, withSignerIfPossible, account])
}

export function useTemplateOneContract(address,withSignerIfPossible = true) {
  const { library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getTemplateOneContract(address, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [address,library, withSignerIfPossible, account])
}
