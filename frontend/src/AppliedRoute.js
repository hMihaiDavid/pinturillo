import React from 'react';
import { Route } from 'react-router-dom';

const AppliedRoute = ({component: C, global: global, ...rest}) => 
    <Route {...rest} render={props => <C {...props} global={global} />} />


export default AppliedRoute;