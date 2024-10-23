import axios from 'axios';

export async function getFssp(client) {
  return axios.get('https://service.api-assist.com/parser/info_api', {
    params: {
      type: 'TYPE_SEARCH_FIZ',
      key: process.env.TOKEN,
      regionID: -1,
      ...client
    }
  });
}

export async function getFssMockData(data) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          result: data ? [data] : []
        }
      });
    });
  });
}
