import { useState, FormEvent, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import MobileApp from './MobileApp';
import Services from './Services';
import Featured from './Featured';
import Guidance from './Guidance';
import Communities from './Communities';

const SignInPage = () => {
  // State for password visibility and form inputs
  const [showPassword, setShowPassword] = useState(false);
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [greeting, setGreeting] = useState('Good day');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(userid, password);
      if (success) {
        window.location.href = '/dashboard';
      } else {
        setError('Invalid User ID or password');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />

      {/* Main Content */}
      <main>
        {/* Hero Section with Sign In */}
        <motion.section
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 1 }}
                 className="py-16 relative min-h-[650px]"
                 style={{
                   backgroundImage: 'url("/images/background.jpg")',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }}>

          {/* Pattern overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            opacity: 0.2
          }}></div>

          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Sign In Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-100 backdrop-blur-sm"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{greeting}</h2>
                  <p className="text-gray-600">Sign on to manage your accounts.</p>
                </div>

                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      id="userid"
                      value={userid}
                      onChange={(e) => setUserid(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wf-red focus:border-wf-red"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-wf-red focus:ring-wf-red border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Save User ID
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-wf-red text-white py-2 px-4 rounded-md hover:bg-wf-red-dark transition-colors focus:outline-none focus:ring-2 focus:ring-wf-red focus:ring-offset-2 font-medium"
                  >
                    {isLoading ? 'Signing in...' : 'Sign On'}
                  </button>

                  <div className="pt-2 space-y-4">
                    <a href="#" className="block text-sm text-wf-red hover:underline">Forgot User ID or Password?</a>
                    <a href="#" className="block text-sm text-wf-red hover:underline">Create a User ID & Password</a>
                    <a href="#" className="block text-sm text-wf-red hover:underline">Security Center</a>
                  </div>
                </form>
              </motion.div>

              {/* Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
                className="text-center md:text-left bg-white/90 p-8 rounded-lg shadow-xl border border-gray-100 backdrop-blur-md"
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Manage your finances with ease
                </h1>
                <p className="text-xl text-gray-700 mb-6">
                  Access your accounts securely from anywhere.
                </p>
                <button className="inline-flex items-center px-6 py-3 border-2 border-wf-red text-white font-medium rounded-md bg-wf-red hover:bg-red-800 transition-all duration-300 shadow-md hover:shadow-lg">
                  Learn more
                </button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Additional Sections */}
        <Services />
        <Featured />
        <Guidance />
        <MobileApp />
        <Communities />
      </main>

      <Footer />
    </div>
  );
};

export default SignInPage;

