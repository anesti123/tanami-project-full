import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  }, []);

  return { user };
};

export default useAuth;
