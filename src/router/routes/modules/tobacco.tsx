import { Suspense, lazy } from "react";

import { AppRouteObject } from "#/router";
import { CircleLoading } from "@/components/loading";
import { Navigate, Outlet } from "react-router-dom";
import { SvgIcon } from "@/components/icon";
// import BindQrCode from "@/pages/tobacco/bindQrCode";

const Oven = lazy(() => import('@/pages/tobacco/oven'))
const Roast = lazy(() => import('@/pages/tobacco/roast'))
const RoastReview = lazy(() => import('@/pages/tobacco/roast_review'))
const BindQrCode = lazy(() => import('@/pages/tobacco/bind_qrcode'))
const tobacco: AppRouteObject = {
  order: 11,
  path: 'tobacco',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.tobacco',
    icon: <SvgIcon icon="ic-analysis" className="ant-menu-item-icon" size="24" />,
    key: "/tobacco"
  },
  children: [
    {
      index: true,
      element: <Navigate to='oven' replace />,
    },
    {
      path: 'oven',
      element: <Oven />,
      meta: {
        label: 'sys.menu.oven',
        key: '/tobacco/oven'
      }
    },
    {
      path: 'roast',
      element: <Roast />,
      meta: {
        label: 'sys.menu.roast',
        key: '/tobacco/roast'
      }
    },
    {
      path: 'roast_review',
      element: <RoastReview />,
      meta: {
        label: 'sys.menu.roast_review',
        key: '/tobacco/roast_review'
      }
    },
    {
      path: 'bind_qrcode',
      element: <BindQrCode />,
      meta: {
        label: 'sys.menu.bind_qrcode',
        key: '/tobacco/bind_qrcode'
      }
    }
  ]
}
export default tobacco