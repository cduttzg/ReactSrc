export default function Map2JSONString(MapOBJ){
    let json = {};
    const it = MapOBJ.entries();
    for(let i of MapOBJ.entries()){
        json[i[0]]=i[1];
    }
    return JSON.stringify(json);
}