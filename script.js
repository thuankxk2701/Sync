'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const renderCountry = function (data, className = '') {
  const html = ` <article class="country ${className}">
  <img class="country__img" src="${data[0].flag}" />
  <div class="country__data">
    <h3 class="country__name">${data[0].name}</h3>
    <h4 class="country__region">${data[0].region}</h4>
    <p class="country__row"><span>👫</span>${(
      +data[0].population / 1000000
    ).toFixed(1)}M People</p>
    <p class="country__row"><span>🗣️</span>${data[0].languages[0].name}</p>
    <p class="country__row"><span>💰</span>${data[0].currencies[0].name}</p>
  </div>
</article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};
///////////////////////////////////////

// const renderCountry = function (data, className = '') {
//   const html = ` <article class="country ${className}">
//   <img class="country__img" src="${data[0].flag}" />
//   <div class="country__data">
//     <h3 class="country__name">${data[0].name}</h3>
//     <h4 class="country__region">${data[0].region}</h4>
//     <p class="country__row"><span>👫</span>${(
//       +data[0].population / 1000000
//     ).toFixed(1)}M People</p>
//     <p class="country__row"><span>🗣️</span>${data[0].languages[0].name}</p>
//     <p class="country__row"><span>💰</span>${data[0].currencies[0].name}</p>
//   </div>
// </article>`;
//   countriesContainer.insertAdjacentHTML('beforeend', html);
//   countriesContainer.style.opacity = 1;
// };

const getCountryAndNeighbour = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/v3.1/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText);
    // console.log(data);
    // Render country 1
    // renderCountry(data);
    // Get neighbour country (2)

    const [neighbour] = data[0].borders;

    if (!neighbour) return;
    // // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.eu/v3.1/alpha/${neighbour}`);
    request2.send();
    request2.addEventListener('load', function () {
      const data2 = [JSON.parse(this.responseText)];
      // console.log(data2);
      // renderCountry(data2, 'neighbour');
    });
  });
};
getCountryAndNeighbour('viet nam');
/*
setTimeout(() => {
  console.log('1 second passed');
}, 5000); */

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
    return response.json();
  });
};

// const getCountryData = function (country) {
//   //Country 1
//   fetch(`https://restcountries.eu/v3.1/name/${country}`)
//     .then(response => {
//       console.log(response);
//       if (!response.ok) throw new Error(`Country not found ${response.status}`);
//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data);
//       // const neighbour = data[0].borders[0];
//       const neighbour = 'dadsa';
//       if (!neighbour) return;
//       // Country 2
//       return fetch(`https://restcountries.eu/v3.1/alpha/${neighbour}`);
//     })
//     .then(response => {
//       console.log(response);
//       if (!response.ok) throw new Error(`Country not found ${response.status}`);
//       return response.json();
//     })
//     .then(data => renderCountry([data], 'neighbour'))
//     .catch(err => {
//       console.error(`${err} 💥💥💥`);
//       renderError(`Something went wrong 💥💥 ${err.message}. Try again! `);
//     })
//     .finally(() => (countriesContainer.style.opacity = 1));
// };

const getCountryData = function (country) {
  //Country 1
  getJSON(
    `https://restcountries.eu/v3.1/name/${country}`,
    'Country not found'
  )
    .then(data => {
      renderCountry(data);
      const neighbour = data[0].borders[0];

      if (!neighbour) throw new Error(`Country not found!`);
      // Country 2
      return getJSON(
        `https://restcountries.eu/v3.1/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry([data], 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again! `);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};
btn.addEventListener('click', function () {
  // getCountryData('germany');
});

///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀

const whereAmI = function (lat, lng) {
  fetch(` https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city},${data.country}`);
      return fetch(`https://restcountries.eu/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .then(data => renderCountry(data))
    .catch(err => console.error(`${err.message} 💥`));
};
whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);
///////////////////////
console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0);
Promise.resolve('Resolved promise 1').then(res => console.log(res));

Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 1; i < 1000000; i++) {}
  console.log(res);
});

console.log('Test End');

const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening 😜');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN 🎇');
    } else {
      reject(new Error('You lose your money 🎃'));
    }
  }, 2000);
});
lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));
// Promise SetTimeout
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('I waited for 1 seconds');
    return wait(1);
  })
  .then(() => {
    console.log('I waited for 2 seconds');
    return wait(1);
  })
  .then(() => {
    console.log('I waited for 3 seconds');
    return wait(1);
  })
  .then(() => {
    console.log('I waited for 4 seconds');
    return wait(1);
  })
  .then(() => console.log('I waited 5 second'));

Promise.resolve('abs').then(x => console.log(x));

///////////////////////

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// getPosition().then(pos => console.log(pos));
const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(` https://geocode.xyz/${lat},${lng}?geoit=json`);
    })

    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city},${data.country}`);
      return fetch(`https://restcountries.eu/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .then(data => renderCountry(data))
    .catch(err => console.error(`${err.message} 💥`));
};
btn.addEventListener('click', whereAmI);

