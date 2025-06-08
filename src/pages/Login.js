import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, Text, TextInput, Button } from '@tremor/react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const { error } = await signIn({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-8">
        <Text className="text-2xl font-bold mb-6 text-center">Login to Manukora</Text>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Text className="font-medium mb-1">Email</Text>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <Text className="font-medium mb-1">Password</Text>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <Text className="text-red-500">{error}</Text>}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full bg-[#FFD86B] text-black font-semibold hover:bg-[#ffe9a7]"
          >
            Login
          </Button>
          <div className="text-center">
            <Text className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#FFD86B] hover:text-[#ffe9a7] font-medium">
                Create one
              </Link>
            </Text>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Login; 