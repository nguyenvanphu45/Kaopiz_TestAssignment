import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";
import { ConfigProvider } from "antd";
import { LoadingFullPage } from "./components/Loading";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme";
import AppRoutes from "./pages/Routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ConfigProvider theme={theme}>
      <PersistGate persistor={persistor} loading={<LoadingFullPage />}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </ConfigProvider>
  );
}

export default App;
