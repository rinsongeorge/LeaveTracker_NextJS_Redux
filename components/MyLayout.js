import Header from './Header';
import Head from 'next/head';

const Layout = props => (
    <div className="container">
        <Head>
            <title>SIA | Leave Tracker</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta charSet="utf-8" />
        </Head>
        <Header />
        <div>{props.children}</div>
    </div>
);
  
export default Layout;

