import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Html, 
  Text, 
  Environment, 
  ContactShadows, 
  Float, 
  MeshTransmissionMaterial,
  useCursor,
  Stars
} from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Activity, User, HeartPulse, Stethoscope, AlertTriangle, ChevronRight } from 'lucide-react';

const ROOMS = {
  EXTERIOR: { cameraPos: [0, 5, 40], lookAt: [0, 0, 0] },
  RECEPTION: { cameraPos: [0, 2, 8], lookAt: [0, 1, 0] },
  WAITING: { cameraPos: [-15, 3, 5], lookAt: [-20, 1, -10] },
  DOCTOR: { cameraPos: [15, 3, 5], lookAt: [20, 1, -10] },
  EMERGENCY: { cameraPos: [0, 4, -15], lookAt: [0, 1, -30] },
};

function CameraManager({ targetRoom }) {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  const lookAtVec = new THREE.Vector3();

  useFrame((state, delta) => {
    const target = ROOMS[targetRoom];
    // Smoothly move camera
    vec.set(target.cameraPos[0], target.cameraPos[1], target.cameraPos[2]);
    camera.position.lerp(vec, delta * 2);
    
    // Smoothly rotate camera
    lookAtVec.set(target.lookAt[0], target.lookAt[1], target.lookAt[2]);
    
    // We need to lerp the lookAt. To do this, we can use a dummy object or just slerp quaternions.
    // Simpler approach: lookAt every frame but interpolate the target point.
    const currentLookAt = camera.userData.lookAt || new THREE.Vector3(0,0,0);
    currentLookAt.lerp(lookAtVec, delta * 2);
    camera.lookAt(currentLookAt);
    camera.userData.lookAt = currentLookAt;
  });
  return null;
}

const HologramButton = ({ position, text, onClick, icon: Icon, color = "#00d4ff" }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh 
          onPointerOver={() => setHovered(true)} 
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <boxGeometry args={[3, 1, 0.1]} />
          <meshStandardMaterial 
            color={hovered ? "#ffffff" : color} 
            emissive={color}
            emissiveIntensity={hovered ? 1 : 0.5}
            transparent 
            opacity={0.8} 
          />
        </mesh>
        <Html transform position={[0, 0, 0.1]} distanceFactor={2} pointerEvents="none">
          <div style={{ 
            color: 'white', 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 800, 
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textShadow: `0 0 10px ${color}`
          }}>
            {Icon && <Icon size={24} />}
            {text}
          </div>
        </Html>
      </Float>
    </group>
  );
};

const PatientAvatar = ({ position, isMoving, target, color="#ffffff" }) => {
  const ref = useRef();
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Simple bobbing animation
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4 + position[0]) * 0.1;
    
    if (isMoving && target) {
       const cur = ref.current.position;
       cur.x = THREE.MathUtils.lerp(cur.x, target[0], delta * 0.5);
       cur.z = THREE.MathUtils.lerp(cur.z, target[2], delta * 0.5);
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

const AIAssistant = () => {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    ref.current.rotation.y += 0.01;
  });

  return (
    <group ref={ref} position={[0, 2, 0]}>
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#b53cff" emissive="#b53cff" emissiveIntensity={2} wireframe />
      </mesh>
      <pointLight color="#b53cff" intensity={2} distance={5} />
      <Html position={[0, 0.6, 0]} center>
        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '10px', color: '#b53cff', fontSize: '10px', fontWeight: 'bold', border: '1px solid #b53cff' }}>
          AI Guide
        </div>
      </Html>
    </group>
  );
};

