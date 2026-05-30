import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import ProductsPage from "./features/products/pages/ProductsPage";
import ProductViewPage from "./features/products/pages/ProductViewPage";
import MaterialsPage from "./features/materials/pages/MaterialsPage";
import InvoicesPage from "./features/invoices/pages/InvoicesPage";
import InvoiceViewPage from "./features/invoices/pages/InvoiceViewPage";
import CustomersPage from "./features/customers/pages/CustomersPage";
import CustomerViewPage from "./features/customers/pages/CustomerViewPage";
import UsersPage from "./features/users/pages/UsersPage";
import UserViewPage from "./features/users/pages/UserViewPage";
import DepartmentsPage from "./features/departments/pages/DepartmentsPage";
import DepartmentViewPage from "./features/departments/pages/DepartmentViewPage";
import DesignationsPage from "./features/designations/pages/DesignationsPage";
import DesignationViewPage from "./features/designations/pages/DesignationViewPage";
import MaterialViewPage from "./features/materials/pages/MaterialViewPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename="/demo-erp">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductViewPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/materials/:id" element={<MaterialViewPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:id" element={<CustomerViewPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/:id" element={<InvoiceViewPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:id" element={<UserViewPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/departments/:id" element={<DepartmentViewPage />} />
              <Route path="/designations" element={<DesignationsPage />} />
              <Route path="/designations/:id" element={<DesignationViewPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
