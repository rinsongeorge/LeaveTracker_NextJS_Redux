import Header from './LoginHeader';
import Head from 'next/head';

const LoginLayout = props => (
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
  
export default LoginLayout;

