import { useContext } from "react";
import Layout from "../components/Layout";
import Product from "../components/Product";
import { ProductsContext } from "../state/ProductsContext";

const API_URL = "http://localhost:3000";

const Home = () => {

  const {productsList, loading} = useContext(ProductsContext);

  return (
    <>
      <Layout>
        <main>
          <section className="m-4 max-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 py-4 grid-cols-3 gap-6 grid">
            {productsList &&
              productsList.length > 0 &&
              productsList.map((el) => {
                return (
                  <Product key={el.id} {...el}/>
                );
              })}
          </section>
        </main>
      </Layout>

      <footer>This is footer</footer>
    </>
  );
};

export default Home;
