// modified from uniswap
// react libraries
import React, { useReducer, useEffect, useRef } from 'react'
import { useWeb3Context, Connectors } from 'web3-react'
import { Activity, ArrowRight } from 'react-feather'
import { isMobile } from 'react-device-detect'
// other libraries
import { darken, transparentize } from 'polished'
import styled from 'styled-components'
import Jazzicon from 'jazzicon'
import { ethers } from 'ethers'
import copy from 'copy-to-clipboard';
import { useTranslation } from 'react-i18next'
//custom
import { shortenAddress } from 'utils'
import { useSnackbarContext } from 'contexts/SnackBarProvider.jsx';

const { Connector } = Connectors
const NETWORK = process.env.REACT_APP_NETWORK_ID || '1'
const WIDTH = isMobile ? '88%' : '100%'

const Web3StatusGeneric = styled.button`
  ${({ theme }) => theme.flexRowNoWrap}
  width: ${WIDTH};
  font-size: 0.9rem;
  margin-top: 0.8rem;
  margin-right: 0.8rem;
  height: 2.3rem;
  align-items: left;
  padding: 0.5rem;
  border-radius: 2rem;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`

const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.salmonRed};
  color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.salmonRed};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.salmonRed)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.royalBlue};
  color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.royalBlue};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.royalBlue)};
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)`
  background-color: ${({ pending, theme }) => (pending ? theme.zumthorBlue : theme.white)};
  color: ${({ pending, theme }) => (pending ? theme.royalBlue : theme.doveGray)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.royalBlue : theme.mercuryGray)};
  font-weight: 400;
  :hover {
    background-color: ${({ pending, theme }) =>
      pending ? transparentize(0.9, theme.royalBlue) : transparentize(0.9, theme.mercuryGray)};
  }
  :focus {
    border: 1px solid
      ${({ pending, theme }) => (pending ? darken(0.1, theme.royalBlue) : darken(0.1, theme.mercuryGray))};
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  margin: 0 0.5rem 0 0.25rem;
  font-size: 0.83rem;
`

const Identicon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: ${({ theme }) => theme.silverGray};
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const ArrowIcon = styled(ArrowRight)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

const walletModalInitialState = {
  open: false,
  error: undefined
}

function getMsgByNet(t,networkId) {
    let msg = '';
    switch (networkId) {
        case "1":
            msg = 'mainnet'
            break;
        case '3':
            msg = 'ropsten'
            break;
        case '4':
            msg = 'rinkeby'
            break;
        case '5':
            msg = 'goerli'
            break;
        case '42':
            msg = 'kovan'
            break;
        default:
            msg = "others"
            break;
    }
    return t("switchNetwork") + msg
}

const WALLET_MODAL_ERROR = 'WALLET_MODAL_ERROR'
const WALLET_MODAL_OPEN = 'WALLET_MODAL_OPEN'
const WALLET_MODAL_OPEN_ERROR = 'WALLET_MODAL_OPEN_ERROR'
const WALLET_MODAL_CLOSE = 'WALLET_MODAL_CLOSE'

function walletModalReducer(state, { type, payload }) {
  switch (type) {
    case WALLET_MODAL_ERROR: {
      const { error } = payload
      return { ...state, error }
    }
    case WALLET_MODAL_OPEN: {
      return { ...state, open: true }
    }
    case WALLET_MODAL_OPEN_ERROR: {
      const { error } = payload || {}
      return { open: true, error }
    }
    case WALLET_MODAL_CLOSE: {
      return { ...state, open: false }
    }
    default: {
      throw Error(`Unexpected action type in walletModalReducer reducer: '${type}'.`)
    }
  }
}

export default function Web3Status() {
  const { active, account, connectorName, setConnector } = useWeb3Context()
  const showSnackbar = useSnackbarContext()
  const {t} = useTranslation()
  const [{ error: walletModalError }, dispatch] = useReducer(
    walletModalReducer,
    walletModalInitialState
  )
  function setError(error) {
    dispatch({ type: WALLET_MODAL_ERROR, payload: { error } })
  }

  // janky logic to detect log{ins,outs}...
  useEffect(() => {
    // if the injected connector is not active...
    const { ethereum } = window
    if (connectorName !== 'Injected') {
      if (connectorName === 'Network' && ethereum && ethereum.on && ethereum.removeListener) {
        function tryToActivateInjected() {
          const library = new ethers.providers.Web3Provider(window.ethereum)
          // if calling enable won't pop an approve modal, then try to activate injected...
          library.listAccounts().then(accounts => {
            if (accounts.length >= 1) {
              setConnector('Injected', { suppressAndThrowErrors: true })
                .then(() => {
                  setError()
                })
                .catch(error => {
                  // ...and if the error is that they're on the wrong network, display it, otherwise eat it
                  if (error.code === Connector.errorCodes.UNSUPPORTED_NETWORK) {
                    setError(error)
                  }
                })
            }
          })
        }

        ethereum.on('networkChanged', tryToActivateInjected)
        ethereum.on('accountsChanged', tryToActivateInjected)

        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener('networkChanged', tryToActivateInjected)
            ethereum.removeListener('accountsChanged', tryToActivateInjected)
          }
        }
      }
    } else {
      // ...poll to check the accounts array, and if it's ever 0 i.e. the user logged out, update the connector
      if (ethereum) {
        const accountPoll = setInterval(() => {
          const library = new ethers.providers.Web3Provider(ethereum)
          library.listAccounts().then(accounts => {
            if (accounts.length === 0) {
              setConnector('Network')
            }
          })
        }, 750)

        return () => {
          clearInterval(accountPoll)
        }
      }
    }
  }, [connectorName, setConnector])

  function onClick() {
    if (walletModalError) {
      // openWalletModal()
  } else if (connectorName === 'Network' && (window.ethereum || window.web3)) {
      setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
        if (error.code === Connector.errorCodes.UNSUPPORTED_NETWORK) {
          setError(error)
        }
      })
    } else {
        if(account){
            if(copy(account)){
                showSnackbar(t("address_copied"),'info',null)
            }
        }
    }
  }

  const ref = useRef()
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = ''
      if (account) {
        ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 8), 16)))
      }
    }
  }, [account, walletModalError])

  function getWeb3Status() {
    if (walletModalError) {
      // this is ok because we're guaranteed that the error is a wrong network error
      return (
        <Web3StatusError >
          <NetworkIcon />
          <Text>{getMsgByNet(t,NETWORK)}</Text>
        </Web3StatusError>
      )
    } else if (!account) {
      if(window.ethereum || window.web3){
          return (
             <Web3StatusConnect onClick={onClick}>
               <Text>{t("connect")}</Text>
               <ArrowIcon />
             </Web3StatusConnect>
           )
      } else{
          return (
              <Web3StatusError >
                <Text>{t('noWallet')}</Text>
              </Web3StatusError>
          )
      }

    } else {
      return (
        <Web3StatusConnected onClick={onClick}>
          <Text>{shortenAddress(account)}</Text>
          <Identicon ref={ref} />
        </Web3StatusConnected>
      )
    }
  }
  return (
    active && (
      <>
           {getWeb3Status()}
      </>

    )
  )
}
