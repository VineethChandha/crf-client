import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login/Login';
import ExternalLogin from '../pages/ExternalLogin/ExternalLogin';
import ProductAdminDashboard from '../pages/ProductAdmin/Dashboard/Dashboard';
import RestaurantAdminDashboard from '../pages/ResturantAdmin/Dashboard/Dashboard';
import { ROUTES } from './RouterConfig';

const Router = () => {

    const RouteWithRole = ({ Element }) => {
        return (
          <>
            <Element/>
          </>
        );
      }

  return (
    <div>
        <Routes>
            <Route exact path={ROUTES.Home} element={<RouteWithRole Element={Login} />}></Route>
            <Route exact path={ROUTES.ExternalLogin} element={<RouteWithRole Element={ExternalLogin} />}></Route>
            <Route exact path={ROUTES.ProductAdminDashboard} element={<RouteWithRole Element={ProductAdminDashboard} />}></Route>
            <Route exact path={ROUTES.RestaurantAdminDashboard} element={<RouteWithRole Element={RestaurantAdminDashboard} />}></Route>
        </Routes>
    </div>
  )
}

export default Router