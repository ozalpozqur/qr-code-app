import axios from 'axios';
const instance = axios.create();

instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.validateStatus = status => status < 500;
instance.interceptors.request.use(
	config => config,
	error => error
);

instance.interceptors.response.use(
	response => response,
	error => Promise.reject(error)
);

export default instance;
