// import React from 'react'
// import styled from 'styled-components'
// import { Link } from 'theme'
// import Web3Status from 'Web3Status'
// import { darken } from 'polished'
// import logo2 from "assets/img/logo1.png"
// import { isMobile } from 'react-device-detect'
//
// const HeaderElement = styled.div`
//   margin: 1.25rem;
//   display: flex;
//   min-width: 0;
// `
// const HeaderElementMobile = styled.div`
//   margin: 1.25rem;
//   ${'' /* display: flex; */}
//   min-width: 0;
// `
//
// const Title = styled.div`
//   display: flex;
//   align-items: center;
//
//   #image {
//     font-size: 1.5rem;
//     margin-right: 1rem;
//   }
//
//   #link {
//     text-decoration-color: ${({ theme }) => theme.wisteriaPurple};
//   }
//
//   #title {
//     display: inline;
//     font-size: 1.5rem;
//     font-weight: 500;
//     color: ${({ theme }) => theme.wisteriaPurple};
//     :hover {
//       color: ${({ theme }) => darken(0.2, theme.wisteriaPurple)};
//     }
//   }
// `
// const TitleMobile = styled.div`
//   display: flex;
//   align-items: center;
//
//   #image {
//     font-size: 1.5rem;
//     margin-right: 1rem;
//   }
//
//   #link {
//     text-decoration-color: ${({ theme }) => theme.wisteriaPurple};
//   }
//
//   #title {
//     display: inline;
//     font-size: 1.0rem;
//     font-weight: 400;
//     color: ${({ theme }) => theme.wisteriaPurple};
//     :hover {
//       color: ${({ theme }) => darken(0.2, theme.wisteriaPurple)};
//     }
//   }
// `
//
// export default function Header() {
//   return (
//     <>
//     {isMobile ?  <HeaderElementMobile>
//         <div>
//             <Link id="link" href="https://naturaldao.io">
//                 <img src = {logo2} alt='NaturalDAO' style={{width:120}}/>
//             </Link>
//         </div>
//        <TitleMobile>
//          {/* <span id="image" role="img" aria-label="Unicorn Emoji">
//
//          </span> */}
//          <div style={{marginLeft:10}}>
//              <h1 id="title">自然道纪念币</h1>
//          </div>
//        </TitleMobile>
//        <TitleMobile>
//            <div style={{marginLeft:10,marginTop:-5}}>
//                <h1 id="title">后台管理系统</h1>
//            </div>
//        </TitleMobile>
//      </HeaderElementMobile> :  <HeaderElement>
//        <Title>
//          <span id="image" role="img" aria-label="Unicorn Emoji">
//              <Link id="link" href="https://naturaldao.io">
//                  <img src = {logo2} alt='NaturalDAO' style={{width:120}}/>
//              </Link>
//          </span>
//          <h1 id="title">自然道纪念币后台管理系统</h1>
//        </Title>
//
//      </HeaderElement> }
//       <HeaderElement>
//         <Web3Status />
//       </HeaderElement>
//   </>
//   )
// }
