import Login from "../pages/Login";
import Task from "../pages/Task";
import ProtectedRoute from "../components/ProtectedRoute";



export let routerApp = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/task",
    element: (
      <ProtectedRoute>
        <Task />
      </ProtectedRoute>
    ),
  },
  
];
