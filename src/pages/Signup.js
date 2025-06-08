import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Text, TextInput, Button } from '@tremor/react';
import { createUser } from '../utils/userSync';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      await createUser({
        email,
        password,
        first_name: email.split('@')[0], // Default to email username
        last_name: '',
        can_list_user: true, // Set initial permissions
        can_add_user: true,
        can_edit_user: true,
        can_delete_user: true,
        // Add other default permissions as needed
      });

      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-8">
        <Text className="text-2xl font-bold mb-6 text-center">Create Admin Account</Text>
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
            Create Account
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Signup; 