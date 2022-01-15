import { Outlet } from "remix";

import Layout from "~/components/Layout";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export default function PageTemplate() {
  return (
    <Layout>
      <Header />
      <main className="pb-24">
        <Outlet />
      </main>
      <Footer />
    </Layout>
  );
}
