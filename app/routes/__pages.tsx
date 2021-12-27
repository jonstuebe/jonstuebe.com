import { Outlet } from "remix";

import Layout from "~/components/Layout";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export default function PageTemplate() {
  return (
    <Layout>
      <Header />
      <main className="pb-24">
        <div className="prose prose-dark lg:prose-xl w-full lg:max-w-4xl m-auto mb-32 motion-safe:animate-fade-in-slow">
          <Outlet />
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
