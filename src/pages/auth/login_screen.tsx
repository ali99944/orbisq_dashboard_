// src/pages/Login.tsx (or your file path)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Using more thematic icons
import { Loader2, AlertTriangle, KeyRound, User, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loginPortal } from '../../redux/stores/auth-store';
import AppImages from '../../constants/app_images';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector(state => state.auth_store);

  // Clear manual error message when user types
  useEffect(() => {
    if (username || password) {
      setErrorMessage(null);
    }
  }, [username, password]);

  // Use error from Redux store if available after an attempt
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    try {
      await dispatch(loginPortal({ username, password })).unwrap();
      navigate('/');
    } catch (rejectedValueOrSerializedError) {
      // Error is handled by the useEffect hook listening to authError
      console.error('Login failed:', rejectedValueOrSerializedError);
    }
  };

  return (
    // Clean, minimal background
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      {/* Card: No shadow, specific border, less rounding, low padding */}
      <div className="bg-white border border-gray-300 rounded-md max-w-sm w-full">
        {/* Creative Header: Colored top border and centered content */}
        {/* Using arbitrary value for the border color */}
        <div className="border-t-4 border-[#A70000] rounded-t-md pt-6 pb-4 px-6">
          <div className="text-center">
             {/* Using arbitrary value for the icon color */}
             <img
              className="h-20 text-[#A70000] mx-auto mb-3"
              src={AppImages.logo_slogan}
             />
            <p className="mt-1 text-sm text-gray-500">لوحة تحكم الإدارة</p>
          </div>
        </div>

        {/* Form Area with low padding */}
        <div className="px-6 pb-6 pt-4">
          {/* Error Message Area (still using standard red) */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-300 text-red-700 px-3 py-2.5 rounded-md text-sm" role="alert">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="flex-grow">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Username Input with Icon */}
            <div>
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                 </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="اسم المستخدم"
                  required
                  autoComplete="username"
                  // Using arbitrary value for focus border/ring color
                  className={`block w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm transition duration-150 ease-in-out
                             focus:outline-none focus:border-[#A70000] focus:ring-1 focus:ring-[#A70000]/50
                             ${errorMessage && (errorMessage.includes('المستخدم') || errorMessage.includes('credentials')) ? 'border-red-500 focus:ring-red-500/50' : ''}
                             disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-400
                            `}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input with Icon and Toggle */}
            <div>
              <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <KeyRound className="h-4 w-4 text-gray-400" />
                 </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="كلمة المرور"
                  required
                  autoComplete="current-password"
                  // Using arbitrary value for focus border/ring color
                  className={`block w-full border border-gray-300 rounded-md pl-10 pr-10 py-2 text-sm transition duration-150 ease-in-out
                             focus:outline-none focus:border-[#A70000] focus:ring-1 focus:ring-[#A70000]/50
                             ${errorMessage && (errorMessage.includes('المرور') || errorMessage.includes('credentials')) ? 'border-red-500 focus:ring-red-500/50' : ''}
                             disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-400
                            `}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                 {/* Password Toggle Button - using arbitrary value for hover text color */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#A70000] focus:outline-none disabled:cursor-not-allowed"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                // Using arbitrary value for background and hover/focus states
                className={`w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-[#A70000]
                           hover:bg-[#A70000]/80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#A70000]
                           transition duration-150 ease-in-out
                           disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    جاري الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;