import axios from 'axios'


const instance = axios.create({
    baseURL:'https://react-my-burger-132a1.firebaseio.com/'
})

export default instance;