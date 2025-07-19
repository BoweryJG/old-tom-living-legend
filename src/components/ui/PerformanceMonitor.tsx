import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { updateMetrics, setDeviceCapabilities } from '@/store/slices/performanceSlice';

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Detect device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    dispatch(setDeviceCapabilities({
      maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048,
      webglVersion: gl ? 1 : 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      deviceMemory: (navigator as any).deviceMemory || 4,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
    }));

    // Performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();

    const measurePerformance = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        const memoryUsage = (performance as any).memory ? 
          Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0;
        
        dispatch(updateMetrics({
          fps,
          memoryUsage,
          animationFrameCount: frameCount,
        }));
        
        frameCount = 0;
        lastTime = now;
      }
      
      requestAnimationFrame(measurePerformance);
    };

    measurePerformance();
  }, [dispatch]);

  return <>{children}</>;
};