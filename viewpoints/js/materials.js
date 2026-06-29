export default class Materials {
    static brass(three) {
        return new three.MeshStandardMaterial({
            color:0xd09a3a,
            metalness:0.93,
            roughness:0.42
        });
    }
    static coal(three) {
        return new three.MeshStandardMaterial({
            color:0x111111,
            roughness:1.0,
            metalness:0.0
        });
    }
}