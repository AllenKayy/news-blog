const currentDate = document.querySelector('#current-date');

const getCurrentDate = () => {
    const date = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }

    console.log(currentDate.innerText = date.toLocaleDateString("en-NG",options))
}
getCurrentDate();

// fetch("https://newsapi.org/v2/everything?q=-sex", {
//     method: 'GET',
//     headers: {
//         'X-Api-Key': '099148be22804e849a0c6fe022b7cf5e'
//     }})
// .then(res => res.json())
// .then(data => {
//     // return console.log(data)
//         data.articles.map(props => {
//             if(props.description.toLowerCase().includes('tesla')) {
//                 console.log(props)
//             } else {
//                 console.log('Not found')
//             }
//         })
// })
// .catch(err => console.error("error:", err))