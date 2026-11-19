import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProductDetail from './pages/ProductDetail';
import Sell from './pages/Sell';
import SellerStorefront from './pages/SellerStorefront';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import SellerDashboard from './pages/SellerDashboard';
import Collections from './pages/Collections';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="collections" element={<Collections />} />
        <Route path="product/:productId" element={<ProductDetail />} />
        <Route path="sell" element={<Sell />} />
        <Route path="seller/:sellerId" element={<SellerStorefront />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="account" element={<Account />} />
        <Route path="dashboard/seller" element={<SellerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
