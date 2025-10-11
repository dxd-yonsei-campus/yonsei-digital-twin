import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { buildingLayer } from '@/store';
import { useStore } from '@nanostores/react';

const Toaster = () => {
  const $buildingLayer = useStore(buildingLayer);

  return (
    <SonnerToaster
      gap={4}
      position="bottom-left"
      offset={{
        bottom: 88,
        left: 16,
      }}
      mobileOffset={{
        bottom: $buildingLayer === 'rhino-simple' ? 164 : 88,
        left: 16,
      }}
    />
  );
};

export default Toaster;
