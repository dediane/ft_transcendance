import React, {useEffect, useState} from 'react';
import { useWindowSize } from '@react-hook/window-size/throttled';

const Size = () => {
  const [width, height] = useWindowSize();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      Super {width}, {height}
    </div>
  );
};

export default Size;