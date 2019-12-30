import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import App from '../components/App/App';



const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={App}/>
            {/* <Route exact path="/detail/:talent" component={Detail}/> */}
        </Switch>
    </HashRouter>
);

export default BasicRoute;