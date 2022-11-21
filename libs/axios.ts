import axios from 'axios';
const instance = axios.create();

instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.interceptors.request.use(
	config => config,
	error => Promise.reject(error)
);

instance.interceptors.response.use(
	response => response,
	error => Promise.reject(error)
);

export default instance;