*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
///////////
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};
const imgContainer = document.querySelector('.images');
const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
      img.addEventListener('error', function () {
        reject(new Error('Image not found'));
      });
    });
  });
};

let currentImg;
createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
  })
  .catch(err => console.error(err));

///////////////////////
// Sync Function
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// Country Data
// fetch(`https://restcountries.eu/v3.1/name/${country}`).then(res =>   console.log(res));

const whereAmI = async function () {
  // repair Error
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    // Reverse geocoding
    const resGeo = await fetch(` https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!resGeo.ok) throw new Error('Problem getting location data');
    const dataGeo = await resGeo.json();
    const res = await fetch(
      `https://restcountries.eu/v3.1/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error('Problem getting location country');
    const data = await res.json();
    renderCountry(data);
    return `You are in ${dataGeo.city}`;
  } catch (err) {
    renderError(`Something went wrong 💥 ${err.message}`);
    // reject Promise returned from async function
    throw err;
  }
};
console.log('1:Will get location');
// const city = whereAmI();
// console.log(city);
// whereAmI()
//   .then(city => console.log(`2:${city}`))
//   .catch(err => console.log(`2:${err.message}`))
//   .finally(() => console.log('3:finished getting location'));

(async function () {
  try {
    const city = await whereAmI();
    console.log(`2:${city}`);
  } catch (err) {
    console.log(`2:${err.message}`);
  }
  console.log('3:finished getting location');
})();

 

///////////////////////
const get3Country = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(
    //   `https://restcountries.eu/v3.1/name/${c1}`
    // );
    // const [data2] = await getJSON(
    //   `https://restcountries.eu/v3.1/name/${c2}`
    // );
    // const [data3] = await getJSON(
    //   `https://restcountries.eu/v3.1/name/${c3}`
    // );
    // console.log([data1.capital, data2.capital, data3.capital]);
    const data = await Promise.all([
      getJSON(`https://restcountries.eu/v3.1/name/${c1}`),
      getJSON(`https://restcountries.eu/v3.1/name/${c2}`),
      getJSON(`https://restcountries.eu/v3.1/name/${c3}`),
    ]);
    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.log(`${err.message}`);
  }
};
get3Country('portugal', 'viet nam', 'canada');

// Promise.race

(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.eu/v3.1/name/italy`),
    getJSON(`https://restcountries.eu/v3.1/name/mexico`),
    getJSON(`https://restcountries.eu/v3.1/name/egypt`),
  ]);
  console.log(res[0]);
})();
const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long !'));
    }, sec * 1000);
  });
};
Promise.race([
  getJSON(`https://restcountries.eu/v3.1/name/italy`),
  timeout(1),
])
  .then(res => console.log(res[0]))
  .catch(err => console.log(err));
// Promise.allSettled
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another Success'),
]).then(res => console.log(res));

Promise.all([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));
// Promise.any [ES2021]
// Return Promise first and skip reject
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

   */

///////////////////////////////////////
// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/
const wait = function (seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};
const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

// let currentImg;
// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     console.log('Image 1 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-2.jpg');
//   })
//   .then(img => {
//     currentImg = img;

//     console.log('Image 2 loaded');
//     return wait(2);
//   })
//   .then(() => (currentImg.style.display = 'none'))
//   .catch(err => console.error(err));

// Part 1
const loadNPause = async function () {
  try {
    //Load  image 1
    let img = await createImage('img/img-1.jpg');
    console.log('Image 1 loaded');
    await wait(2);
    img.style.display = 'none';
    //Load  image 2
    img = await createImage('img/img-2.jpg');
    console.log('Image 2 loaded');
    await wait(2);
    img.style.display = 'none';
  } catch (err) {
    console.error(err);
  }
};
// loadNPause();
//Part 2: load
const loadAll = async function (imgArr) {
  try {
    const imgs = imgArr.map(async img => await createImage(img));
    // console.log(imgs);
    const imgsEl = await Promise.all(imgs);
    //  console.log(imgsEl);
    imgsEl.forEach(img => img.classList.add('parallel'));
  } catch (err) {
    console.error(err);
  }
};
loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']);

