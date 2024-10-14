import axios from 'axios';

export async function getFssp(name, birthDate) {
  return axios.get('https://service.api-assist.com/parser/info_api', {
    params: {
      type: 'TYPE_SEARCH_FIZ',
      regionID: -1,
      dob: birthDate,
      key: process.env.TOKEN,
      firstName: name.split(' ')[1],
      lastName: name.split(' ')[0],
      patronymic: name.split(' ')[2]
    },
  });
}
