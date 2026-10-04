export default class TypeConverter {
    static convert(type, val) {
        if ( type === "float" ) return parseFloat(val);
        if ( type === "perlin" ) return perlin(val);
    }
}