/*
 Lesson Promise
 let promise = new Promise((resolve,reject)=>{
   // logic
   // success!:resolve();
  // fall!: reject();
  // Fake Api
 })

 promise.then(()=>{
   console.log(1);
   return 1
 }).
 then ((one)=>{
   console.log(one);
   // output  1;
 }).catch(err=>console.log(err);)

 let users=[
   {
     id:1,
     name:'john',
   },
   {
     id:2,
     name:'jayKey',
   }
 ]

*/

//IIFE - Immediately Invoked Function Expression

// console.log(1);
// (function () {
//   var name = 'john';
// })();

//Scope
// {
//   {
//     const age = 18;
//     {
//       console.log(age);
//     }
//   }
// }

// Closure
// function  createStorage(key){
//   const store= JSON.parse(localStorage.getItem(key)) ?? {};
//   const save=()=>{
//     localStorage.setItem()
//   }
//   const storage={
//     get(key){
//       return store[key];
//     },
//     set(key,value){
//       store[key]=value;
//       save();
//     },
//     remove(key){
//       delete  store[key];
//       save();
//     }
//   }
//   return storage;
// }

// const profileSetting=createStorage('profile_setting');

// const teacher={
//   firstName:"nguyen",
//   lastName:"dao",
//   getFullName(){
//     console.log(`${this.firstName} ${this.lastName}`);
    
//   }
// }

// const button= document.querySelector('button');
// console.log(this);
// button.onclick=teacher.getFullName.bind(teacher);



// const currentPromise= new Promise((resolve,reject)=>{
//   let isCondition=true;
//   if(isCondition){
//     setTimeout(()=>{
//       resolve('success');
//     },3000)
//   }else {
//     reject('error')
//   }

// })
// currentPromise.then(data=>
//   console.log(data)
// )
// console.log(123);

// class student {
//   #firstName;
//   #lastName;
//   constructor(lastName,firstName){
//     this.#firstName=firstName;
//     this.#lastName=lastName;
//   }
//    getName(){
//     console.log(`${firstName} ${lastName}`);
//   }
// }

// const firstStudent=new student('key','xk');
// firstStudent.firstName='nam';
// console.log(firstStudent.firstName);

// fetch('https://json-server-todo-demo.herokuapp.com/api/data').then((res)=>{
//     let data= res.json();
//    console.log(data);
//   return data;
// }).then(
//   (result)=>{
//    console.log(result);
//   }
// );
///////////////////////////////////////Operator Advance////////////////////////////////////

/// Operator Comma; take value to first own comma clause tow
 
// let arr=[1,2,3,4][2,1,0];
// console.log(arr);

///////////////Delete//////////////

// var myVar = 1;
// 	var output = (function(){
// 		delete myVar;
// 		return myVar;
// 	})();
	
// function MyFunc(){}
// 	MyFunc.prototype.bar = 42;
// 	var myFunc = new MyFunc();

//   delete myFunc.bar;

//   console.log(myFunc.bar);

//   delete MyFunc.prototype.bar;
// 	console.log(myFunc.bar);	

// var data = [0, 1, 2];
// 	var funcs = [];

// 	function init() {						// 0
// 		for (var i = 0; i < 3; i++) {
				
//     		var x = data[i];				// 1
//     		var innerFunc = function() { 	// 2
//     			var temp = x;
//     			return function() {
//     				return temp;
//     			}; 
//     		}();

// 			funcs.push(innerFunc);			// 3
// 		}
// 	}

// 	function run() {						// 4
// 		for (var i = 0; i < 3; i++) {
// 		    console.log(data[i] + ", " +  funcs[i]());   // 5
// 		}
// 	}

// 	init();
// 	run();
//   var myObject = {
//     myCountryName: 'India',
//     getMyCountryName: function (){			   // 1
//         return this.myCountryName;
//     }
// };

// var countryInfo = myObject.getMyCountryName;  // 2

// console.log(countryInfo());	                  // undefined
// console.log(myObject.getMyCountryName());	  //  India
