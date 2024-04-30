import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Components/Homepage";
import Header from "./Components/Header";
import ErrorPage from "./Components/ErrorPage";
import SearchResultsPage from "./Components/SearchResultsPage";
import Register from "./Components/Register";
import Login from "./Components/Login";
import { UserProvider } from "./context/UserContext";
import { BookingsProvider } from "./context/BookingsContext";
import BookingsPage from "./Components/Bookings";


export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, errorElement: <ErrorPage />, element: <Homepage /> },
        {
          path: "/search",
          errorElement: <ErrorPage />,
          element: <SearchResultsPage />
        },
        {
          path: "/bookings",
          errorElement: <ErrorPage />,
          element: <BookingsPage />
        },
      ]
    },

    {
      path: "/register",
      errorElement: <ErrorPage />,
      element: <Register />
    },
    {
      path: "/Login",
      errorElement: <ErrorPage />,
      element: <Login />
    }
  ]);

  return (
    <div className="App">
      <UserProvider>
        <BookingsProvider>
          <RouterProvider router={router} />
        </BookingsProvider>
      </UserProvider>
    </div>
  );
}
