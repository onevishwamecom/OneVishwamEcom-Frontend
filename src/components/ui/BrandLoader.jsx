import React from 'react';
import { useLottie } from 'lottie-react';
import loaderAnimation from '../../assets/loaderAnimation.json';
import logo from '../../assets/logo.png';

function BrandLoader() {
  const options = {
    animationData: loaderAnimation,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-10">
      <div className="w-36 h-36 flex items-center justify-center">
        {View}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <img src={logo} alt="OneVishwam Logo" className="h-6 w-auto object-contain" />
        <span className="text-sm font-bold text-brand-blue uppercase tracking-wider">
          Loading OneVishwam...
        </span>
      </div>
    </div>
  );
}

export default BrandLoader;
