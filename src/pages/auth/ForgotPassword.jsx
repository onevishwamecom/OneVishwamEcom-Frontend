import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authSlice';

function ForgotPassword() {
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal('forgot');
    navigate('/', { replace: true });
  }, [openAuthModal, navigate]);

  return null;
}

export default ForgotPassword;
