"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sphere,
  Icosahedron,
  Torus,
  Octahedron,
  Box,
} from "@react-three/drei";
import * as THREE from "three";

// ===== Mouse Tracker =====
function MouseTracker({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    mouse.current.x = state.pointer.x * 0.3;
    mouse.current.y = state.pointer.y * 0.3;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.5,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -mouse.current.y * 0.3,
        0.05
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// ===== Large Organic Blob =====
function FloatingBlob() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1.4, 64, 64]} position={[1.5, 0.2, 0]}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.35}
          speed={1.8}
          roughness={0.2}
          metalness={0.8}
          emissive="#4338ca"
          emissiveIntensity={0.15}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

// ===== Floating Geometric Shapes =====
function FloatingShape({
  position,
  shape,
  color,
  scale = 1,
  speed = 1,
  rotationIntensity = 1,
  floatIntensity = 1,
}: {
  position: [number, number, number];
  shape: "icosahedron" | "torus" | "octahedron" | "box";
  color: string;
  scale?: number;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003 * speed;
      meshRef.current.rotation.y += 0.005 * speed;
    }
  });

  const isWireframe = shape === "icosahedron" || shape === "octahedron";

  const material = (
    <MeshWobbleMaterial
      attach="material"
      color={color}
      factor={0.15}
      speed={0.8}
      roughness={0.3}
      metalness={0.7}
      transparent
      opacity={0.6}
      wireframe={isWireframe}
    />
  );

  const renderGeometry = () => {
    switch (shape) {
      case "torus":
        return <Torus ref={meshRef} args={[0.3, 0.15, 16, 32]} position={position} scale={scale}>{material}</Torus>;
      case "icosahedron":
        return <Icosahedron ref={meshRef} args={[0.4]} position={position} scale={scale}>{material}</Icosahedron>;
      case "octahedron":
        return <Octahedron ref={meshRef} args={[0.4]} position={position} scale={scale}>{material}</Octahedron>;
      case "box":
        return <Box ref={meshRef} args={[0.4, 0.4, 0.4]} position={position} scale={scale}>{material}</Box>;
    }
  };

  return (
    <Float speed={speed} rotationIntensity={rotationIntensity} floatIntensity={floatIntensity}>
      {renderGeometry()}
    </Float>
  );
}

// ===== Particle Field =====
function ParticleField({ count = 80 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#818cf8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ===== Glowing Ring =====
function GlowingRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI * 0.5 + Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={0.8} floatIntensity={0.5}>
      <Torus
        ref={ringRef}
        args={[2.2, 0.012, 16, 100]}
        position={[1.5, 0.2, -0.5]}
      >
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.8}
          transparent
          opacity={0.4}
        />
      </Torus>
    </Float>
  );
}

// ===== Hero 3D Scene =====
function HeroSceneContent() {
  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#e0e7ff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#8b5cf6" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#6366f1" />
      <pointLight position={[-3, -2, 1]} intensity={0.3} color="#06b6d4" />

      <MouseTracker>
        {/* Main blob */}
        <FloatingBlob />

        {/* Glowing orbital ring */}
        <GlowingRing />

        {/* Floating geometric shapes */}
        <FloatingShape
          position={[4, 2, -1]}
          shape="icosahedron"
          color="#8b5cf6"
          scale={0.6}
          speed={1.2}
          rotationIntensity={1.5}
          floatIntensity={2}
        />
        <FloatingShape
          position={[-3.5, -1.5, 0.5]}
          shape="octahedron"
          color="#06b6d4"
          scale={0.5}
          speed={0.8}
          rotationIntensity={1}
          floatIntensity={1.5}
        />
        <FloatingShape
          position={[3.5, -2.2, 1]}
          shape="torus"
          color="#a78bfa"
          scale={0.6}
          speed={1.5}
          rotationIntensity={2}
          floatIntensity={1}
        />
        <FloatingShape
          position={[-3.5, 2.5, -0.5]}
          shape="box"
          color="#818cf8"
          scale={0.35}
          speed={0.6}
          rotationIntensity={0.8}
          floatIntensity={1.8}
        />
        <FloatingShape
          position={[4.5, -0.5, -2]}
          shape="icosahedron"
          color="#67e8f9"
          scale={0.3}
          speed={1}
          rotationIntensity={1.2}
          floatIntensity={1.3}
        />

        {/* Particle field */}
        <ParticleField count={50} />
      </MouseTracker>
    </>
  );
}

export function HeroScene() {
  return (
    <div className="hero-3d-canvas">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <HeroSceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ===== Projects Section 3D Decoration =====
function ProjectsSceneContent() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 3, 3]} intensity={0.5} color="#e0e7ff" />
      <pointLight position={[-2, 1, 2]} intensity={0.3} color="#6366f1" />

      <MouseTracker>
        {/* Scattered smaller shapes */}
        <FloatingShape
          position={[-4, 2, -1]}
          shape="icosahedron"
          color="#6366f1"
          scale={0.5}
          speed={0.8}
          rotationIntensity={1}
          floatIntensity={1.5}
        />
        <FloatingShape
          position={[4.5, -1.5, 0]}
          shape="octahedron"
          color="#8b5cf6"
          scale={0.4}
          speed={1.2}
          rotationIntensity={1.5}
          floatIntensity={1}
        />
        <FloatingShape
          position={[-3, -2, 1]}
          shape="torus"
          color="#06b6d4"
          scale={0.6}
          speed={0.6}
          rotationIntensity={0.8}
          floatIntensity={2}
        />
        <FloatingShape
          position={[3, 2.5, -0.5]}
          shape="box"
          color="#a78bfa"
          scale={0.35}
          speed={1}
          rotationIntensity={1.2}
          floatIntensity={1.3}
        />

        <ParticleField count={40} />
      </MouseTracker>
    </>
  );
}

export function ProjectsDecoration3D() {
  return (
    <div className="projects-3d-canvas">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ProjectsSceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
