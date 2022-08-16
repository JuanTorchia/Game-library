import axios from 'axios'

export const rapidAPI = {
  getgames
}

// function getgames(text) {
//   return instance.get(`?apikey=${process.env.REACT_APP_OMDB_API_KEY}&t=${encodeURI(text)}`)
// }
//
// // -- Axios
//
// const instance = axios.create({
//   baseURL: config.url.OMDB_BASE_URL
// })

async function getgames(text) {
    const response = await axios.get(
        `https://steam2.p.rapidapi.com/search/${encodeURI(text)}/page/1`,
        {
            headers: {
                'x-rapidapi-host': 'steam2.p.rapidapi.com',
                'x-rapidapi-key': '15863034b9msh26d2f2e3b6b5800p1b126fjsn4e460b9df1ac'
            }
        }
    );
    return response.data;
}

// const getgames = async (text) => {
//   const res = await axios.get(
//       `https://steam2.p.rapidapi.com/search/${encodeURI(text)}/page/1`,
//       {
//         headers: {
//           'x-rapidapi-host': 'steam2.p.rapidapi.com',
//           'x-rapidapi-key': '15863034b9msh26d2f2e3b6b5800p1b126fjsn4e460b9df1ac'
//         }
//       }
//   );
//   return console.log(res.data);
// };
