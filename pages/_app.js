import '../styles/globals.css'
// CONTEXT
import { AuthProvider } from "../util/context";
// COMPONENTS
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp