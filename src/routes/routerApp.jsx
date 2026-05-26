import Login from "../pages/Login";
import Task from "../pages/Task";


export let routerApp = [
  {
    path: "/",
    element: <Login />,
  },
{
    path:"/task",
    element:<Task />
},
  
];
