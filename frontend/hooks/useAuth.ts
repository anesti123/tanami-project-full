import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Implement your auth logic here.
    // For instance, check localStorage for a token, decode it, and set the user.
  }, []);

  return { user };
};

export default useAuth;
