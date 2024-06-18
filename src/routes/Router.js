import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login/Login';
import ExternalLogin from '../pages/ExternalLogin/ExternalLogin';
import ProductAdminDashboard from '../pages/ProductAdmin/Dashboard/Dashboard';
import ViewCustomer from '../pages/ResturantAdmin/ViewCustomer/ViewCustomer';
import RestaurantAdminDashboard from '../pages/ResturantAdmin/Dashboard/Dashboard';
import ViewResturants from '../pages/ProductAdmin/ViewResturants/ViewResturants';
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
            <Route exact path={ROUTES.ViewResturants} element={<RouteWithRole Element={ViewResturants} />}></Route>
            <Route exact path={ROUTES.RestaurantAdminDashboard} element={<RouteWithRole Element={RestaurantAdminDashboard} />}></Route>
            <Route exact path={ROUTES.ViewCustomer} element={<RouteWithRole Element={ViewCustomer} />}></Route>
        </Routes>
    </div>
  )
}

export default Router