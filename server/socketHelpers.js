const db = require("./db");

module.exports.activeUsers = async function (socketObj) {
    // const arrOfIds = Object.values(socketObj);
    // const excludedDoubles = [];
    // for (const id of arrOfIds) {
    //     if (!excludedDoubles.includes(id)) {
    //         excludedDoubles.push(id);
    //     }
    // }
    // console.log("no Doubles:", excludedDoubles);
    const newObj = {};
    const newArr = Object.entries(socketObj);
    for (let i = 0; i < newArr.length; i++) {
        newObj[newArr[i][1]] = newArr[i][0];
    }
    const arrOfTrueIds = Object.keys(newObj);
    // console.log("obj:", newObj);
    // console.log("Arr of Id:", arrOfTrueIds);
    const { rows } = await db.getActiveUsersByIds(arrOfTrueIds);
    // console.log(results);
    // returns an object with user (img, first. last, id)
    // console.log(rows);
    return rows;
};
