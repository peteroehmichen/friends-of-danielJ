export default function Fader() {
    return <h1>Test</h1>;
}

// export default function Fader() {
//     startImageTransition();

//     function startImageTransition() {
//         const images = document.getElementsByClassName("slide");

//         for (let i = 0; i < images.length; ++i) {
//             images[i].style.opacity = 1;
//         }

//         let top = 1;
//         let cur = images.length - 1;

//         setInterval(changeImage, 3000);

//         async function changeImage() {
//             var nextImage = (1 + cur) % images.length;
//             images[cur].style.zIndex = top + 1;
//             images[nextImage].style.zIndex = top;
//             await transition();
//             images[cur].style.zIndex = top;
//             images[nextImage].style.zIndex = top + 1;
//             top++;
//             images[cur].style.opacity = 1;
//             cur = nextImage;
//         }

//         function transition() {
//             return new Promise(function (resolve, reject) {
//                 var del = 0.01;
//                 var id = setInterval(changeOpacity, 10);
//                 function changeOpacity() {
//                     images[cur].style.opacity -= del;
//                     if (images[cur].style.opacity <= 0) {
//                         clearInterval(id);
//                         resolve();
//                     }
//                 }
//             });
//         }
//     }

//     return (
//         <div className="fader" id="scroll-image">
//             <img
//                 src="https://media.geeksforgeeks.org/wp-content/uploads/20200318142245/CSS8.png"
//                 className="slide"
//             />
//             <img
//                 src="https://media.geeksforgeeks.org/wp-content/uploads/20200318142309/php7.png"
//                 className="slide"
//             />
//             <img
//                 src="https://media.geeksforgeeks.org/wp-content/uploads/20200318142254/html9.png"
//                 className="slide"
//             />
//         </div>
//     );
// }
