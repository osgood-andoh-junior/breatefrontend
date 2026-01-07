import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import breateIcon from '../assets/breate_icon.png';
import './AppLoader.css';

const AppLoader = () => {
  const [shouldHide, setShouldHide] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    // Hide loader once auth initialization is complete
    if (!loading) {
      // Delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShouldHide(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (shouldHide) {
    return null;
  }

  return (
    <div className="app-loader">
      <img src={breateIcon} alt="Breate" className="app-loader-icon" />
    </div>
  );
};

export default AppLoader;

