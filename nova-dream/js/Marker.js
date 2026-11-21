import * as THREE from 'three';
import { markerShader } from './shaders/marker.js';

export default class Marker {
    static create() {
        const markerGeometry = new THREE.SphereGeometry(0.055, 16, 16);

        const markerCoreMaterial = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 } },
            vertexShader: markerShader.vertex,
            fragmentShader: markerShader.fragment,
            toneMapped: false
        });
        // Marker group
        const marker = new THREE.Group();

        const markerCore = new THREE.Mesh(
            markerGeometry,
            markerCoreMaterial
        );

        marker.add(markerCore);
        return marker;        
    }
}
