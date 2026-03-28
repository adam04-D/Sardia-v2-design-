/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Gallery from './pages/Gallery';
import AuthorStudy from './pages/AuthorStudy';
import ReadingPage from './pages/ReadingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/author" element={<AuthorStudy />} />
          <Route path="/reading" element={<ReadingPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
