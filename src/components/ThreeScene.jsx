/* eslint-disable */
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  Text, 
  MeshDistortMaterial,
  MeshReflectorMaterial,
  PerspectiveCamera,
  BakeShadows
} from '@react-three/drei';
import * as THREE from 'three';

const HumanModel = ({ position, color, delay = 0, checkingPhone = false, isWalking = false }) => {
  const group = useRef();
  const upperBody = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() + delay;
    
    if (isWalking) {
      group.current.position.z += Math.sin(time * 0.5) * 0.05;
      group.current.position.y = -1.8 + Math.abs(Math.sin(time * 4)) * 0.1;
    } else {
      group.current.position.y = position[1] + Math.sin(time * 0.5) * 0.02;
    }

    if (checkingPhone) {
      upperBody.current.rotation.x = 0.3 + Math.sin(time * 0.3) * 0.05;
    }
  });

  return (
    <group position={position} ref={group}>
      <group ref={upperBody}>
        {/* Torso */}
        <mesh castShadow>
          <capsuleGeometry args={[0.25, 0.6, 4, 12]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#ffe0bd" />
        </mesh>
        {/* Phone */}
        {checkingPhone && (
          <mesh position={[0, 0.4, 0.25]} rotation={[0.8, 0, 0]}>
            <boxGeometry args={[0.1, 0.18, 0.01]} />
            <meshStandardMaterial color="#222" emissive="#00ff88" emissiveIntensity={2} />
          </mesh>
        )}
      </group>
      {/* Legs */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
};

const Token = ({ position, delay }) => {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + delay;
    mesh.current.position.z -= 0.05;
    if (mesh.current.position.z < -10) mesh.current.position.z = 10;
    mesh.current.rotation.y += 0.02;
  });

  return (
    <mesh ref={mesh} position={position}>
      <torusGeometry args={[0.15, 0.04, 16, 64]} />
      <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} transparent opacity={0.6} />
    </mesh>
  );
};

const Hallway = () => {
  return (
    <group>
      {/* Walls */}
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[100, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[100, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Pillars */}
      {[ -20, -10, 0, 10, 20 ].map((z, i) => (
        <group key={i} position={[0, 3, z]}>
          <mesh position={[-9.8, 0, 0]}>
            <boxGeometry args={[0.4, 10, 0.4]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
          <mesh position={[9.8, 0, 0]}>
            <boxGeometry args={[0.4, 10, 0.4]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        </group>
      ))}

      {/* Ceiling Lights */}
      {[ -15, -5, 5, 15 ].map((z, i) => (
        <mesh key={i} position={[0, 7.9, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 0.5]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
};

const HospitalScene = () => {
  return (
    <>
      <Hallway />
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#00ff88" />
      <pointLight position={[-8, 3, 5]} intensity={1.5} color="#b53cff" />
      <spotLight position={[0, 10, 5]} angle={0.5} penumbra={1} intensity={3} color="#00d4ff" castShadow />
      
      {/* Reflector Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1.5}
          mixStrength={50}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0f172a"
          metalness={0.8}
        />
      </mesh>

      {/* Reception Desk */}
      <group position={[0, -1.5, -5]}>
        <mesh castShadow>
          <boxGeometry args={[7, 1.2, 1.8]} />
          <meshStandardMaterial color="#1e293b" roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.6, 0.9]} castShadow>
          <boxGeometry args={[7.2, 0.1, 0.2]} />
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} />
        </mesh>

        {/* Floating Holographic AI Display */}
        <Float speed={3} rotationIntensity={0.2} floatIntensity={1}>
          <group position={[0, 3, 0.5]} rotation={[-0.1, 0, 0]}>
            <mesh>
              <boxGeometry args={[4.5, 2.5, 0.05]} />
              <meshStandardMaterial color="#00d4ff" transparent opacity={0.15} emissive="#00d4ff" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, 0, -0.01]}>
               <boxGeometry args={[4.6, 2.6, 0.02]} />
               <meshStandardMaterial color="#b53cff" transparent opacity={0.3} emissive="#b53cff" emissiveIntensity={1} />
            </mesh>
            <Text position={[0, 0.6, 0.05]} fontSize={0.2} color="#ffffff" font="https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff">AI QUEUE SYSTEM</Text>
            <Text position={[0, 0, 0.05]} fontSize={0.8} color="#00ff88" font="https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff">NOW SERVING: A23</Text>
            <Text position={[0, -0.6, 0.05]} fontSize={0.2} color="#00d4ff">PEAK TRAFFIC DETECTED</Text>
          </group>
        </Float>
      </group>

      {/* Benches and Patients */}
      {[ -7, 7 ].map((x, i) => (
        <group key={i} position={[x, -1.8, -2]}>
          <mesh castShadow>
            <boxGeometry args={[3.5, 0.3, 1.2]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
             <boxGeometry args={[3.6, 0.05, 1.3]} />
             <meshStandardMaterial color="#b53cff" emissive="#b53cff" emissiveIntensity={0.5} />
          </mesh>
          <HumanModel position={[1, 0.7, 0]} color="#00ff88" checkingPhone={i === 0} delay={i} />
          <HumanModel position={[-1, 0.7, 0]} color="#00d4ff" delay={i+1} />
        </group>
      ))}

      {/* Doctor and Nurse near reception */}
      <HumanModel position={[-2, -1.8, -3]} color="#ffffff" /> {/* Doctor */}
      <HumanModel position={[2, -1.8, -3.5]} color="#b53cff" /> {/* Nurse */}

      {/* Walking Doctor */}
      <HumanModel position={[-6, -1.8, 6]} color="#00d4ff" isWalking={true} />

      {/* Dramatic Floating Tokens */}
      {[ -6, -2, 2, 6 ].map((x, i) => (
        <Token key={i} position={[x, 3, i * 2]} delay={i} />
      ))}

      <ContactShadows position={[0, -1.99, 0]} opacity={0.6} scale={50} blur={2} far={15} color="#000000" />
      <Environment preset="night" />
      <BakeShadows />
    </>
  );
};

export default function ThreeScene() {
  return (
    <div className="three-bg">
      <Canvas shadows camera={{ position: [0, 6, 18], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={['#0f172a']} />
        <HospitalScene />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2.1} 
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}


