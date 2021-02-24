const db = require("./db");

module.exports.activeUsers = async function (activeSockets) {
    // const arrOfIds = Object.values(socketObj);
    // const excludedDoubles = [];
    // for (const id of arrOfIds) {
    //     if (!excludedDoubles.includes(id)) {
    //         excludedDoubles.push(id);
    //     }
    // }
    // console.log("no Doubles:", excludedDoubles);
    const newObj = {};
    const newArr = Object.entries(activeSockets);
    for (let i = 0; i < newArr.length; i++) {
        newObj[newArr[i][1]] = newArr[i][0];
    }
    const arrOfTrueIds = Object.keys(newObj);
    // console.log("obj:", newObj);
    // console.log("Arr of Id:", arrOfTrueIds);
    let data;
    try {
        const { rows } = await db.getActiveUsersByIds(arrOfTrueIds);
        data = rows;
    } catch (error) {
        console.log("caught an error:", error);
        data = {
            error: "This is a temporary Error",
        };
    }
    // console.log(results);
    // returns an object with user (img, first. last, id)
    // console.log(rows);
    return data;
};
