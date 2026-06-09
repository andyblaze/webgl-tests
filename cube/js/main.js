const net = document.getElementById("net");
const faces = document.getElementsByClassName("face");

const scale = document.getElementById("scale");
const x = document.getElementById("x");
const y = document.getElementById("y");
const rot = document.getElementById("rot");

function update() {
    const s = parseFloat(scale.value);
    const px = parseInt(x.value);
    const py = parseInt(y.value);
    const r = parseInt(rot.value) * 90;
    const w = s * 300;
    const fs = 100 * s;

    net.style.left = `${px}px`;
    net.style.top = `${py}px`;
    net.style.width = `${w}px`;
    for ( const f of faces ) {
          f.style.width = `${fs}px`; 
        f.style.height = `${fs}px`;     
    }
}

scale.oninput = update;
x.oninput = update;
y.oninput = update;
rot.oninput = update;

update();

// GO button (placeholder for PHP handoff)
document.getElementById("go").onclick = () => {
    const data = {
        scale: scale.value,
        x: x.value,
        y: y.value,
        rotationSteps: rot.value
    };

    console.log("GO payload:", data);

    alert("scale: " + scale.value + " ," +
        "x: " + x.value + " ," +
        "y: " + y.value + " ," +
        "sx: " + scale.value * x.value + " ," +
        "sy: " + scale.value * y.value 
    );
};