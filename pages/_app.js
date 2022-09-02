import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import App from 'next/app';
import {Provider} from 'react-redux';
import withRedux from "next-redux-wrapper";
import store from '../redux/store';


//NProgress.configure({ easing: 'ease', speed: 1000 }); 
NProgress.configure({ trickleSpeed: 200 });

Router.onRouteChangeStart = () => {
  //console.log('onRouteChnageStart triggered');
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  //console.log('onRouteChnageComplete triggered');
  NProgress.done();
};

Router.onRouteChangeError = () => {
  //console.log('onRouteChnageError triggered');
  NProgress.done();
};

class MyApp extends App {

  static async getInitialProps({Component, ctx}) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return {pageProps: pageProps};
  }

  render() {
    const {Component, pageProps, store} = this.props;
    return (
        <Provider store={store}>
            <Component {...pageProps}/>
        </Provider>
    );
  }

}

const makeStore = () => store;

export default withRedux(makeStore)(MyApp);