var wasm_filename = "./main.wasm";    
function message(s){
    document.getElementById("message").textContent = s;
}



function load_wasm(){
    if (!WebAssembly.instantiateStreaming) { // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
            const source = await (await resp).arrayBuffer();
            return await WebAssembly.instantiate(source, importObject);
        };
    }

    const go = new Go();

    WebAssembly.instantiateStreaming(fetch(wasm_filename), go.importObject)
    .then(results => { go.run(results.instance); window.loaded = true })
    .catch((err) => {
        message("Error Loading WebAssembly - " + err);
        console.error(err);
//      location.reload(true);
        });
}

load_wasm();