export default function HospitalScene({ currentRoom, setRoom }) {
  const isEmergency = currentRoom === 'EMERGENCY';

  return (
    <>
      <color attach="background" args={[isEmergency ? '#1a0505' : '#050a10']} />
      
      <Environment preset="city" />
      <ambientLight intensity={isEmergency ? 0.2 : 0.5} />
      <directionalLight position={[10, 20, 10]} intensity={isEmergency ? 0 : 1} castShadow />
      
      {/* Emergency Red Flashing Lights */}
      {isEmergency && (
        <pointLight color="#ff0000" intensity={5} position={[0, 5, -30]} distance={20} className="emergency-light" />
      )}

      <CameraManager targetRoom={currentRoom} />

      {/* --- EXTERIOR SCENE --- */}
      <group position={[0, -1, 20]}>
         <Text position={[0, 5, 0]} fontSize={2} color="#00d4ff" fontWeight="bold">
            NEXUS HOSPITAL
         </Text>
         {currentRoom === 'EXTERIOR' && (
           <HologramButton 
             position={[0, 2, 2]} 
             text="ENTER HOSPITAL" 
             icon={ChevronRight}
             onClick={() => setRoom('RECEPTION')} 
           />
         )}
         {/* Ambulance / Vehicles */}
         <mesh position={[-10, 1, 5]}>
            <boxGeometry args={[4, 2, 8]} />
            <meshStandardMaterial color="#ffffff" />
            <pointLight position={[0, 1, 4]} color="#ff0000" intensity={2} distance={5} />
            <pointLight position={[0, 1, -4]} color="#0000ff" intensity={2} distance={5} />
         </mesh>
      </group>

      {/* --- RECEPTION SCENE --- */}
      <group position={[0, 0, 0]}>
        {/* Reception Desk */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[6, 1.2, 2]} />
          <meshStandardMaterial 
            transparent opacity={0.6} roughness={0.1} color="#e0f7fa"
          />
        </mesh>
        
        {/* Receptionist */}
        <PatientAvatar position={[0, 0, -2]} color="#00d4ff" />

        <AIAssistant />

        {currentRoom === 'RECEPTION' && (
          <group position={[0, 2.5, 0]}>
            <HologramButton position={[-4, 0, 0]} text="WAITING AREA" icon={Activity} onClick={() => setRoom('WAITING')} color="#00ff88" />
            <HologramButton position={[0, 0, 0]} text="EMERGENCY" icon={AlertTriangle} onClick={() => setRoom('EMERGENCY')} color="#ff4d4d" />
            <HologramButton position={[4, 0, 0]} text="DOCTOR CABIN" icon={Stethoscope} onClick={() => setRoom('DOCTOR')} color="#b53cff" />
          </group>
        )}

        {/* Floating Queue Board */}
        <Float speed={1.5} floatIntensity={0.2} position={[0, 4, -2]}>
          <mesh>
            <planeGeometry args={[5, 2]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.8} />
            <Html transform position={[0, 0, 0.1]}>
               <div style={{ width: '400px', height: '160px', background: 'rgba(15,23,42,0.9)', border: '2px solid #00d4ff', borderRadius: '15px', padding: '15px', color: 'white', fontFamily: 'Inter', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: '#00d4ff', fontSize: '24px' }}>LIVE QUEUE</h3>
                  <div style={{ fontSize: '48px', fontWeight: 900 }}>Token A-42</div>
                  <div style={{ color: '#00ff88' }}>Proceed to Room 1</div>
               </div>
            </Html>
          </mesh>
        </Float>
      </group>

      {/* --- WAITING AREA SCENE --- */}
      <group position={[-20, 0, -10]}>
         {/* Benches */}
         {[0, 1, 2].map(i => (
           <mesh key={i} position={[0, 0.5, i * -3]}>
             <boxGeometry args={[5, 0.5, 1]} />
             <meshStandardMaterial color="#1e293b" />
           </mesh>
         ))}

         {/* Waiting Patients */}
         <PatientAvatar position={[-1.5, 0.5, 0]} />
         <PatientAvatar position={[1.5, 0.5, 0]} color="#a78bfa" />
         <PatientAvatar position={[0, 0.5, -3]} color="#60a5fa" />
         <PatientAvatar position={[-2, 0.5, -6]} color="#f472b6" />

         {/* Moving Patient in queue */}
         <PatientAvatar position={[3, 0, 0]} isMoving={true} target={[3, 0, -5]} color="#00ff88" />

         {currentRoom === 'WAITING' && (
           <HologramButton position={[0, 3, 2]} text="BACK TO RECEPTION" onClick={() => setRoom('RECEPTION')} color="#64748b" />
         )}

         {/* Mood / Health visualization */}
         <Html position={[0, 4, -3]} center>
           <div style={{ display: 'flex', gap: '20px' }}>
             <div style={{ background: 'rgba(0,255,136,0.2)', border: '1px solid #00ff88', padding: '10px 20px', borderRadius: '20px', color: '#00ff88', fontWeight: 'bold' }}>
               Avg Mood: Relaxed
             </div>
             <div style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid #00d4ff', padding: '10px 20px', borderRadius: '20px', color: '#00d4ff', fontWeight: 'bold' }}>
               Est Wait: 12m
             </div>
           </div>
         </Html>
      </group>

      {/* --- DOCTOR CABIN SCENE --- */}
      <group position={[20, 0, -10]}>
         {/* Cabin Walls / Glass */}
         <mesh position={[0, 2, 2]}>
            <boxGeometry args={[8, 4, 0.1]} />
            <meshStandardMaterial transparent opacity={0.5} roughness={0.2} color="#ffffff" />
         </mesh>

         {/* Doctor Desk */}
         <mesh position={[0, 1, -2]}>
            <boxGeometry args={[4, 1, 2]} />
            <meshStandardMaterial color="#0f172a" />
         </mesh>

         {/* Doctor Avatar */}
         <PatientAvatar position={[0, 0, -3]} color="#00d4ff" />
         
         {/* Patient Consulting */}
         <PatientAvatar position={[0, 0, -0.5]} color="#ffffff" />

         {/* Workload Energy Bar */}
         <Html position={[0, 4, 0]} center>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid #b53cff', padding: '15px', borderRadius: '15px', width: '200px' }}>
              <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px' }}>Dr. Sarah (Online)</div>
              <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #00d4ff, #b53cff)' }} />
              </div>
              <div style={{ color: '#a78bfa', fontSize: '12px', marginTop: '5px' }}>Energy Level: 70%</div>
            </div>
         </Html>

         {currentRoom === 'DOCTOR' && (
           <HologramButton position={[0, 1.5, 3]} text="BACK TO RECEPTION" onClick={() => setRoom('RECEPTION')} color="#64748b" />
         )}
      </group>

      {/* --- EMERGENCY SCENE --- */}
      <group position={[0, 0, -30]}>
         {/* Stretcher */}
         <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.5, 1, 3]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
         </mesh>

         {/* Medical Staff running */}
         <PatientAvatar position={[-1.5, 0, 0]} isMoving={true} target={[-1.5, 0, -5]} color="#00d4ff" />
         <PatientAvatar position={[1.5, 0, 0]} isMoving={true} target={[1.5, 0, -5]} color="#00d4ff" />

         <Html position={[0, 3, 0]} center>
            <div style={{ animation: 'pulse 1s infinite', background: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444', padding: '15px 30px', borderRadius: '10px', color: '#ffaaaa', fontWeight: 900, fontSize: '24px', textShadow: '0 0 10px red' }}>
               EMERGENCY OVERRIDE ACTIVE
               <style>
                 {`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`}
               </style>
            </div>
         </Html>

         {currentRoom === 'EMERGENCY' && (
           <HologramButton position={[0, 1.5, 5]} text="CLEAR EMERGENCY" onClick={() => setRoom('RECEPTION')} color="#10b981" />
         )}
      </group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0f18" roughness={0.1} metalness={0.8} />
      </mesh>

      <ContactShadows resolution={256} scale={50} blur={2} opacity={0.5} far={10} color="#00d4ff" />

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.0} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}
