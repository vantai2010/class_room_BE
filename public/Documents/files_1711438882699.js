
var to = 'H.Anh';
var gift_url = 'honganh.fbger.com/honganh-img.png';
var gift_image_url = 'honganh-img.png';



var nametag = document.getElementById("nametag");
var present = document.getElementById("present");
var presentImage = document.getElementById("present-image");
var card = document.getElementById("card");
// var cardImage = document.getElementById("card-img");

function init() {

    var _giftLink,
        _giftImg;

    if (gift_url) {
        _giftLink = document.createElement("a");
        _giftLink.href = gift_url;
        _giftLink.target = "_blank";
        presentImage.appendChild(_giftLink);
    }

    if (gift_image_url) {
        _giftImg = document.createElement("img");
        _giftImg.src = gift_image_url;
        if (_giftLink) {
            _giftLink.appendChild(_giftImg);
        } else {
            presentImage.appendChild(_giftImg);
        }
    }

    present.addEventListener("click", function (e) {
        // e.stopPropagation();
        if (card.classList.contains("card-show")) {
            card.classList.remove("card-show")

        } else {

            card.classList.add("card-show")
        }

        // if (cardImage.classList.contains("card-img-show")) {
        //     cardImage.classList.remove("card-img-show")

        // } else {

        //     cardImage.classList.add("card-img-show")
        // }
        present.classList.toggle("open");
    }, false);

    // present.onclick = function (e) {
    //     e.stopPropagation();
    //     present.classList.toggle("open");
    // }


    nametag.innerText = to;
}

init();

