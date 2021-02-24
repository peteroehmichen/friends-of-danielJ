// let text = "InThis is a test to fiNd and display the matching patterns";
// let tag = "in";
// let regex = new RegExp(tag, "gi");
// let one = text.slice(0, text.search(regex));
// let elem = text.substr(text.search(regex), tag.length);
// let rest = text.slice(text.search(regex) + tag.length);
// console.log(text.search(regex));
// console.log(one);
// console.log(elem);
// console.log(rest);

const arr = [
    {
        id: 67,
        response_to: 66,
        text: "answer to answer",
        created_at: "2021-02-23T21:15:22.425Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 68,
        response_to: 66,
        text: "AnsewreD!",
        created_at: "2021-02-24T07:20:55.514Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 69,
        response_to: 0,
        text:
            "Love could please even the most demanding follower of Freud. Love could please even the most demanding follower of Freud.",
        created_at: "2021-02-24T07:31:45.651Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 70,
        response_to: 0,
        text: "Love could please even the most demanding follower of Freud.",
        created_at: "2021-02-24T07:37:12.431Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 71,
        response_to: 0,
        text: "hdjashds",
        created_at: "2021-02-24T09:10:53.213Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 72,
        response_to: 0,
        text: "ghh",
        created_at: "2021-02-24T09:14:16.551Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 73,
        response_to: 0,
        text: "gdfgs",
        created_at: "2021-02-24T09:14:23.249Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 74,
        response_to: 0,
        text: "gdgsdg",
        created_at: "2021-02-24T09:14:24.583Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 79,
        response_to: 0,
        text: "Testing",
        created_at: "2021-02-24T11:04:09.358Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
    {
        id: 80,
        response_to: 0,
        text: "Test again",
        created_at: "2021-02-24T11:05:44.835Z",
        first: "Peter",
        last: "Oehmichen",
        profile_pic_url:
            "https://s3.amazonaws.com/oehmichen-messageboard/TFcY0tNKgaPOgbW6oLacA0HzURfqsOl0.JPG",
    },
];

let startArray = arr.slice();
let endArray = [];
let i, j;
let temp;
let indent = 0;
for (i = 0; i < startArray.length; i++) {
    if (startArray[i].response_to == 0) {
        // console.log("running", i);
        startArray[i].indent = indent;
        endArray.push(startArray[i]);
        startArray.splice(i, 1);
        i--;
    }
}
// startArray = startArray.filter((msg) => msg.response_to != 0);

// while (startArray.length > 0) {
//     indent++;
for (i = 0; i < endArray.length; i++) {
    for (j = 0; j < startArray.length; j++) {
        console.log(i, j);
        if (
            endArray[i].indent == indent - 1 &&
            endArray[i].id == startArray[j].response_to
        ) {
            startArray[j].indent = indent;
            temp = startArray[j];
            startArray.splice(j, 1);
            j--;
            endArray.splice(i + 1, 0, temp);
        }
    }
}
// }

//     console.log("indent", indent);
//     console.log("start:", startArray.length);
//     console.log("end:", endArray.length);
//     for (let i = 0; i < endArray.length; i++) {
//         for (let j = 0; j < startArray.length; j++) {
//             console.log(startArray.length, endArray.length);
//         }
//     }
console.log("startArray:", startArray);
console.log("end Array:", endArray);

/*

*/
