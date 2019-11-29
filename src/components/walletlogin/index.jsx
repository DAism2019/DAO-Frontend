import React,{ useEffect,useState,Suspense } from 'react'
import Web3ReactManager from 'Web3ReactManager'
import Web3Status from 'Web3Status'
import { useWeb3Context } from 'web3-react'
import styled from 'styled-components'
import { darken } from 'polished'
import { Spinner } from 'theme'
import Circle from 'assets/img/circle.svg'

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  margin: 2rem;
  width: 100%;
  justify-content: center;
`
const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`
const SpinnerWrapper = styled(Spinner)`
  font-size: 4rem;

  svg {
    path {
      color: ${({ theme }) => theme.uniswapPink};
    }
  }
`

const HeaderElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
`
const Title = styled.div`
  display: flex;
  align-items: center;
  #link {
    text-decoration-color: ${({ theme }) => theme.wisteriaPurple};
  }
  #title {
    display: inline;
    font-size: 1.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.wisteriaPurple};
    :hover {
      color: ${({ theme }) => darken(0.2, theme.wisteriaPurple)};
    }
  }
`

export default function UserLogin({onLogin,title}) {
    const {active,account,error} = useWeb3Context()
    const flag = active && account && (!error)
    useEffect(()=>{
      if(flag && onLogin ){
          onLogin()
      }
    },[flag,onLogin])
    const [showLoader, setShowLoader] = useState(false)
    useEffect(() => {
      const timeout = setTimeout(() => {
        setShowLoader(true)
      }, 600)
      return () => {
        clearTimeout(timeout)
      }
    }, [])
    return (<>
        <HeaderWrapper>
            <Title>
                <h1 id='title'>{title}</h1>
            </Title>
        </HeaderWrapper>
        <Suspense fallback = {null} >
          <Web3ReactManager >
              {!active && showLoader &&
                  <MessageWrapper>
                    <SpinnerWrapper src={Circle} />
                  </MessageWrapper>
              }
              {
                  active && !account &&
                  <HeaderWrapper>
                      <HeaderElement>
                       <Web3Status />
                      </HeaderElement>
                  </HeaderWrapper>
              }
          </Web3ReactManager>
        </Suspense>
   </>
   )
}
