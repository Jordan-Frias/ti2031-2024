import Header from './header';
import Footer from './footer';
import LoginForm from './LoginForm';

const Layout = ({ children, onLogin, user }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {user ? (
        <main className="flex-grow">{children}</main>
      ) : (
        <LoginForm onLogin={onLogin} />
      )}
      <Footer />
    </div>
  );
};

export default Layout;

