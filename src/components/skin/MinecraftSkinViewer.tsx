'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SkinViewer, IdleAnimation, WalkingAnimation, RunningAnimation, WaveAnimation, FlyingAnimation } from 'skinview3d';
import { Play, Pause, RotateCw, Sparkles, UserCheck, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface MinecraftSkinViewerProps {
  skinUrl: string;
  width?: number;
  height?: number;
  className?: string;
  initialAnimation?: 'idle' | 'walk' | 'run' | 'wave' | 'fly' | 'none';
  autoRotate?: boolean;
  enableControls?: boolean;
  model?: 'default' | 'slim';
  glowColor?: string;
  showPedestal?: boolean;
}

export default function MinecraftSkinViewer({
  skinUrl,
  width = 300,
  height = 400,
  className = '',
  initialAnimation = 'idle',
  autoRotate = true,
  enableControls = true,
  model = 'default',
  glowColor = '#8b5cf6',
  showPedestal = true,
}: MinecraftSkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerRef = useRef<SkinViewer | null>(null);
  const [currentAnim, setCurrentAnim] = useState<string>(initialAnimation);
  const [isRotating, setIsRotating] = useState<boolean>(autoRotate);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    let viewer: SkinViewer;
    try {
      viewer = new SkinViewer({
        canvas: canvasRef.current,
        width: width,
        height: height,
        skin: skinUrl || '/skins/steve.png',
        model: model,
      });

      viewerRef.current = viewer;

      // Lighting configuration for dramatic esports look
      viewer.camera.position.z = 60;
      viewer.camera.position.y = -5;
      viewer.zoom = 0.95;
      viewer.autoRotate = autoRotate;
      viewer.autoRotateSpeed = 1.0;

      // Set initial animation
      applyAnimation(viewer, initialAnimation);

      setLoaded(true);
      setLoadError(false);
    } catch (err) {
      console.error('Failed to initialize 3D SkinViewer:', err);
      setLoadError(true);
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.dispose();
        } catch (e) {
          // ignore cleanup errors
        }
        viewerRef.current = null;
      }
    };
  }, [width, height, model]);

  // Handle skinUrl changes
  useEffect(() => {
    if (!viewerRef.current || !skinUrl) return;
    try {
      viewerRef.current.loadSkin(skinUrl, {
        model: model,
      }).then(() => {
        setLoadError(false);
      }).catch((e) => {
        console.warn('Failed loading skin from url, falling back to default:', e);
        // Fallback to local steve if remote fails
        if (viewerRef.current && skinUrl !== '/skins/steve.png') {
          viewerRef.current.loadSkin('/skins/steve.png');
        }
      });
    } catch (err) {
      console.warn('Skin loading exception:', err);
    }
  }, [skinUrl, model]);

  // Handle autoRotate changes
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.autoRotate = isRotating;
    }
  }, [isRotating]);

  const applyAnimation = (viewer: SkinViewer, type: string) => {
    if (!viewer) return;
    switch (type) {
      case 'idle':
        viewer.animation = new IdleAnimation();
        viewer.animation.speed = 0.8;
        break;
      case 'walk':
        viewer.animation = new WalkingAnimation();
        viewer.animation.speed = 0.9;
        break;
      case 'run':
        viewer.animation = new RunningAnimation();
        viewer.animation.speed = 1.0;
        break;
      case 'wave':
        viewer.animation = new WaveAnimation();
        viewer.animation.speed = 1.1;
        break;
      case 'fly':
        viewer.animation = new FlyingAnimation();
        viewer.animation.speed = 0.9;
        break;
      case 'none':
      default:
        viewer.animation = null;
        break;
    }
  };

  const setAnimation = (type: string) => {
    setCurrentAnim(type);
    if (viewerRef.current) {
      applyAnimation(viewerRef.current, type);
    }
  };

  const resetCamera = () => {
    if (viewerRef.current) {
      viewerRef.current.camera.position.set(0, -5, 60);
      viewerRef.current.zoom = 0.95;
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none group ${className}`}>
      {/* 3D Cyber Pedestal Glow */}
      {showPedestal && (
        <div
          className="absolute bottom-10 w-44 h-12 rounded-full pointer-events-none blur-xl opacity-60 transition-all duration-700 group-hover:opacity-90 group-hover:scale-110"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,245,255,0.4) 40%, transparent 70%)`
          }}
        />
      )}

      {/* Cyber Hologram Ring */}
      {showPedestal && (
        <div
          className="absolute bottom-12 w-36 h-8 rounded-full border border-cyan-400/30 pointer-events-none transform -rotate-12 animate-pulse-glow"
          style={{
            boxShadow: `0 0 15px ${glowColor}40`
          }}
        />
      )}

      {/* Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          className="block outline-none"
          style={{ width: `${width}px`, height: `${height}px` }}
        />

        {/* Loading Spinner / Fallback */}
        {!loaded && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">Initializing 3D Rig...</span>
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900/80 p-4 text-center">
            <span className="text-xs font-mono text-rose-400">Failed to render 3D character</span>
            <button
              onClick={() => {
                if (viewerRef.current) viewerRef.current.loadSkin('/skins/steve.png');
              }}
              className="mt-2 text-xs px-2.5 py-1 bg-rose-500/20 text-rose-300 rounded border border-rose-500/40 hover:bg-rose-500/30"
            >
              Load Default Rig
            </button>
          </div>
        )}
      </div>

      {/* Interactive Controls Overlay */}
      {enableControls && (
        <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-900/80 border border-slate-700/60 backdrop-blur-md shadow-xl text-xs text-slate-300">
          {/* Animation Modes */}
          <button
            onClick={() => setAnimation('idle')}
            className={`px-2 py-1 rounded transition-colors ${currentAnim === 'idle' ? 'bg-brand-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Idle Stance"
          >
            Idle
          </button>
          <button
            onClick={() => setAnimation('walk')}
            className={`px-2 py-1 rounded transition-colors ${currentAnim === 'walk' ? 'bg-brand-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Walking Motion"
          >
            Walk
          </button>
          <button
            onClick={() => setAnimation('run')}
            className={`px-2 py-1 rounded transition-colors ${currentAnim === 'run' ? 'bg-brand-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Running Sprint"
          >
            Run
          </button>
          <button
            onClick={() => setAnimation('wave')}
            className={`px-2 py-1 rounded transition-colors ${currentAnim === 'wave' ? 'bg-brand-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Wave Gesture"
          >
            Wave
          </button>
          <button
            onClick={() => setAnimation('none')}
            className={`px-2 py-1 rounded transition-colors ${currentAnim === 'none' ? 'bg-brand-600 text-white font-medium shadow-sm' : 'hover:bg-slate-800 text-slate-400'}`}
            title="Freeze Pose"
          >
            Pose
          </button>

          <div className="w-[1px] h-3.5 bg-slate-700 mx-1" />

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded transition-colors ${isRotating ? 'text-cyan-400 bg-cyan-400/10' : 'text-slate-400 hover:bg-slate-800'}`}
            title={isRotating ? 'Pause Orbit' : 'Enable 360° Orbit'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Reset View */}
          <button
            onClick={resetCamera}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Camera Angle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
