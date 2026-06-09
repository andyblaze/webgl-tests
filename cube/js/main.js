const net = document.getElementById("net");

const faces = document.getElementsByClassName("face");

const scale = document.getElementById("scale");
const x = document.getElementById("x");
const y = document.getElementById("y");
const rot = document.getElementById("rot");
const scaleLbl = document.getElementById(scale.dataset.lbl);
const xLbl = document.getElementById(x.dataset.lbl);
const yLbl = document.getElementById(y.dataset.lbl);
const payload = {};


function update() {
    const srcImg = document.getElementById("srcImg");
    const natW = srcImg.naturalWidth;
    const natH = srcImg.naturalHeight;
    const cliW = srcImg.clientWidth;
    const cliH = srcImg.clientHeight;
    const imgScaleX = (natW / cliW).toFixed(2);
    const imgScaleY = (natH / cliH).toFixed(2);

    const scales = document.getElementById("scales");

    const s = parseFloat(scale.value);
    const px = parseInt(x.value);
    const py = parseInt(y.value);
    const r = parseInt(rot.value) * 90;
    const w = s * 300;
    const fs = 100 * s;

    const trueX = Math.round(px * (natW / cliW));
    const trueY = Math.round(py * (natH / cliH));
    const trueFs = Math.round(fs * (natW / cliW));
    const trueNetW = Math.round(w * (natW / cliW));

    const verts = ["top", "center", "bottom", "extension"];
    const horzs = ["left", "right"];
    let left = trueX + trueFs;
    let top = trueY;

    for ( let ty = 0; ty < verts.length; ty++ )
        payload[verts[ty]] = {
            x:trueX + trueFs,
            y:trueY + (ty * trueFs),
            w:trueFs,
            h:trueFs
        };

    payload["left"] = {
        x:trueX,
        y:trueY + trueFs,
        w:trueFs,
        h:trueFs
    };

    payload["right"] = {
        x:trueX + (trueFs * 2),
        y:trueY + trueFs,
        w:trueFs,
        h:trueFs
    };

scales.innerHTML = `Nat W: ${natW} , NatH: ${natH} , CliW: ${cliW} , CliH: ${cliH} , <br> ImgScaleX: ${imgScaleX} , ImgScaleY: ${imgScaleY} , <br> True X: ${trueX} , True Y: ${trueY} , True Face Sz: ${trueFs} , <br> Net W: ${w}, True NetW: ${trueNetW}`;

    net.style.left = `${px}px`;
    net.style.top = `${py}px`; //
    net.style.width = `${w}px`; 
    for ( const f of faces ) {
        f.style.width = `${fs}px`; 
        f.style.height = `${fs}px`;     
    }
    scaleLbl.innerText = s;
    xLbl.innerText = px;
    yLbl.innerText = py;
}

scale.oninput = update;
x.oninput = update;
y.oninput = update;
rot.oninput = update;

update();

document.getElementById("go").onclick = async () =>
{
    const data = payload;

    console.log("GO payload:", data);

    try
    {
        const response = await fetch("net.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.text();

        console.log("PHP replied:", result);
    }
    catch (err)
    {
        console.error(err);
    }
};