import {ethers} from 'ethers'
import WALLET_ADMIN_ABI from 'constants/abis/WalletAdmin'
import WALLET_INFOS_ABI from 'constants/abis/WalletInfos'
import TEMPLATE_ONE_ABI from 'constants/abis/WalletTemplateOne'
import {WALLET_ADMIN_ADDRESS, WALLET_INFOS_ADDRESS} from '../constants'
import UncheckedJsonRpcSigner from './signer'

export function safeAccess(object, path) {
    return object
        ? path.reduce((accumulator, currentValue) => (
            accumulator && accumulator[currentValue]
            ? accumulator[currentValue]
            : null), object)
        : null
}

export const NETWORK_NAME = {
    1: 'mainnet',
    3: "ropsten",
    4: "rinkeby",
    5: "goerli",
    42: 'kovan',
    5777: "ganache"
}

const ETHERSCAN_PREFIXES = {
    1: '',
    3: 'ropsten.',
    4: 'rinkeby.',
    5: 'goerli.',
    42: 'kovan.'
}

export function getEtherscanLink(networkId, data, type) {
    const prefix = `https://${ETHERSCAN_PREFIXES[networkId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

    switch (type) {
        case 'transaction':
            {
                return `${prefix}/tx/${data}`
            }
        case 'address':
        default:
            {
                return `${prefix}/address/${data}`
            }
    }
}

export function getNetworkName(networkId) {
    switch (networkId) {
        case 1:
            {
                return 'the Main Ethereum Network'
            }
        case 3:
            {
                return 'the Ropsten Test Network'
            }
        case 4:
            {
                return 'the Rinkeby Test Network'
            }
        case 5:
            {
                return 'the Görli Test Network'
            }
        case 42:
            {
                return 'the Kovan Test Network'
            }
        case 5777:
            {
                return 'the ganache'
            }
        default:
            {
                return 'the correct network'
            }
    }
}

export function shortenAddress(address, digits = 4) {
    if (!isAddress(address)) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`
}

export function shortenTransactionHash(hash, digits = 4) {
    return `${hash.substring(0, digits + 2)}...${hash.substring(66 - digits)}`
}

export function isAddress(value) {
    try {
        return ethers.utils.getAddress(value.toLowerCase())
    } catch  {
        return false
    }
}

export function calculateGasMargin(value, margin) {
    const offset = value.mul(margin).div(ethers.utils.bigNumberify(10000))
    return value.add(offset)
}

// account is optional
export function getProviderOrSigner(library, account) {
    return account
        ? new UncheckedJsonRpcSigner(library.getSigner(account))
        : library
}

// account is optional
export function getContract(address, abi, library, account) {
    if (!isAddress(address) || address === ethers.constants.AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return new ethers.Contract(address, abi, getProviderOrSigner(library, account))
}

export function getWalletAdminContract(networkId, library, account) {
    return getContract(WALLET_ADMIN_ADDRESS[networkId], WALLET_ADMIN_ABI, library, account)
}

export function getWalletInfosContract(networkId, library, account) {
    return getContract(WALLET_INFOS_ADDRESS[networkId], WALLET_INFOS_ABI, library, account)
}

export function getTemplateOneContract(address, library, account) {
    return getContract(address, TEMPLATE_ONE_ABI, library, account)
}

export function getPathBase() {
    return process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_PATH_BASE
        : ''
}

export function convertTimetoTimeString(_times) {
    let now = new Date(_times),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
    return y + "-" + (
        m < 10
        ? "0" + m
        : m) + "-" + (
        d < 10
        ? "0" + d
        : d) + " " + now.toTimeString().substr(0, 8);
}

export function getIndexArray(amount, pagesize, _offset) {
    let result = []
    let start = _offset
    if (start > amount - 1) {
        return result
    }
    let end = _offset + pagesize - 1
    if (end > amount - 1)
        end = amount - 1
    for (let i = start; i <= end; i++)
        result.push(i)
    return result
}

export function getIndexArrayReverse(amount, pagesize, offset) {
    let start = amount - offset - 1
    if (start < 0)
        return []
    let end = start - pagesize + 1
    if (end <= 0)
        end = 0
    let result = []
    for (let i = start; i >= end; i--) {
        result.push(i)
    }
    return result
}
